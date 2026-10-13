package com.hotel.suongmai.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.payos.PayOS;

@Configuration
@Getter
public class PayOSConfig {

    @Value("${payos.client-id:51427319-9751-42d2-b369-28838940e205}")
    private String clientId;

    @Value("${payos.api-key:d975a665-079b-47a1-a269-d779e1a546d3}")
    private String apiKey;

    @Value("${payos.checksum-key:eaa65f16a5dd2dd9b4e569223f28e07341055aa0a5796a3554b1ef2c0037a3bd}")
    private String checksumKey;

    @Value("${payos.return-url:http://localhost:5173/payment/result}")
    private String returnUrl;

    @Value("${payos.cancel-url:http://localhost:5173/payment/result?cancel=true}")
    private String cancelUrl;

    @Bean
    public PayOS payOS() {
        return new PayOS(clientId, apiKey, checksumKey);
    }
}
