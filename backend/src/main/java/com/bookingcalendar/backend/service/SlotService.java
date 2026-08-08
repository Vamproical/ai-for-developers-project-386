package com.bookingcalendar.backend.service;

import com.bookingcalendar.backend.entity.QSlotEntity;
import com.bookingcalendar.backend.entity.SlotEntity;
import com.bookingcalendar.backend.mapper.SlotMapper;
import com.bookingcalendar.backend.repository.SlotRepository;
import com.bookingcalendar.dto.SlotList;
import com.querydsl.core.BooleanBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.StreamSupport;

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
        QSlotEntity slot = QSlotEntity.slotEntity;
        BooleanBuilder predicate = new BooleanBuilder();

        if (eventTypeId != null) {
            predicate.and(slot.eventTypeId.eq(eventTypeId));
        }
        if (from != null && to != null) {
            predicate.and(slot.startDateTime.between(from, to));
        }

        List<SlotEntity> slots = StreamSupport.stream(slotRepository.findAll(predicate).spliterator(), false)
                .toList();
        return slotMapper.toSlotList(slots);
    }
}
