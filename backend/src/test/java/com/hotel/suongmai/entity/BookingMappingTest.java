package com.hotel.suongmai.entity;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class BookingMappingTest {

    @Test
    void statusUsesPostgreSqlNamedEnumType() throws NoSuchFieldException {
        JdbcTypeCode jdbcTypeCode = Booking.class
                .getDeclaredField("status")
                .getAnnotation(JdbcTypeCode.class);

        assertThat(jdbcTypeCode).isNotNull();
        assertThat(jdbcTypeCode.value()).isEqualTo(SqlTypes.NAMED_ENUM);
    }
}
