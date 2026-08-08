package com.bookingcalendar.backend.service;

import com.bookingcalendar.backend.entity.ScheduleEntity;
import com.bookingcalendar.backend.mapper.ScheduleMapper;
import com.bookingcalendar.backend.repository.ScheduleRepository;
import com.bookingcalendar.dto.CreateScheduleRequest;
import com.bookingcalendar.dto.ScheduleList;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ScheduleMapper scheduleMapper;

    public ScheduleService(ScheduleRepository scheduleRepository, ScheduleMapper scheduleMapper) {
        this.scheduleRepository = scheduleRepository;
        this.scheduleMapper = scheduleMapper;
    }

    public ScheduleList list() {
        return scheduleMapper.toScheduleList(scheduleRepository.findAll());
    }

    @Transactional
    public com.bookingcalendar.dto.Schedule create(CreateScheduleRequest request) {
        validate(request);
        ScheduleEntity entity = scheduleMapper.toEntity(request);
        ScheduleEntity saved = scheduleRepository.save(entity);
        return scheduleMapper.toDto(saved);
    }

    private void validate(CreateScheduleRequest request) {
        if (request.getDaysOfWeek() == null || request.getDaysOfWeek().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "daysOfWeek must not be empty");
        }
        for (Integer day : request.getDaysOfWeek()) {
            if (day < 0 || day > 6) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "daysOfWeek must be between 0 and 6");
            }
        }
        if (!request.getStartDate().isBefore(request.getEndDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "startDate must be before endDate");
        }
        if (request.getSlotDurationMinutes() != null && request.getSlotDurationMinutes() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "slotDurationMinutes must be greater than 0");
        }
    }
}
