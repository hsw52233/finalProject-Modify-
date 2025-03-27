package com.example.academy.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.AttendanceApprovalOneDTO;
import com.example.academy.mapper.ApprovalEmployeeMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class ApprovalEmployeeService {
	@Autowired ApprovalEmployeeMapper approvalEmployeeMapper;
	
	// 김혜린 : 근태신청서 상세페이지 - 결재자 목록 받아오기
	public List<AttendanceApprovalOneDTO> getAttendanceApproverList(Integer attendanceApprovalNo) {
		List<AttendanceApprovalOneDTO> approverList = approvalEmployeeMapper.approverList(attendanceApprovalNo);
		
		return approverList;
	}
	
}
