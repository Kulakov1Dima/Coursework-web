package com.example.chat_app.dto;

import lombok.Data;

@Data
public class MessageDTO {
    private Long id;
    private String messageText;
    private ItemDTO item;
}