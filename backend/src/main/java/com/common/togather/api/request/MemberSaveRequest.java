package com.common.togather.api.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 일반 회원가입 시 요청 DTO
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemberSaveRequest {

    private String profileImg;

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "올바른 이메일 형식이어야 합니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
            message = "비밀번호는 8~20자이며, 영 대소문자, 숫자, 특수문자를 적어도 하나 이상 포함해야 합니다.")
    private String password;

    @NotBlank(message = "닉네임은 필수 입력값입니다.")
    @Pattern(regexp = "^(?!.*[\\u1100-\\u11FF])[a-zA-Z0-9가-힣]{2,15}$",
            message = "닉네임은 2~15자이며, 영어, 한글(초성 제외), 숫자로 구성되어야 합니다.")
    private String nickname;

}
