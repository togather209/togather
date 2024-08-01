package com.common.togather.api.service;

import com.common.togather.api.error.VerificationCodeSendException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    JavaMailSender mailSender;

    public void sendMail(String to, String subject, String content) {
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


}
