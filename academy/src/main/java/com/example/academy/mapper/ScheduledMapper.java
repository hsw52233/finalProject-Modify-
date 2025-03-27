package com.example.academy.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.AttendanceDTO;

@Mapper
public interface ScheduledMapper {
	// 매일 23시 59분에 유형 NULL이고, 출퇴근시간이 비정상일 시 비정상출근처리
	Integer updateContentByAbnormal(Integer employeeNo);
	
	// 주말 23시 59분에 출퇴 NULL인 데이터 휴일처리
	Integer updateContentByHoliday(Integer employeeNo);
	
	// 매일 23시 59분에 출퇴,유형 NULL인 데이터 결석처리
	Integer updateContentByAbsence(Integer employeeNo);
	
	// 근태 근태유형/출퇴시간변경(근태신청서가 있을 시 연차,병가,휴일 등)
	Integer updateAttendanceByCheckTime(AttendanceDTO attendanceDTO);
	
	// 근태 근태유형 변경(근태신청서가 있을 시 오전,오후 반차)
	Integer updateAttendance(AttendanceDTO attendanceDTO);
	
	// 오늘 근태신청서 근태유형 조회
	String selectContent(Integer employeeNo);
	
	// 근태 생성
	Integer insertAttendance(Integer employeeNo);
	
}
