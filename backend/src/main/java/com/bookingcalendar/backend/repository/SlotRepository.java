package com.bookingcalendar.backend.repository;

import com.bookingcalendar.backend.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<Slot, String> {

    List<Slot> findByEventTypeIdAndStartDateTimeBetween(String eventTypeId, OffsetDateTime from, OffsetDateTime to);

    List<Slot> findByEventTypeId(String eventTypeId);

    List<Slot> findByStartDateTimeBetween(OffsetDateTime from, OffsetDateTime to);
}
