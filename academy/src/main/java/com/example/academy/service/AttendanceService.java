package com.example.academy.service;

import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.AttendanceContentDTO;
import com.example.academy.dto.AttendanceDTO;
import com.example.academy.dto.AttendanceListDTO;
import com.example.academy.mapper.AttendanceApprovalMapper;
import com.example.academy.mapper.AttendanceMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class AttendanceService {
	@Autowired AttendanceMapper attendanceMapper;
	@Autowired AttendanceApprovalMapper attendanceApprovalMapper;
	
	// 오늘 출퇴근 시간 조회
	public AttendanceDTO getCheckTime(AttendanceDTO OattendanceDTO) {
		return attendanceMapper.selectCheckTime(OattendanceDTO);
	}
	
	// 오늘 퇴근 활성화 확인
	public Integer getSelectCheckout(AttendanceDTO attendanceDTO) {
		return attendanceMapper.selectCheckout(attendanceDTO);
	}
	
	// 오늘 출근 활성화 확인
	public Integer getSelectCheckin(AttendanceDTO attendanceDTO) {
		return attendanceMapper.selectCheckin(attendanceDTO);
	}
	
	// 퇴근 버튼 클릭시 수정
	public Integer modifyCheckOut(AttendanceDTO attendanceDTO) {
		log.debug("attendanceDTO ----->" + attendanceDTO);
		
		Integer row = attendanceMapper.updateCheckout(attendanceDTO);
		log.debug("퇴근 ----> " + row);		
						
		String approvalContent = attendanceApprovalMapper.selectContentByDay(attendanceDTO);
		log.debug("신청서 근태 유형 ----> " + approvalContent);
	    
		// AttendanceDTO 객체에서 출퇴근 시간 가져오기
		AttendanceDTO checkTime = attendanceMapper.selectCheckTime(attendanceDTO);
		
		// 출근 시간 및 퇴근 시간 추출
		String checkIn = checkTime.getAttendanceCheckIn(); // 2015-11-11 11:11:11
		String checkOut = checkTime.getAttendanceCheckOut();
		
		// 시간을 LocalTime으로 변환 (시간만 필요하므로 split을 사용하여 시간 부분만 추출)
		LocalTime checkInTime = LocalTime.parse(checkIn.split(" ")[1]); // 11::11:11
		LocalTime checkOutTime = LocalTime.parse(checkOut.split(" ")[1]);
		
		// 시간 로그 출력
		log.debug("출근 시간 확인 ----> " + checkInTime);
		log.debug("퇴근 시간 확인 ----> " + checkOutTime);
		
		LocalTime nineAM = LocalTime.of(9, 0);   // 09:00:00
		LocalTime noon = LocalTime.of(13, 0); // "13:00:00"
		LocalTime twoPM = LocalTime.of(14, 0);   // 14:00:00
		LocalTime evening = LocalTime.of(18, 0); // "18:00:00"
		
		// 출퇴근 시간에 따라 지각/조퇴 활성화 및 근무 유형 변경
		if(approvalContent == null) { // 근무유형이 NULL일 때
			if((checkInTime.isBefore(nineAM) || checkInTime.equals(nineAM)) 
					&& (checkOutTime.isAfter(evening) || checkOutTime.equals(evening))) { // 09:00 >= 출근시간 && 퇴근시간 >= 18:00 -> 정상출근
					attendanceDTO.setAttendanceContent("CT010"); // CT010 = 정상출근 
					attendanceMapper.updateContent(attendanceDTO); // 근태유형 정상출근으로 변경
			} else if(checkInTime.isAfter(nineAM)
					&& (checkOutTime.isAfter(evening) || checkOutTime.equals(evening))) { // 09:00 < 출근시간 && 퇴근시간 >= 18:00 -> 지각
					attendanceMapper.updateLate(attendanceDTO); // 지각 활성화
					attendanceDTO.setAttendanceContent("CT006"); // CT006 = 지각
					attendanceMapper.updateContent(attendanceDTO); // 근태유형 지각으로 변경
			} else if((checkInTime.isBefore(nineAM) || checkInTime.equals(nineAM)) // 09:00 >= 출근시간 && 퇴근시간 < 18:00 -> 조퇴 
					&& checkOutTime.isBefore(evening)) { 
					attendanceMapper.updateEarlyLeave(attendanceDTO); // 조퇴 활성화
					attendanceDTO.setAttendanceContent("CT005"); // CT005 = 조퇴
					attendanceMapper.updateContent(attendanceDTO); // 근태유형 조퇴으로 변경
			} else { // 9 < 출근시간 && 퇴근시간 < 18
					attendanceMapper.updateLate(attendanceDTO); // 지각 활성화
					attendanceMapper.updateEarlyLeave(attendanceDTO); // 조퇴 활성화
					attendanceDTO.setAttendanceContent("CT011"); // CT011 = 비정상출근
					attendanceMapper.updateContent(attendanceDTO); // 근태유형 비정상출근으로 변경
			}
		} else if(approvalContent.equals("CT003")) { // 근태유형 == '오전반차'
			if((checkInTime.isBefore(twoPM) || checkInTime.equals(twoPM)) 
					&& (checkOutTime.isAfter(evening) || checkOutTime.equals(evening))) { // 근태유형 == '오전반차' && 14:00 >= 출근시간 && 퇴근시간 >= 18:00 -> 오전반차
			} else if(checkInTime.isAfter(twoPM)
					&& (checkOutTime.isAfter(evening) || checkOutTime.equals(evening))) { // 근태유형 == '오전반차' && 14:00 < 출근시간 && 퇴근시간 >= 18:00 -> (오전반차)지각 CT006 
					attendanceMapper.updateLate(attendanceDTO); // 지각 활성화
			} else if((checkInTime.isBefore(twoPM) || checkInTime.equals(twoPM)) //근태유형 == '오전반차' && 14:00 >= 출근시간 && 퇴근시간 < 18:00 -> (오전반차)조퇴 CT005
					&& checkOutTime.isBefore(evening)) { 
					attendanceMapper.updateEarlyLeave(attendanceDTO); // 조퇴 활성화
			} else { // 14 < 출근시간 && 퇴근시간 < 18
					attendanceMapper.updateLate(attendanceDTO); // 지각 활성화
					attendanceMapper.updateEarlyLeave(attendanceDTO); // 조퇴 활성화
					attendanceDTO.setAttendanceContent("CT011"); // CT011 = 비정상출근
					attendanceMapper.updateContent(attendanceDTO); // 근태유형 비정상출근으로 변경
			}
		} else if(approvalContent.equals("CT004")) {	// 근태유형 == '오후반차'
			if((checkInTime.isBefore(nineAM) || checkInTime.equals(nineAM)) 
					&& (checkOutTime.isAfter(noon) || checkOutTime.equals(noon))) { // 09:00 >= 출근시간 && 퇴근시간 >= 13:00 -> 오후반차 CT004'
			} else if(checkInTime.isAfter(nineAM)
					&& (checkOutTime.isAfter(noon) || checkOutTime.equals(noon))) { // 09:00 < 출근시간 && 퇴근시간 >= 13:00 -> (오후반차)지각
					attendanceMapper.updateLate(attendanceDTO); // 지각 활성화
			} else if((checkInTime.isBefore(nineAM) || checkInTime.equals(nineAM)) // 09:00 >= 출근시간 && 퇴근시간 < 13:00 -> (오후반차)조퇴
					&& checkOutTime.isBefore(noon)) {
					attendanceMapper.updateEarlyLeave(attendanceDTO); // 조퇴 활성화
 			} else { // 9 < 출근시간 && 퇴근시간 < 13
	 				attendanceMapper.updateLate(attendanceDTO); // 지각 활성화
					attendanceMapper.updateEarlyLeave(attendanceDTO); // 조퇴 활성화
					attendanceDTO.setAttendanceContent("CT011"); // CT011 = 비정상출근
					attendanceMapper.updateContent(attendanceDTO); // 근태유형 비정상출근으로 변경
 			}
		} else  { // 근무유형이 NULL이 아니거나 다른 근무 유형일때
			if((checkInTime.isBefore(nineAM) || checkInTime.equals(nineAM)) 
					&& (checkOutTime.isAfter(evening) || checkOutTime.equals(evening))) { // 09:00 >= 출근시간 && 퇴근시간 >= 18:00 -> 정상출근
					attendanceDTO.setAttendanceContent("CT010"); // CT010 = 정상출근 
					attendanceMapper.updateContent(attendanceDTO); // 근태유형 정상출근으로 변경
			} else if(checkInTime.isAfter(nineAM)
					&& (checkOutTime.isAfter(evening) || checkOutTime.equals(evening))) { // 09:00 < 출근시간 && 퇴근시간 >= 18:00 -> 지각
					attendanceMapper.updateLate(attendanceDTO); // 지각 활성화
					attendanceDTO.setAttendanceContent("CT006"); // CT006 = 지각
					attendanceMapper.updateContent(attendanceDTO); // 근태유형 지각으로 변경
			} else if((checkInTime.isBefore(nineAM) || checkInTime.equals(nineAM)) // 09:00 >= 출근시간 && 퇴근시간 < 18:00 -> 조퇴 
					&& checkOutTime.isBefore(evening)) { 
					attendanceMapper.updateEarlyLeave(attendanceDTO); // 조퇴 활성화
					attendanceDTO.setAttendanceContent("CT005"); // CT005 = 조퇴
					attendanceMapper.updateContent(attendanceDTO); // 근태유형 조퇴으로 변경
			} else { // 9 < 출근시간 && 퇴근시간 < 18
	 				attendanceMapper.updateLate(attendanceDTO); // 지각 활성화
					attendanceMapper.updateEarlyLeave(attendanceDTO); // 조퇴 활성화
					attendanceDTO.setAttendanceContent("CT011"); // CT011 = 비정상출근
					attendanceMapper.updateContent(attendanceDTO); // 근태유형 비정상출근으로 변경
			}
		}	
		return 1;
	}
	
	// 출근 버튼 클릭시 수정
	public Integer modifyCheckin(AttendanceDTO attendanceDTO) {
		
		String content = attendanceApprovalMapper.selectContentByDay(attendanceDTO);
		log.debug("근태 유형 ----> " + content);
		String currentDate = attendanceDTO.getCurrentDate(); // 현재 날짜 2025-01-20
		log.debug("현재 날짜 ---->" + currentDate);
		
		return attendanceMapper.updateCheckin(attendanceDTO);
	}
	
	// 최근 6개월 월별 근무시간 총합 조회
	public List<Integer> getAttendanceTotalWorkTime(Integer employeeNo) {
		return attendanceMapper.selectWorkTimeByMonth(employeeNo);
	}
	
	// 당일 월 지각, 조퇴, 결근 횟수 조회
	public AttendanceContentDTO getAttendanceContent(Integer employeeNo) {
		return attendanceMapper.selectAttendanceContent(employeeNo);
	}
	
	// 출근 관리 리스트 조회
	public List<AttendanceListDTO> getAttendanceList(AttendanceListDTO attendanceListDTO) {
		return attendanceMapper.selectAttendanceList(attendanceListDTO);
	}
}
