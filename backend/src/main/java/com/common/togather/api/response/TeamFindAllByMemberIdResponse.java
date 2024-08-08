package com.common.togather.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamFindAllByMemberIdResponse {

    private Integer teamId;
    private String title;
    private String teamImg;
    private String description;
    private boolean isAdmin;
}
