package com.common.togather.api.controller;

import com.common.togather.api.request.BookmarkDateUpdateRequest;
import com.common.togather.api.request.BookmarkSaveRequest;
import com.common.togather.api.response.BookmarkUpdateDateResponse;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.BookmarkService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams/{teamId}/plans/{planId}")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @Operation(summary = "북마크 등록")
    @PostMapping("/bookmarks")
    public ResponseEntity<ResponseDto<String>> saveBookmark(@PathVariable("teamId") int teamId, @PathVariable("planId") int planId,
                                                           @RequestHeader(value = "Authorization", required = false) String header,
                                                           @RequestBody BookmarkSaveRequest request){

        bookmarkService.addBookmark(teamId, planId, header, request);
        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("찜 목록에 추가 되었습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);

    }

    @Operation(summary = "북마크 날짜 지정 및 수정")
    @PatchMapping("/bookmakrs/{bookmarkId}/date")
    public ResponseEntity<ResponseDto<BookmarkUpdateDateResponse>> updateBookmarkDate(@PathVariable("teamId") int teamId, @PathVariable("planId") int planId, @PathVariable("bookmarkId") int bookmarkId,
                                                                                      @RequestHeader(value = "Authorization", required = false) String header,
                                                                                      @RequestBody BookmarkDateUpdateRequest request){

        BookmarkUpdateDateResponse response = bookmarkService.updateDate(teamId, planId, bookmarkId, header, request);
        ResponseDto<BookmarkUpdateDateResponse> responseDto = ResponseDto.<BookmarkUpdateDateResponse>builder()
                .status(HttpStatus.OK.value())
                .message("해당 장소의 날짜를 새로 지정했습니다.")
                .data(response)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
