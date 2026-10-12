package com.hotel.suongmai.exception;

public class RoomNotReadyException extends RuntimeException {
    public RoomNotReadyException(String message) {
        super(message);
    }
}
