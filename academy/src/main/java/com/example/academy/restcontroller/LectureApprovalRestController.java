package com.example.academy.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.academy.dto.LectureApprovalGetBeginTimeDTO;
import com.example.academy.service.LectureApprovalService;
import com.example.academy.vo.Common;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class LectureApprovalRestController {
	@Autowired LectureApprovalService lectureApprovalService;
	
	// 진수우 : 폼에서 입력한 데이터를 기반으로 예약 가능한 시작시간 조회.
	@PostMapping("/restapi/getBeginLectureTime")
	public List<Common> getBeginLectureTime(@RequestBody LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO) {
		return lectureApprovalService.getLectureApprovalGetBeginTime(lectureApprovalGetBeginTimeDTO);
	}
	
	// 진수우 : 폼에서 입력한 데이터를 기반으로 예약 가능한 시작시간 조회.
	@PostMapping("/restapi/getEndLectureTime")
	public List<Common> getEndLectureTime(@RequestBody LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO) {
		return lectureApprovalService.getLectureApprovalGetEndTime(lectureApprovalGetBeginTimeDTO);
	}
	
	// 진수우 : 폼에서 입력한 데이터를 기반으로 예약 가능한 시작시간 조회.
	@PostMapping("/restapi/getBeginLectureTimeFromModify")
	public List<Common> getBeginLectureTimeFromModify(@RequestBody LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO) {
		return lectureApprovalService.getLectureApprovalGetBeginTimeFromModify(lectureApprovalGetBeginTimeDTO);
	}
	
	// 진수우 : 폼에서 입력한 데이터를 기반으로 예약 가능한 시작시간 조회.
	@PostMapping("/restapi/getEndLectureTimeFromModify")
	public List<Common> getEndLectureTimeFromModify(@RequestBody LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO) {
		return lectureApprovalService.getLectureApprovalGetEndTimeFromModify(lectureApprovalGetBeginTimeDTO);
	}
	
	// 진수우 : 폼에서 입력한 데이터를 기반으로 예약 가능한 시작시간 조회.
	@PostMapping("/restapi/getBeginLectureTimeFromLectureModify")
	public List<Common> getBeginLectureTimeFromLectureModify(@RequestBody LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO) {
		return lectureApprovalService.getLectureApprovalGetBeginTimeFromLectureModify(lectureApprovalGetBeginTimeDTO);
	}
	
	// 진수우 : 폼에서 입력한 데이터를 기반으로 예약 가능한 시작시간 조회.
	@PostMapping("/restapi/getEndLectureTimeFromLectureModify")
	public List<Common> getEndLectureTimeFromLectureModify(@RequestBody LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO) {
		return lectureApprovalService.getLectureApprovalGetEndTimeFromLectureModify(lectureApprovalGetBeginTimeDTO);
	}
}
