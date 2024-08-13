package com.common.togather.api.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlarmFindByMemberResponse {

    private Integer id;

    private String title;

    private String content;

    private int type;

    private AlarmDto alarmDto;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AlarmDto{
        private Integer teamId;
        private Integer planId;
    }
}
