package com.example.academy.vo;

import lombok.Data;

@Data
public class Board {
	
	private Integer boardNo;
	private String boardTitle;
	private String boardContent;
	private Integer createEmployeeNo;
	private Integer updateEmployeeNo;
	private Integer boardCount;
	private String createDate;
	private String updateDate;
	
}
