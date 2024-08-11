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
}
