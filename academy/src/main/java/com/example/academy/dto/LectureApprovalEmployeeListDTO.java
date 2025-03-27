package com.example.academy.dto;

import lombok.Data;

@Data
public class LectureApprovalEmployeeListDTO {
	private String approvalEmployee;
	private Integer lectureApprovalNo;
	private String approver;
	private Integer approverNo;
	private Integer approvalLevel;
	private String stampFileName;
	private String stampFileExt;
	private String approvalEmployeeStatus;
	private String approvalEmployeeStatusName;
	private String departmentName;
}
