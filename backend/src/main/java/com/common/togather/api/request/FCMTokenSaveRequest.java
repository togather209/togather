package com.common.togather.api.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FCMTokenSaveRequest {
    String FCMToken;
}
