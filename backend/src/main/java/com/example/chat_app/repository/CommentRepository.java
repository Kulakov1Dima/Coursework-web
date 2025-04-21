package com.example.chat_app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.chat_app.entities.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
}