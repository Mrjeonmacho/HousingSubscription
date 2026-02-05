package com.ssafy14.a606.global.exceptions;

public class ExpiredVerificationCodeException extends RuntimeException{
    public ExpiredVerificationCodeException(String message) {
        super(message);
    }
}
