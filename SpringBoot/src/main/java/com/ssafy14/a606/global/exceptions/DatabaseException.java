package com.ssafy14.a606.global.exceptions;

public class DatabaseException  extends RuntimeException {
    public DatabaseException(String message){
        super(message);
    }
}