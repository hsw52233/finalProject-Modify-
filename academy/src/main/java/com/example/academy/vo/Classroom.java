package com.example.academy.vo;

import lombok.Data;

@Data
public class Classroom {
	
	private Integer classroomNo;
	private String classroomName;
	private Integer classroomManager;
	private Integer classroomCapacity;
	private String createDate;
	private String updateDate;

}