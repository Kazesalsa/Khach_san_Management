package com.hotel.suongmai.entity;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Data
public class ChiTietGiaPhongId implements Serializable {
    private String bookingDetail;
    private LocalDate stayDate;
}
