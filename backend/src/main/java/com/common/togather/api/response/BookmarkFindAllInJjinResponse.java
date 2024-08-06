package com.common.togather.api.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookmarkFindAllInJjinResponse {

    private int bookmarkId;
    private String placeId;
    private String placeImg;
    private String placeName;
    private String placeAddr;
    private int receiptCnt;

}
