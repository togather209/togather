package com.common.togather.api.service;

import com.common.togather.api.error.EmailAlreadyExistsException;
import com.common.togather.api.error.InvalidEmailPatternException;
import com.common.togather.api.error.MailSendException;
import com.common.togather.db.repository.MemberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
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

    private static final String CHAR_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String DIGIT = "0123456789";
    private static final String SPECIAL_CHARACTERS = "!@#$%^&*()-_";

    private static final String PASSWORD_ALLOW_BASE = CHAR_LOWERCASE + CHAR_UPPERCASE + DIGIT + SPECIAL_CHARACTERS;
    private static final SecureRandom random = new SecureRandom();

    @Autowired
    private MemberRepository memberRepository;

    // 이메일 주소 검증
    public boolean isValidEmail(String email) {
        return pattern.matcher(email).matches();
    }

    // 인증번호 메일 전송
    public void sendVerificationCodeMail(String to, String subject, String content) {

        if(!isValidEmail(to)) {
            throw new InvalidEmailPatternException("올바르지 않은 이메일 형식입니다.");
        }

        if(memberRepository.existsByEmail(to)){
            throw new EmailAlreadyExistsException("이미 사용중인 이메일입니다.");
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
            throw new MailSendException("인증코드 전송에 실패하였습니다.");
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

    // 임시 비밀번호 전송
    public void sendNewPasswordMail(String to, String subject, String content) {
        if(!isValidEmail(to)) {
            throw new InvalidEmailPatternException("올바르지 않은 이메일 형식입니다.");
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
            throw new MailSendException("인증코드 전송에 실패하였습니다.");
        }

    }

    // 임시 비밀번호 생성
    public static String generateTemporaryPassword(int length) {
        if (length < 1) throw new IllegalArgumentException("Length must be greater than 0");

        StringBuilder password = new StringBuilder(length);

        // Ensure at least one character from each character set is included
        password.append(CHAR_LOWERCASE.charAt(random.nextInt(CHAR_LOWERCASE.length())));
        password.append(CHAR_UPPERCASE.charAt(random.nextInt(CHAR_UPPERCASE.length())));
        password.append(DIGIT.charAt(random.nextInt(DIGIT.length())));
        password.append(SPECIAL_CHARACTERS.charAt(random.nextInt(SPECIAL_CHARACTERS.length())));

        for (int i = 4; i < length; i++) {
            password.append(PASSWORD_ALLOW_BASE.charAt(random.nextInt(PASSWORD_ALLOW_BASE.length())));
        }

        return password.toString();
    }
}
