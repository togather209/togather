package com.common.togather.common.websocket.message;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DateUpdateResponseMessage {

    LocalDate oldDate;
    List<OneBookmarkMessage> oldDateList;
    LocalDate newDate;
    List<OneBookmarkMessage> newDateList;

}
