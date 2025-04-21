package com.example.chat_app.mapper;

import com.example.chat_app.dto.UserInChatDTO;
import com.example.chat_app.entities.UserInChat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserInChatMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "chat", ignore = true)
    UserInChatDTO toDto(UserInChat userInChat);

    UserInChat toEntity(UserInChatDTO userInChatDTO);
}