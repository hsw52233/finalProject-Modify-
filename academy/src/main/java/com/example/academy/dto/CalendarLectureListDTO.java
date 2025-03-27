package com.example.academy.dto;

import lombok.Data;

@Data
public class CalendarLectureListDTO {
	private String lectureName;
	private String lectureBeginDate;
	private String lectureEndDate;
	private String lectureContent;
	private String weekdayCode;
	private String beginTimeCode;
	private String endTimeCode;
}
