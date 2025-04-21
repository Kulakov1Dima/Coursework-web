package com.example.chat_app.controller;

import com.example.chat_app.dto.ItemDTO;
import com.example.chat_app.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @PostMapping("/message")
    public ResponseEntity<ItemDTO> sendMessage(
            @RequestParam Long chatId,
            @RequestParam Long userId,
            @RequestParam String messageText) {
        return itemService.sendMessage(chatId, userId, messageText);
    }

    @PostMapping("/post")
    public ResponseEntity<ItemDTO> createPost(
            @RequestParam Long chatId,
            @RequestParam Long userId,
            @RequestParam String messageText) {
        return itemService.createPost(chatId, userId, messageText);
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<ItemDTO>> getItemsByChatId(@PathVariable Long chatId) {
        return itemService.getItemsByChatId(chatId);
    }
}