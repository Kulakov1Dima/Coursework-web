package com.example.chat_app.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private Long id;
    private String login;
    private String password;
    private String photo;
    private String nickname;
    private String surname;
    private String name;
    private List<UserInChatDTO> userInChats;
    private List<ItemDTO> items;
    private List<CommentDTO> comments;
}