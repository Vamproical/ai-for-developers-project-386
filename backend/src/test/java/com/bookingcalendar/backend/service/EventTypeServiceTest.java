package com.bookingcalendar.backend.service;

import com.bookingcalendar.backend.entity.EventType;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import com.bookingcalendar.dto.EventTypeList;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventTypeServiceTest {

    @Mock
    private EventTypeRepository eventTypeRepository;

    @InjectMocks
    private EventTypeService eventTypeService;

    @Test
    void listAll_returnsEventTypeListWithItems() {
        EventType entity = new EventType("Consultation", "A consultation call", 30);
        entity.setId("test-id");
        when(eventTypeRepository.findAll()).thenReturn(List.of(entity));

        EventTypeList result = eventTypeService.listAll();

        assertThat(result.getItems()).hasSize(1);
        assertThat(result.getItems().get(0).getId()).isEqualTo("test-id");
        assertThat(result.getItems().get(0).getName()).isEqualTo("Consultation");
        assertThat(result.getItems().get(0).getDescription()).isEqualTo("A consultation call");
        assertThat(result.getItems().get(0).getDurationMinutes()).isEqualTo(30);
    }

    @Test
    void listAll_returnsEmptyListWhenNoEventTypes() {
        when(eventTypeRepository.findAll()).thenReturn(List.of());

        EventTypeList result = eventTypeService.listAll();

        assertThat(result.getItems()).isEmpty();
    }
}
