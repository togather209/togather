package com.common.togather.api.service;

import com.common.togather.api.error.InvalidEmailPatternException;
import com.common.togather.api.error.VerificationCodeSendException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.regex.Pattern;

@Service
public class MailService {

    @Autowired
    JavaMailSender mailSender;
    @Autowired
    private RedisService redisService;

    private static final String EMAIL_PATTERN =
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";
    private static final Pattern pattern = Pattern.compile(EMAIL_PATTERN);

    // 이메일 주소 검증
    public boolean isValidEmail(String email) {
        return pattern.matcher(email).matches();
    }

    // 메일 전송
    public void sendMail(String to, String subject, String content) {
        if(!isValidEmail(to)) {
            throw new InvalidEmailPatternException("유효하지 않은 이메일 주소입니다.");
        }

        try{
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);

            helper.setFrom("togather209@naver.com");

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            throw new VerificationCodeSendException("인증코드 전송에 실패하였습니다.");
        }

    }
    
    // 랜덤한 인증코드 생성
    public String generateVerificationCode(){
        Random random = new Random();
        int code = random.nextInt(999999) + 100000;
        return String.valueOf(code);
    }

    // 유저가 입력한 인증코드와 실제 발급된 인증코드 비교
    public boolean matchCode(String email, String inputCode) {
        // redis에 저장된 발급코드 불러옴
        String verificationCode = redisService.getEmailVerificationCode(email); 
        
        // 입력한 코드와 일치하지 않으면 false 반환
        if(!verificationCode.equals(inputCode)){
            return false;
        }

        // 일치하면 true 반환
        return true;
    }
}
