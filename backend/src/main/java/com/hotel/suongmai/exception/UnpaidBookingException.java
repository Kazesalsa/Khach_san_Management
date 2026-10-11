package com.hotel.suongmai.exception;

public class UnpaidBookingException extends RuntimeException {
    public UnpaidBookingException(String message) {
        super(message);
    }
}
