package com.common.togather.api.response;

import com.common.togather.common.auth.TokenInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KakaoLoginResponse {

    private Boolean isMember;
    private TokenInfo tokenInfo;
    private KakaoUserInfoResponse kakaoUserInfo;

}
