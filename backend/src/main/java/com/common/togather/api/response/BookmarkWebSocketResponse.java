package com.common.togather.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookmarkWebSocketResponse {
    private LocalDate oldDate; // 이전 날짜
    private List<BookmarkDateUpdateResponse> oldDateBookmarks; // 이전 날짜의 북마크 리스트
    private LocalDate newDate; // 새로운 날짜
    private List<BookmarkDateUpdateResponse> newDateBookmarks; // 새로운 날짜의 북마크 리스트
}
