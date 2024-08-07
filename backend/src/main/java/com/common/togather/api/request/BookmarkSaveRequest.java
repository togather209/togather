package com.common.togather.api.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookmarkSaveRequest {
    private String placeId; // 장소 아이디
    private String placeImg; // 장소 이미지
    private String placeName; // 장소 이름
    private String placeAddr; // 장소 주소
}
