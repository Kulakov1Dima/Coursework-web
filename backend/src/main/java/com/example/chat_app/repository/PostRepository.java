package com.example.chat_app.repository;

import com.example.chat_app.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findByItemId(Long itemId);
}