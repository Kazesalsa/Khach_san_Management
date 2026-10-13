package com.hotel.suongmai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicRoomResponse {
    private String id;
    private String roomCode;
    private String roomNumber;
    private Integer floor;
    private String name;
    private String categoryId;
    private String categoryName;
    private String categoryDescription;
    private Integer maxCapacity;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer discountPercent;
    private List<String> amenities;
    private List<PublicRoomImageResponse> images;
    private String primaryImageUrl;
    private String usageStatus;
    private String cleaningStatus;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PublicRoomImageResponse {
        private String id;
        private String url;
        private String displayOrder;
        private String isPrimary;
        private String caption;
    }
}
