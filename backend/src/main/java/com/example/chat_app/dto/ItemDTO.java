package com.example.chat_app.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ItemDTO {
    private Long id;
    private ChatDTO chat;
    private UserDTO user;
    private String type;
    private LocalDate date;
    private MessageDTO message;
    private PostDTO post;
}