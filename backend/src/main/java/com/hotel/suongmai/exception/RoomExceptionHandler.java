package com.hotel.suongmai.exception;

import com.hotel.suongmai.controller.RoomController;
import com.hotel.suongmai.dto.RoomErrorResponse;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = RoomController.class)
public class RoomExceptionHandler {

    private static final String UPDATE_FAILED_MESSAGE =
            "Không thể cập nhật trạng thái phòng. Vui lòng thử lại sau.";

    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<RoomErrorResponse> handleRoomNotFound(RoomNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new RoomErrorResponse("Phòng không tồn tại"));
    }

    @ExceptionHandler(RoomAlreadyCleanedException.class)
    public ResponseEntity<RoomErrorResponse> handleRoomAlreadyCleaned(
            RoomAlreadyCleanedException exception) {
        return ResponseEntity.badRequest()
                .body(new RoomErrorResponse("Phòng này đã được đánh dấu dọn xong"));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<RoomErrorResponse> handleDatabaseError(DataAccessException exception) {
        return internalServerError();
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<RoomErrorResponse> handleUnexpectedError(RuntimeException exception) {
        return internalServerError();
    }

    private ResponseEntity<RoomErrorResponse> internalServerError() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RoomErrorResponse(UPDATE_FAILED_MESSAGE));
    }
}
