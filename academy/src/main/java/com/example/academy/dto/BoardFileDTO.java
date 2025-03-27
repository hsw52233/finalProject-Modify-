package com.example.academy.dto;

import lombok.Data;

@Data
public class BoardFileDTO {

	private Integer boardNo;
	private Integer fileNo;
	private String fileName;
	private String fileExt;
	private String fileOrigin;
	private Long fileSize;
	private String fileType;
	private String fileCategory;
	private String createDate;
	private String updateDate;
	
}
