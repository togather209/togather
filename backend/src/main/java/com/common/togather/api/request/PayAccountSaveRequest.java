package com.common.togather.api.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayAccountSaveRequest {

    // Pay 계좌 별칭
    private String accountName;
    // 거래 비밀번호
    private int password;
    // 연결할 가상 계좌 번호
    private String accountNum;

}
