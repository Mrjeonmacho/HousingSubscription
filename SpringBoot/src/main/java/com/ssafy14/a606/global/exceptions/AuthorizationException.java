package com.ssafy14.a606.global.exceptions;

public class AuthorizationException extends RuntimeException {
    public AuthorizationException(String message){
        super(message);
    }
}