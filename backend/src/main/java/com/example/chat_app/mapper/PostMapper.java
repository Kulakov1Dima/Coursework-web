package com.example.chat_app.mapper;

import com.example.chat_app.dto.PostDTO;
import com.example.chat_app.entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CommentMapper.class})
public interface PostMapper {

    @Mapping(target = "item", ignore = true)
    PostDTO toDto(Post post);

    Post toEntity(PostDTO postDTO);
}