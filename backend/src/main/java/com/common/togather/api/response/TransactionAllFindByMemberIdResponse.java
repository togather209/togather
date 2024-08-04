package com.common.togather.api.response;

import com.common.togather.db.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionAllFindByMemberIdResponse {

    // 거래 내역 ID
    private int transactionListId;
    // 송신인 이름
    private String senderName;
    // 수취인 이름
    private String receiverName;
    // 송금 금액
    private int price;
    // 0 : 입금, 1 : 출금
    private int status;
    // 날짜
    private String date;

    public TransactionAllFindByMemberIdResponse(Transaction transaction){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        this.transactionListId = transaction.getId();
        this.senderName = transaction.getSenderName();
        this.receiverName = transaction.getReceiverName();
        this.price = transaction.getPrice();
        this.status = transaction.getStatus();
        this.date = transaction.getDate().format(formatter);
    }

}
