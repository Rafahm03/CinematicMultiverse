package com.example.CinematicMultiverse.util;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;



@Slf4j
@Service
@RequiredArgsConstructor
public class ResendMailSender {

    private final Resend resend;

    @Async
    public void sendMail(String to, String subject, String message) throws IOException, ResendException {
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("onboarding@resend.dev")
                .to(to)
                .subject(subject)
                .html(message)
                .build();

        CreateEmailResponse data = resend.emails().send(params);
        log.info("Email enviado a {} con ID: {}", to, data.getId());
    }
}
