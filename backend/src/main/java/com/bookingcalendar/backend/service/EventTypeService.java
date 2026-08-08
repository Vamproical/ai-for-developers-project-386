package com.bookingcalendar.backend.service;

import com.bookingcalendar.backend.mapper.EventTypeMapper;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import com.bookingcalendar.dto.EventTypeList;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class EventTypeService {

    private final EventTypeRepository eventTypeRepository;
    private final EventTypeMapper eventTypeMapper;

    public EventTypeService(EventTypeRepository eventTypeRepository, EventTypeMapper eventTypeMapper) {
        this.eventTypeRepository = eventTypeRepository;
        this.eventTypeMapper = eventTypeMapper;
    }

    public EventTypeList listAll() {
        return eventTypeMapper.toEventTypeList(eventTypeRepository.findAll());
    }
}
