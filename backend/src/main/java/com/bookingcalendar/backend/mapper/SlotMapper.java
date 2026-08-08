package com.bookingcalendar.backend.mapper;

import com.bookingcalendar.backend.entity.Slot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SlotMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "eventTypeId", source = "eventTypeId")
    @Mapping(target = "startDateTime", source = "startDateTime")
    @Mapping(target = "endDateTime", source = "endDateTime")
    @Mapping(target = "status", source = "status")
    com.bookingcalendar.dto.Slot toDto(Slot entity);

    List<com.bookingcalendar.dto.Slot> toDtoList(List<Slot> entities);

    default com.bookingcalendar.dto.SlotList toSlotList(List<Slot> entities) {
        com.bookingcalendar.dto.SlotList list = new com.bookingcalendar.dto.SlotList();
        list.setItems(toDtoList(entities));
        return list;
    }
}
