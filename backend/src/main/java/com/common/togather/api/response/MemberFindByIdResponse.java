package com.common.togather.api.response;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberFindByIdResponse {
    private int memberId;
    private String email;
    private String nickname;
    private String profileImg;
    private String name;
    private int type;
}
