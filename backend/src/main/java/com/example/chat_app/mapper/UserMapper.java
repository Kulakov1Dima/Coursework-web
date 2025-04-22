package com.example.chat_app.mapper;

import com.example.chat_app.dto.UserDTO;
import com.example.chat_app.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {UserInChatMapper.class})
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "userInChats", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "comments", ignore = true) // Игнорируем поле comments, если оно есть
    UserDTO toDto(User user);

    User toEntity(UserDTO userDTO);
}