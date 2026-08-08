package com.bookingcalendar.backend.mapper;

import com.bookingcalendar.backend.entity.EventType;
import com.bookingcalendar.dto.EventTypeList;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EventTypeMapper {

    EventTypeMapper INSTANCE = Mappers.getMapper(EventTypeMapper.class);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "durationMinutes", source = "durationMinutes")
    com.bookingcalendar.dto.EventType toDto(EventType entity);

    List<com.bookingcalendar.dto.EventType> toDtoList(List<EventType> entities);

    default EventTypeList toEventTypeList(List<EventType> entities) {
        EventTypeList list = new EventTypeList();
        list.setItems(toDtoList(entities));
        return list;
    }
}
