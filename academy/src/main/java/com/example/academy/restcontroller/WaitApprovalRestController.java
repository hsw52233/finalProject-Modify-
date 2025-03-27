package com.example.academy.restcontroller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.academy.dto.AttendanceApprovalListDTO;
import com.example.academy.dto.LectureApprovalListDTO;
import com.example.academy.service.AttendanceApprovalService;
import com.example.academy.service.LectureApprovalService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class WaitApprovalRestController {
	@Autowired AttendanceApprovalService attendanceApprovalService;
	@Autowired LectureApprovalService lectureApprovalService; // 추후 파일 변경후 수정
	
	// 김혜린 : 결재 대기 목록 출력 - 근태신청서
	@GetMapping("/restapi/waitAttendanceApprovalList")
	public List<Object[]> waitAttendanceApprovalList(Integer employeeNo) {
		List<AttendanceApprovalListDTO> waitAttendanceApprovalList = attendanceApprovalService.getWaitAttendanceApprovalList(employeeNo);
		List<Object[]> result = new ArrayList<>();
		
		log.debug("employeeNo: " + employeeNo);	// 디버깅
		
		for(AttendanceApprovalListDTO list : waitAttendanceApprovalList) {
			result.add(list.toArray());	// AttendanceApproval 객체를 배열로 반환
		}
		
		return result;
	}
	
	// 김혜린 : 결재 대기 목록 출력 - 강의신청서
	@GetMapping("/restapi/waitLectureApprovalList")
	public List<Object[]> waitLectureApprovalList(Integer employeeNo){
		List<LectureApprovalListDTO> waitLectureApprovalList = lectureApprovalService.getWaitLectureApprovalList(employeeNo);
		List<Object[]> result = new ArrayList<>();
		
		log.debug("employeeNo: " + employeeNo);	// 디버깅
		
		for(LectureApprovalListDTO list : waitLectureApprovalList) {
			result.add(list.toArray());
		}
		
		return result;
	}
	
}
