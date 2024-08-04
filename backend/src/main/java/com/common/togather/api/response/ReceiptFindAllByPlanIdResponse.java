package com.common.togather.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptFindAllByPlanIdResponse {

    private Integer receiptId;
    private String businessName;
    private Integer totalPrice;
    private LocalDateTime paymentDate;
    private Integer color;
}
