package com.java.projectweb.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendResetEmail(String to, String resetUrl) {

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new HashMap<>();

        body.put("from", "onboarding@resend.dev");
        body.put("to", List.of(to));
        body.put("subject", "Reset Password");

        body.put("html",
                "<h3>Reset Password</h3>" +
                        "<p>Click link để reset:</p>" +
                        "<a href=\"" + resetUrl + "\">" +
                        resetUrl +
                        "</a>");

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        restTemplate.postForEntity(
                "https://api.resend.com/emails",
                request,
                String.class
        );
    }

}
