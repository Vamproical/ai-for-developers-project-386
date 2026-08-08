package com.bookingcalendar.backend.service;

import com.bookingcalendar.backend.entity.EventType;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import com.bookingcalendar.dto.EventTypeList;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class EventTypeService {

    private final EventTypeRepository eventTypeRepository;

    public EventTypeService(EventTypeRepository eventTypeRepository) {
        this.eventTypeRepository = eventTypeRepository;
    }

    public EventTypeList listAll() {
        List<EventType> items = eventTypeRepository.findAll();
        EventTypeList result = new EventTypeList();
        result.setItems(items.stream()
                .map(this::toDto)
                .toList());
        return result;
    }

    private com.bookingcalendar.dto.EventType toDto(EventType entity) {
        com.bookingcalendar.dto.EventType dto = new com.bookingcalendar.dto.EventType();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setDurationMinutes(entity.getDurationMinutes());
        return dto;
    }
}
