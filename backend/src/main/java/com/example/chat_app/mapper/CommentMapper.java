package com.example.chat_app.mapper;

import com.example.chat_app.dto.CommentDTO;
import com.example.chat_app.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CommentMapper {

    @Mapping(target = "post", ignore = true)
    CommentDTO toDto(Comment comment);

    List<CommentDTO> toDtoList(List<Comment> comments);

    Comment toEntity(CommentDTO commentDTO);
}