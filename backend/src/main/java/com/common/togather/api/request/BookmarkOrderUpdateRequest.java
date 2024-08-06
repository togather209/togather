package com.common.togather.api.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookmarkOrderUpdateRequest {

    private int newOrder; // 이동한 요소가 갖는 새로운 순서값

}
