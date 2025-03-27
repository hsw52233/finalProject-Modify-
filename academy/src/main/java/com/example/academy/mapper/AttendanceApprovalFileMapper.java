package com.example.academy.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.AttendanceApprovalAddDTO;
import com.example.academy.vo.Files;

@Mapper
public interface AttendanceApprovalFileMapper {
	
	// 김혜린 : 근태신청서 수정 시 근태결재/파일 연결테이블 해당 정보 삭제
	Integer deleteAttendanceApprovalFile(Integer fileNo, Integer attendanceApprovalNo);
	
	
	// 김혜린 : 근태신청서 상세페이지 파일목록 출력
	List<Files> selectAttendanceApprovalFileList(Integer attendanceApprovalNo);
	
	// 김혜린 : 근태신청서 파일추가
	Integer insertAttendanceApprovalFile(AttendanceApprovalAddDTO attendanceApprovalAddDTO);
	

}
