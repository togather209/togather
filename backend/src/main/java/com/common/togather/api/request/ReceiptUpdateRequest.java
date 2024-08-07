package com.common.togather.api.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptUpdateRequest {

    // 상호명
    @NotBlank(message = "상호명은 필수 입력값입니다.")
    private String businessName;

    // 총 금액
    @NotNull(message = "총금액은 필수 입력값입니다.")
    @Positive(message = "총금액은 양수여야 합니다.")
    private Integer totalPrice;

    // 결제 일자
    @NotNull(message = "결제 일자는 필수 입력값입니다.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private LocalDateTime paymentDate;

    // 북마크
    private Integer bookmarkId;

    // 색
    @NotNull(message = "색은 필수 입력값입니다.")
    private Integer color;

    // 품목
    @NotEmpty(message = "품목은 필수 입력값입니다.")
    private List<ItemUpdateByReceipt> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemUpdateByReceipt {

        // 품목명
        @NotBlank(message = "품목명은 필수 입력값입니다.")
        private String name;

        // 단가
        @NotNull(message = "단가는 필수 입력값입니다.")
        @Positive(message = "단가는 양수여야 합니다.")
        private Integer unitPrice;

        // 수량
        @NotNull(message = "수량은 필수 입력값입니다.")
        @Positive(message = "수량은 양수여야 합니다.")
        private Integer count;

        // 품목 유저
        @NotEmpty(message = "품목 유저는 필수 입력값입니다.")
        private List<MemberUpdateByReceipt> members;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class MemberUpdateByReceipt {

            // 유저 아이디
            @NotNull(message = "유저 아이디는 필수 입력값입니다.")
            private Integer memberId;
        }
    }
}
