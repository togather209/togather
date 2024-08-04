package com.common.togather.api.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "에러 메시지 전송 객체")
public class ErrorResponseDto {

    // 에러 종류
    @Schema(description = "에러 종류", example = "error")
    private String error;

    // 에러 메세지
    @Schema(description = "에러 메세지", example = "error message")
    private Object message;

}
