package com.example.chat_app.dto;

import lombok.Data;

@Data
public class UserInChatDTO {
    private Long id;
    private ChatDTO chat;
    private UserDTO user;
}