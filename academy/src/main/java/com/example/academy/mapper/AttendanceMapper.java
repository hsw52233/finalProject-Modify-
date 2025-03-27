package com.example.academy.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.AttendanceContentDTO;
import com.example.academy.dto.AttendanceDTO;
import com.example.academy.dto.AttendanceListDTO;

@Mapper
public interface AttendanceMapper {
	
	// 오늘 퇴근 활성화 확인
	Integer selectCheckout(AttendanceDTO attendanceDTO);
	
	// 오늘 출근 활성화 확인
	Integer selectCheckin(AttendanceDTO attendanceDTO);
	
	// 오늘 근태 조퇴 활성화
	Integer updateEarlyLeave(AttendanceDTO attendanceDTO);
	
	// 오늘 근태 지각 활성화
	Integer updateLate(AttendanceDTO attendanceDTO);
	
	// 오늘 출퇴근 시간 조회
	AttendanceDTO selectCheckTime(AttendanceDTO attendanceDTO);
	
	// 근태 유형 변경
	Integer updateContent(AttendanceDTO attendanceDTO);
	
	// 하루 사원의 근무 시간 조회
	Integer selectWorkTime(AttendanceDTO attendanceDTO);
	
	// 퇴근 버튼 클릭 시 수정
	Integer updateCheckout(AttendanceDTO attendanceDTO);
	
	// 지각일 때 출글 버튼 클릭 시 수정 
	Integer updateCheckinByTardy(AttendanceDTO attendanceDTO);
	
	// 출근 버튼 클릭 시 수정
	Integer updateCheckin(AttendanceDTO attendanceDTO);
	
	// 최근 6개월 월별 근무시간 총합 조회
	List<Integer> selectWorkTimeByMonth(Integer employeeNo);
	
	// 당일 월 지각, 조퇴, 결근 횟수 조회
	AttendanceContentDTO selectAttendanceContent(Integer employeeNo);
	
	// 출근 관리 리스트 조회
	List<AttendanceListDTO> selectAttendanceList(AttendanceListDTO attendanceListDTO);
	
}
