package com.common.togather.api.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlanFindByPlanIdResponse {
    
    private int managerId; // 일정장
    private String title; // 일정제목
    private String description; // 일정설명
    private LocalDate startDate; // 일정 시작 날짜
    private LocalDate endDate; // 일정 종료 날짜
    private Boolean isManager; // 일정장인지 여부

}
