package com.example.academy.vo;

import lombok.Data;

@Data
public class Lecture {

	private Integer lectureNo;
	private String lectureName;
	private String lectureContent;
	private Integer lecturer;			// FK
	private String lectureBeginDate;
	private String lectureEndDate;
	private Integer classroomNo;		// FK
	private String createDate;
	private String updateDate;
	
}