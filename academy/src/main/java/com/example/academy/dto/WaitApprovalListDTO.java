package com.example.academy.dto;

import lombok.Data;

@Data
public class WaitApprovalListDTO {
	private Integer approvalEmployeeNo;
    private Integer attendanceApprovalNo;
    private Integer lectureApprovalNo;
    private Integer approver;
    private Integer approvalLevel;
    private String approvalEmployeeStatus;    
    private String createDate;
    private String updateDate;
    
    // 강의 신청자
    private Integer lecturer;
    private String lectureApprovalTitle;
    
    // 근태 신청자
    private Integer employeeNo;
    private String employeeName;
    private String attendanceApprovalTitle;
    
    // 제목
    private String title;
    // 작성자
    private String writer;
}
