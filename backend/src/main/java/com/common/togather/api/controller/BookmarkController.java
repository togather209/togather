package com.common.togather.api.controller;

import com.common.togather.api.request.BookmarkDateUpdateRequest;
import com.common.togather.api.request.BookmarkOrderUpdateRequest;
import com.common.togather.api.request.BookmarkSaveRequest;
import com.common.togather.api.response.*;
import com.common.togather.api.service.BookmarkService;
import com.common.togather.common.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/teams/{teamId}/plans/{planId}")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final JwtUtil jwtUtil;
    private final SseController sseController;

    // 북마크 조회 by 일정 id
    @Operation(summary = "북마크 조회 by 일정 id")
    @GetMapping("/bookmarks")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "북마크 조회를 성공했습니다."
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "2팀에 user1@example.com유저가 존재하지 않습니다.",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "해당 일정은 존재하지 않습니다.",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))
            ),
    })
    public ResponseEntity<ResponseDto<List<BookmarkFindAllByPlanIdResponse>>> findAllReceiptByPlanId(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable(name = "teamId") int teamId,
            @PathVariable(name = "planId") int planId) {

        ResponseDto<List<BookmarkFindAllByPlanIdResponse>> responseDto = ResponseDto.<List<BookmarkFindAllByPlanIdResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("북마크 조회를 성공했습니다.")
                .data(bookmarkService.findAllBookmarkByPlanId(
                        jwtUtil.getAuthMemberEmail(token),
                        teamId,
                        planId))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "북마크 등록")
    @PostMapping("/bookmarks")
    public ResponseEntity<ResponseDto<String>> saveBookmark(@PathVariable("teamId") int teamId, @PathVariable("planId") int planId,
                                                            @RequestHeader(value = "Authorization", required = false) String header,
                                                            @RequestBody BookmarkSaveRequest request) {

        bookmarkService.addBookmark(teamId, planId, header, request);
        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("찜 목록에 추가 되었습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);

    }

    @Operation(summary = "북마크 날짜 지정 및 수정")
    @PatchMapping("/bookmakrs/{bookmarkId}/date")
    public ResponseEntity<ResponseDto<List<BookmarkDateUpdateResponse>>> updateBookmarkDate(@PathVariable("teamId") int teamId, @PathVariable("planId") int planId, @PathVariable("bookmarkId") int bookmarkId,
                                                                                            @RequestHeader(value = "Authorization", required = false) String header,
                                                                                            @RequestBody BookmarkDateUpdateRequest request) {


        ResponseDto<List<BookmarkDateUpdateResponse>> responseDto = ResponseDto.<List<BookmarkDateUpdateResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("해당 장소의 날짜를 새로 지정했습니다.")
                .data(bookmarkService.updateDate(teamId, planId, bookmarkId, header, request))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "동일 날짜 북마크 내에서 순서 수정 (드래그앤드랍)")
    @PatchMapping("/bookmarks/{bookmarkId}/order")
    public ResponseEntity<ResponseDto<List<BookmarkOrderUpdateResponse>>> updateBookmarkOrder(@PathVariable("teamId") int teamId, @PathVariable("planId") int planId,@PathVariable("bookmarkId") int bookmarkId,
                                                                                              @RequestHeader(value = "Authorization", required = false) String header,
                                                                                              @RequestBody BookmarkOrderUpdateRequest request) {
        ResponseDto<List<BookmarkOrderUpdateResponse>> responseDto = ResponseDto.<List<BookmarkOrderUpdateResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("북마크 순서가 변경되었습니다.")
                .data(bookmarkService.updateOrder(teamId, planId, bookmarkId, header, request))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "날짜가 정해진 북마크 조회")
    @GetMapping("/bookmarks/{date}")
    public ResponseEntity<ResponseDto<List<BookmarkFindAllByDateResponse>>> findAllBookmarkByDate(
            @PathVariable("teamId") int teamId, @PathVariable("planId") int planId, @PathVariable("date") LocalDate date,
            @RequestHeader(value = "Authorization", required = false) String header){

        ResponseDto<List<BookmarkFindAllByDateResponse>> responseDto = ResponseDto.<List<BookmarkFindAllByDateResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("해당 날짜에 저장된 장소 목록 조회에 성공했습니다.")
                .data(bookmarkService.findAllBookmarkByDate(teamId, planId, date, header))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "찜목록 조회")
    @GetMapping("/bookmarks/jjim")
    public ResponseEntity<ResponseDto<List<BookmarkFindAllInJjinResponse>>> findAllBookmarkInJjim(
            @PathVariable("teamId") int teamId, @PathVariable("planId") int planId,
            @RequestHeader(value = "Authorization", required = false) String header){

        ResponseDto<List<BookmarkFindAllInJjinResponse>> responseDto = ResponseDto.<List<BookmarkFindAllInJjinResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("해당 일정에 저장된 찜 목록 조회를 성공했습니다.")
                .data(bookmarkService.findAllBookmarkInJjim(teamId, planId, header))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "북마크 삭제")
    @DeleteMapping("/bookmarks/{bookmarkId}")
    public ResponseEntity<ResponseDto<List<BookmarkFindAllInJjinResponse>>> deleteBookmark(@PathVariable("teamId") int teamId, @PathVariable("planId") int planId,@PathVariable("bookmarkId") int bookmarkId,
                                                              @RequestHeader(value = "Authorization", required = false) String header){

        ResponseDto<List<BookmarkFindAllInJjinResponse>> responseDto = ResponseDto.<List<BookmarkFindAllInJjinResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("찜 목록에서 삭제되었습니다.")
                .data(bookmarkService.deleteBookmark(teamId, planId, bookmarkId, header))
                .build();

        sseController.notifyClients(teamId, "bookmark-deleted", bookmarkId);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
