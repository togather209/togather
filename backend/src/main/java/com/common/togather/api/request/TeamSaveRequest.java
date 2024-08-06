package com.common.togather.api.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamSaveRequest {
    private String title;
    private String teamImg;
    private String description;
}
