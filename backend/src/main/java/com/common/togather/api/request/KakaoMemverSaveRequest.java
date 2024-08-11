package com.common.togather.api.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KakaoMemverSaveRequest {

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "닉네임은 필수 입력값입니다.")
    @Pattern(regexp = "^(?!.*[\\u1100-\\u11FF])[a-zA-Z0-9가-힣]{2,15}$",
            message = "닉네임은 2~15자의 영문 대/소문자, 한글(초성 제외), 숫자만 가능합니다.")
    private String nickname;

}
