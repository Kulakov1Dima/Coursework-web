package com.example.chat_app.mapper;

import com.example.chat_app.dto.ChatDTO;
import com.example.chat_app.entities.Chat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ChatMapper {

    ChatMapper INSTANCE = Mappers.getMapper(ChatMapper.class);

    @Mapping(target = "userInChats", ignore = true)
    @Mapping(target = "items", ignore = true)
    ChatDTO toDto(Chat chat);

    Chat toEntity(ChatDTO chatDTO);
}