package com.example.academy.vo;

import lombok.Data;

@Data
public class AttendanceApproval {

	private Integer attendanceApprovalNo;
    private Integer employeeNo;
    private String attendanceApprovalTitle;
    private String attendanceApprovalContent;
    private String attendanceApprovalBeginDate;
    private String attendanceApprovalEndDate;
    private String attendanceApprovalType;
    private Integer attendanceApprovalStep;
    private String attendanceApprovalStatus;
    private String rejectReason;
    private String updateDate;
    private String createDate;
	
}