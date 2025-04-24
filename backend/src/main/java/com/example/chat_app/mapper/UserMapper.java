package com.example.chat_app.mapper;

import com.example.chat_app.dto.UserDTO;
import com.example.chat_app.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UserInChatMapper.class})
public interface UserMapper {

    @Mapping(target = "userInChats", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "comments", ignore = true)
    UserDTO toDto(User user);

    @Mapping(target = "userInChats", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "comments", ignore = true)
    User toEntity(UserDTO userDTO);

    @Mapping(target = "userInChats", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "comments", ignore = true)
    void updateEntity(@MappingTarget User user, UserDTO userDTO);
}