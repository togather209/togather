package com.common.togather.api.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KakaoUserInfoResponse {

    private String nickname;
    private String email;
    private String fcmToken;

}
