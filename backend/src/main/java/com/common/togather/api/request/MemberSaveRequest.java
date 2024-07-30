package com.common.togather.api.request;

import lombok.Getter;
import lombok.Setter;

// 일반 회원가입시 요청 DTO
@Getter
@Setter
public class MemberSaveRequest {

    private String email;
    private String password;
    private String nickname;

}
