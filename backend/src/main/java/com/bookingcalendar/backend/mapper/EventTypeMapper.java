package com.bookingcalendar.backend.mapper;

import com.bookingcalendar.backend.entity.EventType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EventTypeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "durationMinutes", source = "durationMinutes")
    EventType toEntity(com.bookingcalendar.dto.CreateEventTypeRequest request);

    @Mapping(target = "id", ignore = true)
    void updateEntity(com.bookingcalendar.dto.UpdateEventTypeRequest request,
                      @MappingTarget EventType entity);

    com.bookingcalendar.dto.EventType toDto(EventType entity);

    List<com.bookingcalendar.dto.EventType> toDtoList(List<EventType> entities);

    default com.bookingcalendar.dto.EventTypeList toEventTypeList(List<EventType> entities) {
        com.bookingcalendar.dto.EventTypeList list = new com.bookingcalendar.dto.EventTypeList();
        list.setItems(toDtoList(entities));
        return list;
    }
}
