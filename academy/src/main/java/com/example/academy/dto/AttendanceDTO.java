package com.example.academy.dto;

import lombok.Data;

@Data
public class AttendanceDTO {
	
	private Integer attendanceNo;
	private Integer employeeNo;
	private String attendanceCheckIn;
	private String attendanceCheckOut;
	private String attendanceStatus;
	private Integer attendanceLate;
	private Integer attendanceEarlyLeave;
	private String attendanceContent;
	private String attendanceDate;
	private String createDate;
	private String updateDate;

	private String currentDateTime;
	private String currentDate;
	
}
