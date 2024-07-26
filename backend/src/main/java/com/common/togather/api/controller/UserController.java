package com.common.togather.api.controller;

import com.common.togather.common.model.response.BaseResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @GetMapping("/{userId}")
    public ResponseEntity<? extends BaseResponseBody> checkUserNotExists(@PathVariable("userId") String userId) {
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }
}
