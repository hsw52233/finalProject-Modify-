package com.example.academy.dto;

import lombok.Data;

@Data
public class LectureOneTimeListDTO {
	
	private Integer lectureNo;		// 강의번호
	private String lectureName;		// 강의명
	
	private Integer lectureWeekdayNo;	// 강의시간번호
	
	private String weekdayCode;		// 요일코드
	private String beginTimeCode;	// 시작시간코드
	private String endTimeCode;		// 종료시간코드
		
	private String weekday;		// 요일
	private String beginTime;	// 시작시간
	private String endTime;		// 종료시간
	
	private String createDate;
	private String updateDate;	
}
