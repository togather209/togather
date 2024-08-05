package com.common.togather.api.service;

import com.common.togather.api.error.*;
import com.common.togather.api.request.ReceiptSaveRequest;
import com.common.togather.api.request.ReceiptUpdateRequest;
import com.common.togather.api.response.ReceiptFindAllByPlanIdResponse;
import com.common.togather.api.response.ReceiptFindByReceiptIdResponse;
import com.common.togather.db.entity.*;
import com.common.togather.db.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceiptService {

    private final ReceiptRepositorySupport receiptRepositorySupport;
    private final ReceiptRepository receiptRepository;
    private final TeamMemberRepositorySupport teamMemberRepositorySupport;
    private final MemberRepository memberRepository;
    private final BookmarkRepository bookmarkRepository;
    private final PlanRepository planRepository;
    private final ItemRepository itemRepository;

    public ReceiptFindByReceiptIdResponse findReceiptByReceiptId(String email, int teamId, int receiptId) {

        existTeamMember(email, teamId);

        return receiptRepositorySupport.findReceiptByReceiptId(email, receiptId)
                .orElseThrow(() -> new ReceiptNotFoundException(receiptId + "번 영수증이 존재하지 않습니다."));
    }

    public List<ReceiptFindAllByPlanIdResponse> findAllReceiptByPlanId(String email, int teamId, int planId) {

        existTeamMember(email, teamId);

        return receiptRepositorySupport.findAllByPlanId(planId).get();
    }

    @Transactional
    public void SaveReceipt(String email, int teamId, int planId, ReceiptSaveRequest requestDto) {

        Member manager = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("해당 이메일로 가입된 회원이 없습니다."));

        existTeamMember(email, teamId);

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        Bookmark bookmark = getBookmark(requestDto.getBookmarkId());

        Receipt receipt = Receipt.builder()
                .plan(plan)
                .manager(manager)
                .bookmark(bookmark)
                .businessName(requestDto.getBusinessName())
                .paymentDate(requestDto.getPaymentDate())
                .totalPrice(requestDto.getTotalPrice())
                .color(requestDto.getColor())
                .build();

        List<Item> items = requestDto.getItems().stream().map(itemRequest -> {
            Item item = Item.builder()
                    .name(itemRequest.getName())
                    .unitPrice(itemRequest.getUnitPrice())
                    .count(itemRequest.getCount())
                    .receipt(receipt)
                    .build();

            if (itemRequest.getMembers() != null) {
                item.saveItemMembers(itemRequest.getMembers().stream()
                        .map(memberRequest -> {
                            Member member = getMember(memberRequest.getMemberId());
                            return ItemMember.builder()
                                    .member(member)
                                    .item(item)
                                    .build();

                        }).toList()
                );
            }
            return item;

        }).toList();

        receipt.saveItems(items);

        receiptRepository.save(receipt);
    }

    @Transactional
    public void UpdateReceipt(String email, int receiptId, ReceiptUpdateRequest requestDto) {

        Receipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ReceiptNotFoundException(receiptId + "번 영수증이 존재하지 않습니다."));

        if (!receipt.isManager(email)) {
            throw new UnauthorizedAccessException(receiptId + "번 영수증의 접근 권환이 없습니다.");
        }

        Bookmark bookmark = null;
        if (requestDto.getBookmarkId() != null) {
            bookmark = getBookmark(requestDto.getBookmarkId());
        }

        receipt.updateReceipt(bookmark,
                requestDto.getBusinessName(),
                requestDto.getPaymentDate(),
                requestDto.getTotalPrice(),
                requestDto.getColor()
        );

        itemRepository.deleteAll(receipt.getItems());
        receipt.getItems().clear();

        List<Item> updatedItems = requestDto.getItems().stream().map(itemRequest -> {
            Item item = Item.builder()
                    .name(itemRequest.getName())
                    .unitPrice(itemRequest.getUnitPrice())
                    .count(itemRequest.getCount())
                    .receipt(receipt)
                    .build();

            if (itemRequest.getMembers() != null) {
                item.saveItemMembers(itemRequest.getMembers().stream()
                        .map(memberRequest -> {
                            Member member = getMember(memberRequest.getMemberId());
                            return ItemMember.builder()
                                    .member(member)
                                    .item(item)
                                    .build();

                        }).toList()
                );
            }
            return item;
        }).toList();

        receipt.addItems(updatedItems);
    }

    private Member getMember(Integer memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException("유저 " + memberId + "는 존재하지 않습니다."));
    }

    private Bookmark getBookmark(int bookmarkId) {
        return bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new BookmarkNotFoundException("해당 북마크가 존재하지 않습니다."));
    }

    private void existTeamMember(String email, int teamId) {
        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, email)
                .orElseThrow(() -> new MemberTeamNotFoundException(teamId + "팀에 " + email + "유저가 존재하지 않습니다."));
    }
}
