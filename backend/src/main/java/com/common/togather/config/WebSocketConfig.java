package com.common.togather.config;

import com.common.togather.common.util.JwtUtil;
import com.common.togather.common.websocket.BookmarkWebSocketHandler;
import com.common.togather.common.websocket.JwtHandshakeInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final JwtUtil jwtUtil;

    @Bean
    public JwtHandshakeInterceptor jwtHandshakeInterceptor() {
        return new JwtHandshakeInterceptor(jwtUtil);
    }

    @Bean
    public BookmarkWebSocketHandler bookmarkWebSocketHandler() {
        return new BookmarkWebSocketHandler();
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new BookmarkWebSocketHandler(), "/ws/bookmarks")
                .addInterceptors(jwtHandshakeInterceptor())
                .setAllowedOrigins("*"); // 모든 도메인 접근 허용
    }

}
