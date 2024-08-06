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
public class ReceiptFindByReceiptIdResponse {

    private Integer receiptId;
    private String managerName;
    private String businessName;
    private Integer totalPrice;
    private String paymentDate;
    private Integer bookmarkId;
    private Integer color;
    private Boolean isManager;
    private List<ItemFindByReceipt> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemFindByReceipt {
        private String name;
        private Integer unitPrice;
        private Integer count;
        private List<MemberFindByReceipt> members;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class MemberFindByReceipt {
            private String nickname;
            private String profileImg;
        }
    }
}
