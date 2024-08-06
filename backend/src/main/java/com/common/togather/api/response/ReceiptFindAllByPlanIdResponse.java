package com.common.togather.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptFindAllByPlanIdResponse {

    private Integer receiptId;
    private String businessName;
    private Integer totalPrice;
    private String paymentDate;
    private Integer color;
}
