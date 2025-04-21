package com.example.chat_app.mapper;

import com.example.chat_app.dto.MessageDTO;
import com.example.chat_app.entities.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(target = "item", ignore = true)
    MessageDTO toDto(Message message);

    Message toEntity(MessageDTO messageDTO);
}