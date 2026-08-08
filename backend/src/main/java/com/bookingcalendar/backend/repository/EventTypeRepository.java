package com.bookingcalendar.backend.repository;

import com.bookingcalendar.backend.entity.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventTypeRepository extends JpaRepository<EventType, String> {
}
