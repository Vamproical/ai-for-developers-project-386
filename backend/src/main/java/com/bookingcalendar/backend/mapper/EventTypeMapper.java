package com.bookingcalendar.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventTypeMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "durationMinutes", source = "durationMinutes")
    com.bookingcalendar.dto.EventType toDto(com.bookingcalendar.backend.entity.EventType entity);

    List<com.bookingcalendar.dto.EventType> toDtoList(List<com.bookingcalendar.backend.entity.EventType> entities);

    default com.bookingcalendar.dto.EventTypeList toEventTypeList(List<com.bookingcalendar.backend.entity.EventType> entities) {
        com.bookingcalendar.dto.EventTypeList list = new com.bookingcalendar.dto.EventTypeList();
        list.setItems(toDtoList(entities));
        return list;
    }
}
