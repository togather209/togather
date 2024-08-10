package com.common.togather.api.service;

import com.common.togather.api.error.*;
import com.common.togather.api.request.TransactionSaveRequest;
import com.common.togather.api.response.PaymentFindByPlanIdAndMemberResponse;
import com.common.togather.api.response.PaymentFindByPlanIdResponse;
import com.common.togather.api.response.PaymentFindByPlanIdResponse.MemberItem;
import com.common.togather.api.response.PaymentFindByPlanIdResponse.ReceiverPayment;
import com.common.togather.api.response.PaymentFindByPlanIdResponse.SenderPayment;
import com.common.togather.api.response.PaymentFindDto;
import com.common.togather.db.entity.*;
import com.common.togather.db.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepositorySupport paymentRepositorySupport;
    private final PaymentRepository paymentRepository;
    private final TeamMemberRepositorySupport teamMemberRepositorySupport;
    private final PlanRepository planRepository;
    private final MemberRepository memberRepository;
    private final PayAccountRepository payAccountRepository;
    private final TransactionService transactionService;

    private final String systemName = "TOGETHER";
    private final Integer systemType = 1;

    public PaymentFindByPlanIdResponse findPaymentByPlanId(String email, int teamId, int planId) {

        TeamMember teamMember = teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, email)
                .orElseThrow(() -> new MemberTeamNotFoundException(teamId + "팀에 " + email + "유저가 존재하지 않습니다."));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        Team team = plan.getTeam();

        if (team.getId() != teamId) {
            throw new PlanNotFoundException("해당 팀에 속하는 일정이 존재하지 않습니다.");
        }

        Member system = memberRepository.findByNameAndType(systemName, systemType).get();

        // 돈 받아야하는 사람
        Map<Integer, ReceiverPayment> receiverAmount = new HashMap<>();
        receiverAmount.put(
                system.getId(),
                ReceiverPayment.builder()
                        .name(system.getName())
                        .money(0)
                        .build()
        );

        //  돈 보내야 하는 사람
        Map<Integer, SenderPayment> senderAmount = new HashMap<>();

        // 품목에 대한 총 지출액
        Map<Integer, MemberItem> itemAmount = new HashMap<>();

        // 사용자를 찾는다.
        Member member = memberRepository.findByEmail(email).orElseThrow(() -> new MemberNotFoundException("해당 이메일로 가입된 회원이 없습니다."));

        // 해당 사용자의 영수증
        List<Receipt> receipts = member.getReceipts();

        // 내가 돈을 받아야하는 사람
        for (Receipt receipt : receipts) {
            List<Item> items = receipt.getItems();
            for (Item item : items) {
                // 유저당 돈 계산
                List<ItemMember> itemMembers = item.getItemMembers();
                int amount = item.getUnitPrice() * item.getCount();
                int count = itemMembers.size();
                int memberBalance = getMemberBalance(amount, count);
                int systemBalance = getSystemBalance(amount, count, memberBalance);
                ReceiverPayment systemPayment = receiverAmount.get(system.getId());
                systemPayment.setMoney(systemPayment.getMoney() + systemBalance);

                for (ItemMember itemMember : itemMembers) {
                    Member receiver = itemMember.getMember();

                    if (receiver.getId() == member.getId()) {
                        continue;
                    }

                    if (receiverAmount.containsKey(receiver.getId())) {
                        ReceiverPayment receiverPayment = receiverAmount.get(receiver.getId());
                        receiverPayment.setMoney(receiverPayment.getMoney() + memberBalance);
                    } else {
                        receiverAmount.put(
                                receiver.getId(),
                                ReceiverPayment.builder()
                                        .name(receiver.getName())
                                        .money(memberBalance)
                                        .build()

                        );
                    }
                }
            }
        }

        // 해당 사용자의 품목
        List<ItemMember> itemMembers = member.getItemMembers();

        for (ItemMember itemMember : itemMembers) {
            Item item = itemMember.getItem();
            int amount = item.getUnitPrice() * item.getCount();
            int count = item.getItemMembers().size();
            int memberBalance = getMemberBalance(amount, count);
            Member sender = item.getReceipt().getManager();

            if (sender.getId() == member.getId()) {
                continue;
            }

            itemAmount.put(
                    item.getId(),
                    MemberItem.builder()
                            .name(item.getName())
                            .money(memberBalance)
                            .build()
            );

            // 돈을 보내야하는 사람
            if (senderAmount.containsKey(sender.getId())) {
                SenderPayment senderPayment = senderAmount.get(sender.getId());
                senderPayment.setMoney(senderPayment.getMoney() + memberBalance);
            } else {
                senderAmount.put(
                        sender.getId(),
                        SenderPayment.builder()
                                .name(sender.getName())
                                .money(memberBalance)
                                .build()
                );
            }
        }

        // 정산 상태 얻기
        int status = paymentRepositorySupport.getStatus(member.getId(), planId);

        return PaymentFindByPlanIdResponse.builder()
                .teamTitle(team.getTitle())
                .planTitle(plan.getTitle())
                .startDate(plan.getStartDate().toString())
                .endDate(plan.getEndDate().toString())
                .status(status)
                .receiverPayments(new ArrayList<>(receiverAmount.values()))
                .senderPayments(new ArrayList<>(senderAmount.values()))
                .memberItems(new ArrayList<>(itemAmount.values()))
                .build();
    }

    @Transactional
    public void savePaymentByPlanId(String email, int planId) {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        // 정산 완료 상태 저장
        plan.updateStatus(2);

        //최종 정산 내역
        List<PaymentFindDto> paymentFindDtos = paymentRepositorySupport.findPaymentByPlanId(planId);

        Map<Integer, List<PaymentFindDto>> groupedPayments = groupPaymentsByItemId(paymentFindDtos);

        Map<int[], Payment> paymentMap = new HashMap<>();

        Member system = memberRepository.findByNameAndType(systemName, systemType).get();

        groupedPayments.forEach((itemId, paymentFinds) -> {

            int memberBalance = getMemberBalance(paymentFinds.get(0).getPrice(), paymentFinds.size());
            int systemBalance = getSystemBalance(paymentFinds.get(0).getPrice(), paymentFinds.size(), memberBalance);
            Member receiver = paymentFinds.get(0).getReceiver();

            if (systemBalance > 0) {
                int[] key = new int[]{system.getId(), receiver.getId()};
                setPaymentMap(plan, paymentMap, memberBalance, system, receiver, key);
            }

            for (PaymentFindDto paymentFind : paymentFinds) {
                Member sender = paymentFind.getSender();

                if (sender.getId() == receiver.getId()) {
                    continue;
                }

                int[] key = new int[]{sender.getId(), receiver.getId()};
                setPaymentMap(plan, paymentMap, memberBalance, sender, receiver, key);
            }
        });
        paymentRepository.saveAll(paymentMap.values());
    }

    public PaymentFindByPlanIdAndMemberResponse findPaymentByPlanIdAndMember(String email, int planId) {

        planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        //최종 정산 내역
        List<PaymentFindDto> paymentFindDtos = paymentRepositorySupport.findPaymentByPlanId(planId);

        Map<Integer, List<PaymentFindDto>> groupedPayments = groupPaymentsByItemId(paymentFindDtos);

        // meberId, money (사용자가 보내야하는 금액이 기준)
        Map<Integer, Integer> paymentMap = new HashMap<>();

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));

        groupedPayments.forEach((itemId, paymentFinds) -> {

            int memberBalance = getMemberBalance(paymentFinds.get(0).getPrice(), paymentFinds.size());
            Member receiver = paymentFinds.get(0).getReceiver();

            for (PaymentFindDto paymentFind : paymentFinds) {
                Member sender = paymentFind.getSender();

                if (sender.getId() == receiver.getId()) {
                    continue;
                }

                // 영수증 관리자일때
                if (member.getId() == receiver.getId()) {
                    paymentMap.put(sender.getId(),
                            paymentMap.getOrDefault(sender.getId(), 0) - memberBalance);
                } else if (member.getId() == sender.getId()) {
                    paymentMap.put(receiver.getId(),
                            paymentMap.getOrDefault(receiver.getId(), 0) + memberBalance);
                }
            }
        });

        // 유저가 보내야하는 금액 합
        int total = 0;
        for (int money : paymentMap.values()) {
            if (money > 0) {
                total += money;
            }
        }

        return PaymentFindByPlanIdAndMemberResponse.builder()
                .money(total)
                .build();
    }

    private void setPaymentMap(Plan plan, Map<int[], Payment> paymentMap, int memberBalance, Member sender,
                               Member receiver, int[] key) {
        if (paymentMap.containsKey(key)) {
            int currentMoney = paymentMap.get(key).getMoney();
            paymentMap.put(key, Payment.builder()
                    .plan(plan)
                    .sender(sender)
                    .receiver(receiver)
                    .money(memberBalance + currentMoney)
                    .build());
        } else {
            paymentMap.put(key, Payment.builder()
                    .plan(plan)
                    .sender(sender)
                    .receiver(receiver)
                    .money(memberBalance)
                    .build());
        }
    }

    private int getSystemBalance(int amount, int count, int memberBalance) {
        return amount - (memberBalance * count);
    }

    private int getMemberBalance(int amount, int count) {
        return amount / count;
    }

    public Map<Integer, List<PaymentFindDto>> groupPaymentsByItemId(List<PaymentFindDto> payments) {
        return payments.stream()
                .collect(Collectors.groupingBy(PaymentFindDto::getItemId));
    }

    // 정산내역 송금하기
    public void transferSettlement(String email, int planId) {

        List<Payment> payments = paymentRepository.findByPlanIdAndSenderEmail(planId, email);
        PayAccount payAccount = payAccountRepository.findByMember_Email(email)
                .orElseThrow(() -> new PayAccountNotFoundException("Pay 계좌가 존재하지 않습니다."));
        List<Transaction> myTransaction = payAccount.getTransactions();
        PayAccount targetPayAccount = null;

        // 송금
        for (Payment payment : payments) {
            targetPayAccount = payAccountRepository.findByMemberId(payment.getReceiver().getId())
                    .orElseThrow(() -> new PayAccountNotFoundException("Target Pay 계좌가 존재하지 않습니다."));

            // 송금자의 잔액이 부족한지 확인
            if (payAccount.getBalance() < payment.getMoney()) {
                throw new InsufficientBalanceException("잔액이 부족합니다.");
            }

            payAccount.decreaseBalance(payment.getMoney());
            targetPayAccount.increaseBalance(payment.getMoney());

            TransactionSaveRequest myTransactionSaveRequest = TransactionSaveRequest.builder()
                    .senderName(payAccount.getMember().getName())
                    .receiverName(targetPayAccount.getMember().getName())
                    .price(payment.getMoney())
                    .balance(payAccount.getBalance())
                    .date(LocalDateTime.now())
                    .status(1)  // 출금
                    .payAccountId(payAccount.getId())
                    .build();

            TransactionSaveRequest targetTransactionSaveRequest = TransactionSaveRequest.builder()
                    .senderName(payAccount.getMember().getName())
                    .receiverName(targetPayAccount.getMember().getName())
                    .price(payment.getMoney())
                    .balance(targetPayAccount.getBalance())
                    .date(LocalDateTime.now())
                    .status(0)  // 입금
                    .payAccountId(targetPayAccount.getId())
                    .build();

            transactionService.saveTransaction(myTransactionSaveRequest);
            transactionService.saveTransaction(targetTransactionSaveRequest);

            // 송금 후 정산 내역 삭제
            paymentRepository.delete(payment);

            if (paymentRepository.countByPlanId(planId) == 0) {
                Plan plan = planRepository.findById(planId).get();
                plan.updateStatus(3);
                planRepository.save(plan);
            }
        }
    }
}
