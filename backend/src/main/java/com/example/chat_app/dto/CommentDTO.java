package com.example.chat_app.dto;

import lombok.Data;

@Data
public class CommentDTO {
    private Long id;
    private PostDTO post;
    private UserDTO user;
    private String textContent;
}