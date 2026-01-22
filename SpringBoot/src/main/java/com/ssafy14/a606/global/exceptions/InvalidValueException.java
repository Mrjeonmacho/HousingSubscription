package com.ssafy14.a606.global.exceptions;

public class InvalidValueException extends RuntimeException {
    public InvalidValueException(String message){
        super(message);
    }
}