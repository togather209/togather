package com.common.togather.api.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayAccountTransferRequest {

    private int targetMemberId;
    private int price;

}
