package com.example.academy.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class chattingMessageDTO {
	
	private Long id;
    private Integer fromUserName;
    private Integer toUserName;
    private String content;
    private LocalDateTime create_date;

}
