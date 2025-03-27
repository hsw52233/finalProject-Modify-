package com.example.academy.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class BoardModifyDTO {

	private Integer boardNo;
	private String boardTitle;
	private String boardContent;
	private Integer createEmployeeNo;
	private Integer updateEmployeeNo;
	private Integer boardCount;
	private String createDate;
	private String updateDate;
	private String employeeName;
	private String employeeDepartment;
	private Integer pinned;
	private String boardCategory;
	
	private List<MultipartFile> boardFiles;
	private List<String> alreadyFiles;	// 기존 파일
	
	private Integer fileNo;
	private String fileName;
	private String fileExt;
	private String fileOrigin;
	private String fileSize;
	private String fileType;
	private String fileCategory;
	
}
