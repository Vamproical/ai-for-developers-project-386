package com.bookingcalendar.backend.mapper;

import com.bookingcalendar.dto.EventTypeList;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EventTypeMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "durationMinutes", source = "durationMinutes")
    com.bookingcalendar.dto.EventType toDto(com.bookingcalendar.backend.entity.EventType entity);

    List<com.bookingcalendar.dto.EventType> toDtoList(List<com.bookingcalendar.backend.entity.EventType> entities);

    default EventTypeList toEventTypeList(List<com.bookingcalendar.backend.entity.EventType> entities) {
        EventTypeList list = new EventTypeList();
        list.setItems(toDtoList(entities));
        return list;
    }
}
