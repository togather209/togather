package com.common.togather.api.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookmarkFindAllInJjinResponse {

    private int bookmarkId;
    private LocalDate date; // 북마크 날짜
    private String placeId;
    private String placeImg;
    private String placeName;
    private String placeAddr;
    private int itemOrder;
    private int receiptCnt;

}
