package com.common.togather.api.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlanUpdateRequest {

    @NotBlank(message = "제목은 필수 입력값입니다.")
    private String title;

    private String description;

    @NotBlank(message = "시작 날짜는 필수 입력값입니다.")
    private LocalDate startDate;

    @NotBlank(message = "종료 날짜는 필수 입력값입니다.")
    private LocalDate endDate;

}
