package com.hotel.suongmai.service;

import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.exception.RoomAlreadyCleanedException;
import com.hotel.suongmai.exception.RoomNotFoundException;
import com.hotel.suongmai.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomService roomService;
    private Room mockRoom;

    @BeforeEach
    void setUp() {
        mockRoom = new Room();
        mockRoom.setId("uuid-room-101");
        mockRoom.setRoomCode("P101");
        mockRoom.setRoomNumber("101");
        mockRoom.setCleaningStatus(CleaningStatus.CHUA_DON);
    }

    @Test
    @DisplayName("Thành công: Cập nhật trạng thái phòng sang DA_DON_XONG")
    void markRoomAsCleaned_Success() {
        when(roomRepository.findByRoomCode("P101")).thenReturn(Optional.of(mockRoom));
        when(roomRepository.save(any(Room.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Room updated = roomService.markRoomAsCleaned("P101");

        assertThat(updated.getCleaningStatus()).isEqualTo(CleaningStatus.DA_DON_XONG);
        verify(roomRepository, times(1)).save(mockRoom);
    }

    @Test
    @DisplayName("Xử lý EF-1: Ném RoomNotFoundException khi mã phòng không tồn tại")
    void markRoomAsCleaned_ThrowsException_WhenRoomNotFound() {
        when(roomRepository.findByRoomCode("P999")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roomService.markRoomAsCleaned("P999"))
                .isInstanceOf(RoomNotFoundException.class)
                .hasMessageContaining("Phòng không tồn tại");

        verify(roomRepository, never()).save(mockRoom);
    }

    @Test
    @DisplayName("Xử lý EF-3: Ném RoomAlreadyCleanedException khi phòng đã ở trạng thái DA_DON_XONG")
    void markRoomAsCleaned_ThrowsException_WhenAlreadyCleaned() {
        mockRoom.setCleaningStatus(CleaningStatus.DA_DON_XONG);
        when(roomRepository.findByRoomCode("P101")).thenReturn(Optional.of(mockRoom));

        assertThatThrownBy(() -> roomService.markRoomAsCleaned("P101"))
                .isInstanceOf(RoomAlreadyCleanedException.class)
                .hasMessageContaining("Phòng đã được dọn");

        verify(roomRepository, never()).save(mockRoom);
    }
}