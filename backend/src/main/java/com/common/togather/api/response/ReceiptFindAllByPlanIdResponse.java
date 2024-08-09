package com.common.togather.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptFindAllByPlanIdResponse {

    int status;
    List<ReceiptFindByPlanId> ReceiptFindByPlanIds;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReceiptFindByPlanId {
        private Integer receiptId;
        private String businessName;
        private Integer totalPrice;
        private String paymentDate;
        private Integer color;
    }
}

