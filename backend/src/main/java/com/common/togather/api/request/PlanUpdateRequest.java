package com.common.togather.api.request;

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

    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;

}
