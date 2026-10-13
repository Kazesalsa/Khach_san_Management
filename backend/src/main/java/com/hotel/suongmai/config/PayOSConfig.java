package com.hotel.suongmai.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.payos.PayOS;

@Configuration
@Getter
public class PayOSConfig {

    @Value("${payos.client-id:3e809569-9fb6-4b40-8863-ee97df31ad4f}")
    private String clientId;

    @Value("${payos.api-key:34540991-1430-4d0f-a2be-0d800ec50f8e}")
    private String apiKey;

    @Value("${payos.checksum-key:0bc7d96e73db7bc5ff472026fa247b3ca9f3d11d6a6d4444127d46b77ba45013}")
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
