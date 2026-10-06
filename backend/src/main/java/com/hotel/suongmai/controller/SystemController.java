package com.hotel.suongmai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.suongmai.repository.SystemStatusRepository;

@RestController
@CrossOrigin(origins = "*")
public class SystemController {

	private final SystemStatusRepository systemStatusRepository;

	public SystemController(SystemStatusRepository systemStatusRepository) {
		this.systemStatusRepository = systemStatusRepository;
	}

	@GetMapping("/api/test")
	public ResponseEntity<SystemStatusResponse> testDatabaseConnection() {
		return systemStatusRepository.findFirstByOrderByIdAsc()
				.map(status -> ResponseEntity.ok(new SystemStatusResponse(status.getMessage())))
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	public record SystemStatusResponse(String message) {
	}
}
