package com.example.chat_app.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.chat_app.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLogin(String login);
    boolean existsByLogin(String login);
}