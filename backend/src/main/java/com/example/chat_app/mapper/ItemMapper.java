package com.example.chat_app.mapper;

import com.example.chat_app.dto.ItemDTO;
import com.example.chat_app.entities.Item;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {ChatMapper.class, UserMapper.class})
public interface ItemMapper {

    ItemMapper INSTANCE = Mappers.getMapper(ItemMapper.class);

    @Mapping(target = "message", ignore = true)
    @Mapping(target = "post", ignore = true)
    @Mapping(target = "chat", ignore = true)
    ItemDTO toDto(Item item);

    Item toEntity(ItemDTO itemDTO);
}