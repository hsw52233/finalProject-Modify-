package com.example.academy.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.mapper.AttendanceApprovalFileMapper;
import com.example.academy.vo.Files;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class AttendanceApprovalFileService {
	@Autowired AttendanceApprovalFileMapper attendanceApprovalFileMapper;
	
	// 김혜린 : 근태신청서 상세페이지 파일목록 출력
	public List<Files> getAttendanceApprovalFileList(Integer attendanceApprovalNo){
		return attendanceApprovalFileMapper.selectAttendanceApprovalFileList(attendanceApprovalNo);
	}
}
