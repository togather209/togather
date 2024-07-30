package com.common.togather.api.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 일반 회원가입시 요청 DTO
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemberSaveRequest {

    private String email;
    private String password;
    private String nickname;

}
