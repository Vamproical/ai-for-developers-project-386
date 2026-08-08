package com.bookingcalendar.backend.service;

import com.bookingcalendar.backend.entity.Slot;
import com.bookingcalendar.backend.mapper.SlotMapper;
import com.bookingcalendar.backend.repository.SlotRepository;
import com.bookingcalendar.dto.SlotList;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class SlotService {

    private final SlotRepository slotRepository;
    private final SlotMapper slotMapper;

    public SlotService(SlotRepository slotRepository, SlotMapper slotMapper) {
        this.slotRepository = slotRepository;
        this.slotMapper = slotMapper;
    }

    public SlotList list(String eventTypeId, OffsetDateTime from, OffsetDateTime to) {
        List<Slot> slots;
        if (eventTypeId != null && from != null && to != null) {
            slots = slotRepository.findByEventTypeIdAndStartDateTimeBetween(eventTypeId, from, to);
        } else if (eventTypeId != null) {
            slots = slotRepository.findByEventTypeId(eventTypeId);
        } else if (from != null && to != null) {
            slots = slotRepository.findByStartDateTimeBetween(from, to);
        } else {
            slots = slotRepository.findAll();
        }
        return slotMapper.toSlotList(slots);
    }
}
