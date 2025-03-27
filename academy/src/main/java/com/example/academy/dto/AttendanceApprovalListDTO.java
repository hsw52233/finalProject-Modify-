package com.example.academy.dto;

import lombok.Data;

@Data
public class AttendanceApprovalListDTO {

	private Integer attendanceApprovalNo;	// 신청번호
	private String attendanceApprovalTitle;	// 신청제목
	private String attendanceApprovalTypeCode;	// 신청종류코드
	private String attendanceApprovalType;	// 신청종류	
    private Integer employeeNo;				// 신청자번호
    private String employeeName;	// 신청자이름	
    private String attendanceApprovalStatusCode;	// 결재상태코드
    private String attendanceApprovalStatus;	// 결재상태
    private String createDate;
    private String updateDate;
	
    // 결재 대기 목록
    private Integer approver; // 결재자번호, fk : employeeNo
    private Integer attendanceApprovalStep;	// 신청서 현재결재단계
    private Integer approvalLevel;	// 결재자 결재순위
    
    
    // 데이터를 배열로 반환하는 매서드
    public Object[] toArray() {
    	return new Object[] {
    			this.attendanceApprovalNo
    			, this.attendanceApprovalTitle
    			, this.attendanceApprovalType
    			, this.employeeName
    			, this.attendanceApprovalStatus
    	};
    }
}
