package com.bookingcalendar.backend.service;

import com.bookingcalendar.backend.entity.BookingEntity;
import com.bookingcalendar.backend.entity.SlotEntity;
import com.bookingcalendar.backend.mapper.BookingMapper;
import com.bookingcalendar.backend.repository.BookingRepository;
import com.bookingcalendar.backend.repository.SlotRepository;
import com.bookingcalendar.dto.BookingStatus;
import com.bookingcalendar.dto.CreateBookingRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.regex.Pattern;

@Service
@Transactional(readOnly = true)
public class BookingService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w.-]+@[\\w.-]+\\.\\w+$");

    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final BookingMapper bookingMapper;

    public BookingService(BookingRepository bookingRepository, SlotRepository slotRepository, BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.slotRepository = slotRepository;
        this.bookingMapper = bookingMapper;
    }

    @Transactional
    public com.bookingcalendar.dto.Booking create(CreateBookingRequest request) {
        validateEmail(request.getGuestEmail());

        SlotEntity slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found: " + request.getSlotId()));

        if (slot.getStatus() != com.bookingcalendar.dto.SlotStatus.AVAILABLE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot is not available");
        }

        slot.setStatus(com.bookingcalendar.dto.SlotStatus.BOOKED);
        slotRepository.save(slot);

        BookingEntity booking = new BookingEntity(
                request.getSlotId(),
                request.getEventTypeId(),
                request.getGuestName(),
                request.getGuestEmail(),
                request.getGuestPhone(),
                request.getComment()
        );
        BookingEntity saved = bookingRepository.save(booking);
        return bookingMapper.toDto(saved);
    }

    private void validateEmail(String email) {
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email format");
        }
    }
}
