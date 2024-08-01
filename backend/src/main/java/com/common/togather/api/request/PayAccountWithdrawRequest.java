package com.common.togather.api.request;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayAccountWithdrawRequest {
    
    // 출금 금액
    private int price;

}
