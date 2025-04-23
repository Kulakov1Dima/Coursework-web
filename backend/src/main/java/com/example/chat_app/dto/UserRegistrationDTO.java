package com.example.chat_app.dto;

import lombok.Data;

@Data
public class UserRegistrationDTO {
    private String login;
    private String password;
    private String photo;
    private String nickname;
    private String surname;
    private String name;
}