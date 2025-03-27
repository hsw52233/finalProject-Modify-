package com.example.academy.dto;

import lombok.Data;

@Data
public class CommentAddDTO {
	private String commentContent;
	private Integer employeeNo;
	private Integer boardNo;
	private Integer commentNo;
}
