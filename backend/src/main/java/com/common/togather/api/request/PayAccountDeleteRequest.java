package com.common.togather.api.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayAccountDeleteRequest {

    // Pay 계좌 비밀번호
    private String payAccountPassword;

}
