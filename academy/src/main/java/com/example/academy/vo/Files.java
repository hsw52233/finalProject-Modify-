package com.example.academy.vo;

import lombok.Data;

@Data
public class Files {
	
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
