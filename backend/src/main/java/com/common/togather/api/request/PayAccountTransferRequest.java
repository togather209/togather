package com.common.togather.api.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayAccountTransferRequest {

    // 수취인 아이디
    private int targetMemberId;
    // 이체 금액
    private int price;
    // Pay 계좌 비밀번호
    private String payAccountPassword;

}
