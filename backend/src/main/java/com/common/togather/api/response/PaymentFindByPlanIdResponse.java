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
public class PaymentFindByPlanIdResponse {

    // 모임명
    private String teamTitle;

    // 일정명
    private String planTitle;

    // 시작일
    private String startDate;

    // 종료일
    private String endDate;

    // 정산 상태
    private Integer status;

    // 정산 받을 금액
    private List<ReceiverPayment> receiverPayments;

    // 정산 보낼 금액
    private List<SenderPayment> senderPayments;

    // 지출 상세(품목) 내역
    private List<MemberItem> memberItems;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SenderPayment {
        private String name;
        private Integer money;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReceiverPayment {
        private String name;
        private Integer money;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberItem {
        private String name;
        private Integer money;
    }
}
