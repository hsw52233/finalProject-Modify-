package com.example.academy.vo;

import lombok.Data;

@Data
public class ApprovalEmployee {

	private Integer approvalEmployeeNo;
    private Integer attendanceApprovalNo;
    private Integer lectureApprovalNo;
    private Integer approver;
    private Integer approvalLevel;
    private String approvalEmployeeStatus;    
    private String createDate;
    private String updateDate;
    
}