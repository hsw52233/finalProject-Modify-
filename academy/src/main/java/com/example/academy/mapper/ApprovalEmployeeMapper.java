package com.example.academy.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.AttendanceApprovalAddDTO;
import com.example.academy.dto.AttendanceApprovalOneDTO;

@Mapper
public interface ApprovalEmployeeMapper {
	
	// 김혜린 : 근태신청서 총 결재자 수 구하기
	Integer selectTotalApprover(AttendanceApprovalOneDTO attendanceApprovalOneDTO);
	
	// 김혜린 : 근태신청서 결재 승인시 - 결재자 상태 업데이트
	Integer updateApprovalStatusAgree(AttendanceApprovalOneDTO attendanceApprovalOneDTO);
	
	// 김혜린 : 근태신청서 결재 반려시 - 결재자 상태 업데이트
	Integer updateApprovalStatusReject(AttendanceApprovalOneDTO attendanceApprovalOneDTO);
	
	// 김혜린 : 근태신청서 상세페이지 - 결재자 목록
	List<AttendanceApprovalOneDTO> approverList(Integer attendanceApprovalNo);
	
	// 김혜린 : 근태신청서 결재자 추가 / 근태신청서 수정 - 결재자 추가
	Integer insertAttendanceApprovalEmployee(AttendanceApprovalAddDTO attendanceApprovalAddDTO);
	
	// 김혜린 : 근태신청서 수정 - 결재자 삭제
	Integer deleteAttendanceApprovalEmployee(AttendanceApprovalAddDTO attendanceApprovalAddDTO);
	
}
