package com.common.togather.api.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountVerificationRequest {

    private String accountNumber;
    private int password;
    private String memberName;
    private String birth;
    private int type;

}
