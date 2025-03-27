package com.example.academy.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class AttendanceApprovalAddDTO {
	// attendance_approval (근태신청서) 테이블
	private Integer attendanceApprovalNo;	// 근태신청서 번호	pk
    private Integer employeeNo;
    private String attendanceApprovalTitle;
    private String attendanceApprovalContent;
    private String attendanceApprovalBeginDate;
    private String attendanceApprovalEndDate;
    private String attendanceApprovalType;
    
    // approval_employee (결재자) 테이블
    private List<String> approvers;	// 결재자 배열로 받기
    private List<String> alreadyApprovers;	// 변경전 결재자 배열로 받기
    private Integer approvalEmployeeNo;	// PK 결재자 번호
    private Integer approver;	// FK 결재자(employee_no)
    private Integer approvalLevel;	// 결재순위
    
    // attendance_approval_file (근태신청서-파일) 테이블
    
    // file (파일) 테이블
    private List<MultipartFile> attendanceApprovalFiles;
    private List<String> alreadyFiles;	// 기존 파일
    
    private Integer fileNo;	// 파일번호	pk
    private String fileName;	// 서버파일명
    private String fileExt;		// 파일 확장자
    private String fileOrigin;	// 기존 파일명
    private String fileSize;	// 파일크기
    private String fileType;	// 파일종류
    private String fileCategory;	//fk code   
    

}
