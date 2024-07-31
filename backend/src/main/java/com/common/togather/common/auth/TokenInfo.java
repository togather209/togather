package com.common.togather.common.auth;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TokenInfo {

    private String accessToken;
    private String refreshToken;

}
