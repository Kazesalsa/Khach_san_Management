package com.hotel.suongmai.exception;

public class RoomAlreadyCleanedException extends RuntimeException {
    public RoomAlreadyCleanedException(String message) {
        super(message);
    }
}
