package com.example.academy.dto;

import lombok.Data;

@Data
public class LectureApprovalGetBeginTimeDTO {
	private Integer lectureApprovalNo;
	private String weekdayCode;
	private String classroomNo;
	private String beginDate;
	private String endDate;
}
