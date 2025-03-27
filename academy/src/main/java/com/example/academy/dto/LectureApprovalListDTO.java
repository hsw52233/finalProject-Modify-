package com.example.academy.dto;

import lombok.Data;

@Data
public class LectureApprovalListDTO {

	private Integer lectureApprovalNo;		// PK 신청번호
	private String lectureApprovalTitle;    // 신청제목   
    private Integer lecturer;          		// FK	신청자번호
    private String employeeName;			// 신청자이름
    private String lectureApprovalStatusCode;  	// FK   결재상태코드   
    private String lectureApprovalStatus;  	// 결재상태       
    private String createDate;        
    private String updateDate;
    
    // 결재 대기 목록
    private Integer approver; // 결재자번호, fk : employeeNo
    private Integer lectureApprovalStep;	// 신청서 현재결재단계
    private Integer approvalLevel;	// 결재자 결재순위
    
    // 데이터를 배열로 반환하는 매서드
    public Object[] toArray() {
    	return new Object[] {
    			this.lectureApprovalNo
    			, this.lectureApprovalTitle
    			, this.employeeName
    			, this.lectureApprovalStatus
    	};
    }
}
