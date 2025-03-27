package com.example.academy.dto;

import lombok.Data;

@Data
public class LectureModifyDTO {
	private Integer lectureNo;	// 강의번호
	
	private String lectureName;		// 강의명
	private String lectureContent;	// 강의상세설명
	private String lecturer; // 강사
	
	private String lectureBeginDate;	// 개강일
	private String lectureEndDate;		// 종강일
	
	//private List<LectureOneTimeListDTO> lectureTime;

}
