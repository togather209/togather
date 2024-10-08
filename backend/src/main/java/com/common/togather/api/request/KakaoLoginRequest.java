package com.common.togather.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KakaoLoginRequest {

    private String code;
    private String fcmToken;

}
