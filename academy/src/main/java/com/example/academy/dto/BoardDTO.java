package com.example.academy.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class BoardDTO {
	
	private Integer boardNo;
	private String boardTitle;
	private String boardContent;
	private Integer createEmployeeNo;
	private Integer updateEmployeeNo;
	private String boardCategory;
	private Integer boardCount;
	private String createDate;
	private String updateDate;
	private String employeeName;
	private String employeeDepartment;
	private String employeeDepartmentName;
	private String code;
	private String name;
	private Integer pinned;
	
	private List<MultipartFile> boardFiles;
	
	private Integer fileNo;
	private String fileName;
	private String fileExt;
	private String fileOrigin;
	private String fileSize;
	private String fileType;
	private String fileCategory;

}
