package com.example.chat_app.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "message_id_seq")
    @SequenceGenerator(name = "message_id_seq", sequenceName = "message_id_seq", allocationSize = 1)
    private Long id;

    @Column(name = "message_text")
    private String messageText;

    @OneToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;
}