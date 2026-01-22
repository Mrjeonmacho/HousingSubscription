package com.ssafy14.a606.global;

import com.ssafy14.a606.global.dto.ErrorResponse;
import com.ssafy14.a606.global.exceptions.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class ExceptionalControllerAdvice {

    private ResponseEntity<ErrorResponse> handleException(
            Exception exception,
            HttpStatus status,
            String errorCode
    ) {
        log.error("[{}] {}", errorCode, exception.getMessage());

        return ResponseEntity
                .status(status)
                .body(new ErrorResponse(errorCode, exception.getMessage()));
    }

    // 400 - 잘못된 요청
    @ExceptionHandler(InvalidValueException.class)
    public ResponseEntity<ErrorResponse> handleInvalidValueException(InvalidValueException e) {
        return handleException(e, HttpStatus.BAD_REQUEST, "BR");
    }

    // 401 - 인증 실패
    @ExceptionHandler(AuthorizationException.class)
    public ResponseEntity<ErrorResponse> handleAuthorizationException(AuthorizationException e) {
        return handleException(e, HttpStatus.UNAUTHORIZED, "UN");
    }

    // 404 - 리소스 없음
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException e) {
        return handleException(e, HttpStatus.NOT_FOUND, "NF");
    }

    // 403 - 권한 없음
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException e) {
        return handleException(e, HttpStatus.FORBIDDEN, "FB");
    }

    // 500 - DB 오류
    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseException(DatabaseException e) {
        return handleException(e, HttpStatus.INTERNAL_SERVER_ERROR, "DBE");
    }

    // 500 - 기타 모든 예외
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception e) {
        return handleException(e, HttpStatus.INTERNAL_SERVER_ERROR, "GENERIC_ERROR");
    }
}
