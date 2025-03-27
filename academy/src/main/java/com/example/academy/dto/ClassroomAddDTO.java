package com.example.academy.dto;

import lombok.Data;

@Data
public class ClassroomAddDTO {
	private Integer classroomNo;
	private String classroomName; 
    private String classroomManager; 
    private String employeeName; 
    private Integer classroomCapacity; 
	private String createDate;
	private String updateDate;
}
