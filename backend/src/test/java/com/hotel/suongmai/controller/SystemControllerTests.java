package com.hotel.suongmai.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.hotel.suongmai.entity.SystemStatus;
import com.hotel.suongmai.repository.SystemStatusRepository;

class SystemControllerTests {

	@Test
	void returnsMessageReadFromDatabase() {
		SystemStatusRepository repository = mock(SystemStatusRepository.class);
		SystemStatus status = mock(SystemStatus.class);
		when(status.getMessage()).thenReturn("Database đã thông!");
		when(repository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(status));

		SystemController controller = new SystemController(repository);
		ResponseEntity<SystemController.SystemStatusResponse> response = controller.testDatabaseConnection();

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().message()).isEqualTo("Database đã thông!");
	}

	@Test
	void returnsNotFoundWhenDatabaseHasNoStatus() {
		SystemStatusRepository repository = mock(SystemStatusRepository.class);
		when(repository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());

		SystemController controller = new SystemController(repository);
		ResponseEntity<SystemController.SystemStatusResponse> response = controller.testDatabaseConnection();

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
		assertThat(response.getBody()).isNull();
	}
}
