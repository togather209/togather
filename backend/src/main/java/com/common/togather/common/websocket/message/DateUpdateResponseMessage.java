package com.common.togather.common.websocket.message;

import com.common.togather.api.response.BookmarkDateUpdateResponse;
import com.common.togather.db.entity.Bookmark;

import java.time.LocalDate;
import java.util.List;

public class DateUpdateResponseMessage {

    LocalDate oldDate;
    List<BookmarkDateUpdateResponse> oldDateList;
    LocalDate newDate;
    List<BookmarkDateUpdateResponse> newDateList;

}
