package com.common.togather.common.websocket.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderUpdateRequestMessage {

    int bookmarkId;
    int newOrder;

}
