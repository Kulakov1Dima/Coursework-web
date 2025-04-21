package com.example.chat_app.controller;

import com.example.chat_app.dto.ItemDTO;
import com.example.chat_app.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketChatController {

    @Autowired
    private ItemService itemService;

    @MessageMapping("/chat/{chatId}")
    @SendTo("/topic/chat/{chatId}")
    public ResponseEntity<ItemDTO> sendMessage(@DestinationVariable Long chatId, ItemDTO itemDTO) {
        return itemService.sendMessage(chatId, 1L, itemDTO.getMessage().getMessageText());
    }
}