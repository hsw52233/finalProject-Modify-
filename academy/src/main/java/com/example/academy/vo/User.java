package com.example.academy.vo;

import lombok.Data;

@Data
public class User {
	private Integer userId;
    private String username;
    private String password;
    private String role;
}
