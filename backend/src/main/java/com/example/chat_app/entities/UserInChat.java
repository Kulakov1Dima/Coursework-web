package com.example.chat_app.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "User_in_chat")
public class UserInChat {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_in_chat_id_seq")
    @SequenceGenerator(name = "user_in_chat_id_seq", sequenceName = "user_in_chat_id_seq", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}