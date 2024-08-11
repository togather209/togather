package com.common.togather.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReceiptFinalAllByBookmarkResponse {

    private Integer receiptId;
    private String businessName;
    private Integer totalPrice;
    private LocalDateTime paymentDate;
    private Integer color;

}
