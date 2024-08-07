package com.common.togather.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamFindByTeamIdResponse {

    private String title;
    private String teamImg;
    private String description;
    private String code;
    private boolean isAdmin;
    private List<PlanFindAllByTeamIdResponse> plans;

}
