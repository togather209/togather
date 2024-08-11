package com.common.togather.api.controller;

import com.common.togather.api.response.CreateConnectionResponse;
import com.common.togather.api.response.ResponseDto;
import io.openvidu.java.client.*;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class OpenViduController {

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * @param sessionId The Session in which to create the Connection
     * @param params    The Connection properties
     * @return The Token associated to the Connection
     */
    @Operation(summary = "세션 참가")
    @PostMapping("/api/sessions/{sessionId}/connections")
    public ResponseEntity<ResponseDto<CreateConnectionResponse>> createConnection(@PathVariable("sessionId") String sessionId,
                                                                                  @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        openvidu.fetch();
        Session session = openvidu.getActiveSession(sessionId);
        // 해당 세션이 존재하지 않으면 해당 세션 아이디로 세션 생성
        if (session == null) {
            session = openvidu.createSession(new SessionProperties.Builder().customSessionId(sessionId).build());
        }

        // 해당 세션에 연걸
        openvidu.fetch();
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);
        CreateConnectionResponse response = CreateConnectionResponse.builder()
                .token(connection.getToken())
                .build();

        ResponseDto<CreateConnectionResponse> responseDto = ResponseDto.<CreateConnectionResponse>builder()
                .status(HttpStatus.OK.value())
                .message("오픈비두 연결 커넥션 토큰이 발급되었습니다.")
                .data(response)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
