package com.example.chat_app.controller;

import com.example.chat_app.dto.CommentDTO;
import com.example.chat_app.service.CommentService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/posts/{postId}/users/{userId}")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long postId,
            @PathVariable Long userId,
            @RequestParam String textContent) {
        return commentService.createComment(postId, userId, textContent);
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPostId(@PathVariable Long postId) {
        return commentService.getCommentsByPostId(postId);
    }
}