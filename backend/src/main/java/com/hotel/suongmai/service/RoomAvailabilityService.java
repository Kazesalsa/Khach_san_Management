package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.AvailableRoomResponse;
import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.UsageStatus;
import com.hotel.suongmai.repository.BookingDetailRepository;
import com.hotel.suongmai.repository.PriceListRepository;
import com.hotel.suongmai.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoomAvailabilityService {

    private final RoomRepository roomRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final PriceListRepository priceListRepository;

    @Transactional(readOnly = true)
    public List<AvailableRoomResponse> findAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("Ngày trả phòng phải sau ngày nhận phòng");
        }

        Set<String> bookedRoomIds = new HashSet<>(
                bookingDetailRepository.findBookedRoomIdsOverlapping(checkIn, checkOut));

        return roomRepository.findByUsageStatusAndCleaningStatus(UsageStatus.TRONG, CleaningStatus.DA_DON_XONG)
                .stream()
                .filter(room -> !bookedRoomIds.contains(room.getId()))
                .map(room -> new AvailableRoomResponse(
                        room.getId(),
                        room.getRoomNumber(),
                        room.getRoomCategory().getName(),
                        room.getRoomCategory().getMaxCapacity(),
                        priceListRepository.findFirstByRoomCategory_IdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatus(
                                room.getRoomCategory().getId(), checkIn.atStartOfDay(),
                                checkOut.atTime(LocalTime.MIN), "ACTIVE")
                                .map(price -> price.getPrice())
                                .orElse(null)))
                .toList();
    }
}
