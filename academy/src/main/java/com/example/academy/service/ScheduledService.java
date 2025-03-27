package com.example.academy.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.AttendanceDTO;
import com.example.academy.dto.EmployeeListDTO;
import com.example.academy.mapper.EmployeeMapper;
import com.example.academy.mapper.ScheduledMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class ScheduledService {

	@Autowired private ScheduledMapper scheduledMapper;
	@Autowired private EmployeeMapper employeeMapper;
	
	// 00시마다 모든 사원 근태 데이터 생성
	@Scheduled(cron = "0 00 00 * * ?")
	public void generateAttendanceData() {    
		// 1. 모든 사원 조회
        List<EmployeeListDTO> employees = employeeMapper.selectEmployeeList();
        
        // 2. 근태 데이터 생성
        for(EmployeeListDTO employeeListDTO : employees) {
        	scheduledMapper.insertAttendance(employeeListDTO.getEmployeeNo());
        	log.debug("--------------------사원 " + employeeListDTO.getEmployeeNo() + "의 근태 데이터 생성");
        	String attendanceApprovalType = scheduledMapper.selectContent(employeeListDTO.getEmployeeNo());
        	
        	// DTO에 employeeNo,content 넣기
        	AttendanceDTO attendance = new AttendanceDTO();
        	attendance.setEmployeeNo(employeeListDTO.getEmployeeNo());
        	attendance.setAttendanceContent(attendanceApprovalType);
        	
        	// 3. 근태 신청서가 승인된 경우, 근태유형에 따라 근태 정보 수정
            if (attendanceApprovalType != null && (attendanceApprovalType.equals("CT003") || attendanceApprovalType.equals("CT004"))) { // 근태유형이 오전반차, 오후반차일 시 근태유형만 변경
                scheduledMapper.updateAttendance(attendance);
                log.debug("----------------------사원 " + employeeListDTO.getEmployeeNo() + "의 근태 데이터 변경(반차)");
            } else if(attendanceApprovalType != null && !attendanceApprovalType.isEmpty()) { // 근태유형이 NULL이 아니거나 값이 있으면 근태유형, 출근, 퇴근 시간 변경 
            	scheduledMapper.updateAttendanceByCheckTime(attendance);
            	log.debug("----------------------사원 " + employeeListDTO.getEmployeeNo() + "의 근태 데이터 변경");
            } else {	
            	log.debug("----------------------사원 " + employeeListDTO.getEmployeeNo() + "의 승인된 근태 신청서가 없습니다.");
            }
        }
	}
	
	// 11시 59분마다 출/퇴 시간이 NULL이고 근태유형이 NULL인 데이터는 근태유형 결석／휴일로 변경
	@Scheduled(cron = "0 59 23 * * ?")
	public void attendanceByAbsence() {
		// 현재 시간정보를 가져옴.
		LocalDate today = LocalDate.now();

		// 1. 모든 사원 조회
        List<EmployeeListDTO> employees = employeeMapper.selectEmployeeList();
        
        for (EmployeeListDTO employee : employees) {
        	// 현재 시간정보가 주말이 아니라면, 
        	if (today.getDayOfWeek() != DayOfWeek.SATURDAY && today.getDayOfWeek() != DayOfWeek.SUNDAY) {
	        	// 출퇴근이 NULL이고 근무유형이 NULL이면 결석으로 변경.
	        	scheduledMapper.updateContentByAbsence(employee.getEmployeeNo());
	        	// 출퇴근시간이 비정상일 시 비정상출근처리
	        	scheduledMapper.updateContentByAbnormal(employee.getEmployeeNo());
        	} else { // 현재 시간정보가 주말이고 출퇴근이 NULL이고 근무유형이 NULL이면 휴일로 변경
        		scheduledMapper.updateContentByHoliday(employee.getEmployeeNo());
        		// 출퇴근시간이 비정상일 시 비정상출근처리
        		scheduledMapper.updateContentByAbnormal(employee.getEmployeeNo());
        	}
        }
	}
}
