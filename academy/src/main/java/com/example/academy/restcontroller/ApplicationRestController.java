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
public class ApplicationRestController {
	@Autowired AttendanceApprovalService attendanceApprovalService;
	@Autowired LectureApprovalService lectureApprovalService; // 추후 파일 변경후 수정
	
	// 김혜린 : 나의 신청서 리스트 - 근태신청서
	@GetMapping("/restapi/attendanceApprovalList")
	public List<Object[]> attendanceApprovalList(Integer employeeNo) {
		List<AttendanceApprovalListDTO> attendanceApprovalList = attendanceApprovalService.getAttendanceApprovalList(employeeNo);
		List<Object[]> result = new ArrayList<>();
		
		log.debug("employeeNo: " + employeeNo);	// 디버깅
		
		for(AttendanceApprovalListDTO list : attendanceApprovalList) {
			result.add(list.toArray());	// AttendanceApproval 객체를 배열로 반환
		}
		
		return result;
	}
	
	// 김혜린 : 나의 신청서 리스트 - 강의신청서
	@GetMapping("/restapi/lectureApprovalList")
	public List<Object[]> lectureApprovalList(Integer employeeNo){
		List<LectureApprovalListDTO> lectureApprovalList = lectureApprovalService.getLectureApprovalList(employeeNo);
		List<Object[]> result = new ArrayList<>();
		
		log.debug("employeeNo: " + employeeNo);	// 디버깅
		
		for(LectureApprovalListDTO list : lectureApprovalList) {
			result.add(list.toArray());
		}
		
		return result;
	}
	
}
