package com.common.togather.api.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookmarkDateUpdateResponse {
    private int bookmarkId; // 북마크 아이디
    private String placeId; // 장소 아이디
    private String placeImg; // 장소 이미지
    private String placeName; // 장소 이름
    private String placeAddr; // 장소 주소
    private int itemOrder; // 순서
    private int receiptCnt; // 맵핑된 영수증의 수
}
