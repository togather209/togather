package com.common.togather.common.websocket.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DateUpdateRequestMessage {

    LocalDate newDate;
    int bookmarkId;

}
