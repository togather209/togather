package com.common.togather.api.request;

import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionSaveRequest {

    // 송신인명
    private String senderName;

    // 수취인명
    private String receiverName;

    // 거래 금액
    private int price;

    // 잔액
    private int balance;

    // 상태
    // 0 : 입금, 1 : 출금
    private int status;

    // 거래 시간
    private LocalDateTime date;

    // Pay 계좌 id
    private int payAccountId;

}
