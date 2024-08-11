package com.common.togather.api.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlanSaveResponse {
    int teamId;
    int planId;
    String sessionId;
}
