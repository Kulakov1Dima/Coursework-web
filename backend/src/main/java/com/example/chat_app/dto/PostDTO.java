package com.example.chat_app.dto;

import lombok.Data;

import java.util.List;

@Data
public class PostDTO {
    private Long id;
    private String messageText;
    private ItemDTO item;
    private List<CommentDTO> comments;
}