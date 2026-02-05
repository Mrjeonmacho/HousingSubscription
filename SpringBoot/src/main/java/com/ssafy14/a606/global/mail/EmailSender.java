package com.ssafy14.a606.global.mail;

public interface EmailSender {
    void send(String to, String subject, String content); // text/plain
    void sendHtml(String to, String subject, String html); // text/html
}
