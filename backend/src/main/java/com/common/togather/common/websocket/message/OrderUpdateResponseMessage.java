package com.common.togather.common.websocket.message;

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
public class OrderUpdateResponseMessage {

    LocalDate date;
    List<OneBookmarkMessage> newOrderList;

}
