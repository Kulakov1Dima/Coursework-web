package com.example.chat_app.dto;

import lombok.Data;

import java.util.List;

@Data
public class ChatDTO {
    private Long id;
    private String name;
    private String type;
    private List<UserInChatDTO> userInChats;
    private List<ItemDTO> items;
}