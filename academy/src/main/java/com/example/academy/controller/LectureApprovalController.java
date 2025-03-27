package com.example.academy.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import com.example.academy.dto.ClassroomListDTO;
import com.example.academy.dto.LectureApprovalAddDTO;
import com.example.academy.dto.LectureApprovalEmployeeListDTO;
import com.example.academy.dto.LectureApprovalModifyDTO;
import com.example.academy.dto.LectureApprovalOneDTO;
import com.example.academy.dto.LectureApprovalWeekdayListDTO;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.ClassroomService;
import com.example.academy.service.CommonService;
import com.example.academy.service.LectureApprovalService;
import com.example.academy.service.LectureService;
import com.example.academy.vo.Common;
import com.example.academy.vo.Files;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class LectureApprovalController {
	@Autowired LectureService lectureService;
	@Autowired CommonService commonService;
	@Autowired ClassroomService classroomService;
	@Autowired LectureApprovalService lectureApprovalService;
	
	// 진수우 : 강의결재 수정 제출.
	@PostMapping("/retryLectureApproval")
	public String retryLectureApproval(LectureApprovalAddDTO lectureApprovalDTO, Integer lectureApprovalNo) {
		// 강의결재 재신청 수행.
		lectureApprovalService.retryLectureApproval(lectureApprovalDTO, lectureApprovalNo);
		return "redirect:/applicationList";
	}
	
	// 진수우 : 강의결재 재신청폼 호출.
	@GetMapping("/retryLectureApproval")
	public String retryLectureApproval(Model model, Integer lectureApprovalNo) {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        model.addAttribute("userNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userRole", userDetails.getUserRole());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	    }
	    
	    // 1) 강의 요일 조회(셀렉박스)
  		List<Common> commonWeekday = commonService.getWeekday();
  		model.addAttribute("commonWeekday", commonWeekday);
  		
  		// 2) 강의 시간 조회(셀렉박스)
  		List<Common> commonTime = commonService.getTime();
  		model.addAttribute("commonTime", commonTime);
  		
  		// 3) 강의실 조회(셀렉박스)
  		List<ClassroomListDTO> classroomList = classroomService.getClassroomList();
 	 	model.addAttribute("classroomList", classroomList);
	 	 	
		// 강의결재 테이블에서 데이터 가져오기.
		LectureApprovalOneDTO lectureApprovalOne = lectureApprovalService.getLectureApprovalOne(lectureApprovalNo);
		model.addAttribute("lectureApprovalOne", lectureApprovalOne);
		
		// 강의결재요일 테이블에서 데이터 가져오기.
		List<LectureApprovalWeekdayListDTO> lectureApprovalWeekday = lectureApprovalService.getLectureApprovalWeekday(lectureApprovalNo);
		model.addAttribute("lectureApprovalWeekday", lectureApprovalWeekday);
		
		// 파일 테이블에서 데이터 가져오기.
		List<Files> lectureApprovalFile = lectureApprovalService.getLectureApprovalFile(lectureApprovalNo);
		model.addAttribute("lectureApprovalFile", lectureApprovalFile);
		
		// 결재자 테이블에서 데이터 가져오기.
		List<LectureApprovalEmployeeListDTO> lectureApprovalEmployee = lectureApprovalService.getLectureApprovalEmployee(lectureApprovalNo);
		model.addAttribute("lectureApprovalEmployee", lectureApprovalEmployee);
		
		return "retryLectureApproval";
	}
	
	// 진수우 : 강의결재 승인.
	@PostMapping("/acceptLectureApproval")
	public String acceptLectureApproval(Integer lectureApprovalNo, Integer approver) {
		lectureApprovalService.acceptLectureApproval(lectureApprovalNo, approver);
		return "redirect:/completeLectureApprovalOne?lectureApprovalNo=" + lectureApprovalNo;
	}
		
	// 진수우 : 강의결재 반려.
	@PostMapping("/returnLectureApproval")
	public String returnLectureApproval(Integer lectureApprovalNo, Integer approver, String rejectReason) {
		lectureApprovalService.returnLectureApproval(lectureApprovalNo, approver, rejectReason);
		return "redirect:/lectureApprovalOne?lectureApprovalNo=" + lectureApprovalNo;
	}
	
	// 진수우 : 강의결재 삭제.
	@GetMapping("/lectureApprovalUpdateUse")
	public String lectureApprovalUpdateUse(Integer lectureApprovalNo) {
		lectureApprovalService.modifyLectureApprovalUse(lectureApprovalNo);
		return "redirect:/applicationList";
	}
	
	// 진수우 : 강의결재 수정 제출.
	@PostMapping("/modifyLectureApproval")
	public String modifyLectureApproval(Model model, LectureApprovalModifyDTO lectureApprovalDTO) {
		// 강의결재수정 수행.
		lectureApprovalService.modifyLectureApproval(lectureApprovalDTO);
		return "redirect:/applicationList";
	}
	
	// 진수우 : 강의결재 수정페이지 호출.
	@GetMapping("/modifyLectureApproval")
	public String modifyLectureApproval(Model model, Integer lectureApprovalNo) {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        model.addAttribute("userNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userRole", userDetails.getUserRole());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	    }
	    
	    // 1) 강의 요일 조회(셀렉박스)
  		List<Common> commonWeekday = commonService.getWeekday();
  		model.addAttribute("commonWeekday", commonWeekday);
  		
  		// 2) 강의 시간 조회(셀렉박스)
  		List<Common> commonTime = commonService.getTime();
  		model.addAttribute("commonTime", commonTime);
  		
  		// 3) 강의실 조회(셀렉박스)
  		List<ClassroomListDTO> classroomList = classroomService.getClassroomList();
 	 	model.addAttribute("classroomList", classroomList);
	 	 	
		// 강의결재 테이블에서 데이터 가져오기.
		LectureApprovalOneDTO lectureApprovalOne = lectureApprovalService.getLectureApprovalOne(lectureApprovalNo);
		model.addAttribute("lectureApprovalOne", lectureApprovalOne);
		
		// 강의결재요일 테이블에서 데이터 가져오기.
		List<LectureApprovalWeekdayListDTO> lectureApprovalWeekday = lectureApprovalService.getLectureApprovalWeekday(lectureApprovalNo);
		model.addAttribute("lectureApprovalWeekday", lectureApprovalWeekday);
		
		// 파일 테이블에서 데이터 가져오기.
		List<Files> lectureApprovalFile = lectureApprovalService.getLectureApprovalFile(lectureApprovalNo);
		model.addAttribute("lectureApprovalFile", lectureApprovalFile);
		
		// 결재자 테이블에서 데이터 가져오기.
		List<LectureApprovalEmployeeListDTO> lectureApprovalEmployee = lectureApprovalService.getLectureApprovalEmployee(lectureApprovalNo);
		model.addAttribute("lectureApprovalEmployee", lectureApprovalEmployee);
		
		return "modifyLectureApproval";
	}
	
	// 진수우 : 강의결재 상세페이지 호출.
	@GetMapping("/lectureApprovalOne")
	public String lectureApprovalOne(Model model, Integer lectureApprovalNo) {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        model.addAttribute("userNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userRole", userDetails.getUserRole());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	    }
	    
		// 강의결재 테이블에서 데이터 가져오기.
		LectureApprovalOneDTO lectureApprovalOne = lectureApprovalService.getLectureApprovalOne(lectureApprovalNo);
		model.addAttribute("lectureApprovalOne", lectureApprovalOne);
		
		// 강의결재요일 테이블에서 데이터 가져오기.
		List<LectureApprovalWeekdayListDTO> lectureApprovalWeekday = lectureApprovalService.getLectureApprovalWeekday(lectureApprovalNo);
		model.addAttribute("lectureApprovalWeekday", lectureApprovalWeekday);
		
		// 파일 테이블에서 데이터 가져오기.
		List<Files> lectureApprovalFile = lectureApprovalService.getLectureApprovalFile(lectureApprovalNo);
		model.addAttribute("lectureApprovalFile", lectureApprovalFile);
		
		// 결재자 테이블에서 데이터 가져오기.
		List<LectureApprovalEmployeeListDTO> lectureApprovalEmployee = lectureApprovalService.getLectureApprovalEmployee(lectureApprovalNo);
		model.addAttribute("lectureApprovalEmployee", lectureApprovalEmployee);
		
		// 결재자 테이블에서 최고 결재자 가져오기.
		Integer maxLevel = lectureApprovalService.getApprovalEmployeeMaxLevel(lectureApprovalNo);
		model.addAttribute("maxLevel", maxLevel);
		
		return "lectureApprovalOne";
	}
	
	// 김혜린 : 결재완료목록 - 강의결재 상세페이지
	@GetMapping("/completeLectureApprovalOne")
	public String completeLectureApprovalOne(Model model, Integer lectureApprovalNo) {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
		if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
			CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
			model.addAttribute("userNo", Integer.parseInt(userDetails.getUsername()));
			model.addAttribute("userName", userDetails.getUserRealName());
			model.addAttribute("userMail", userDetails.getUserMail());
			model.addAttribute("userRole", userDetails.getUserRole());
			model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
			model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
		}
		
		// 강의결재 테이블에서 데이터 가져오기.
		LectureApprovalOneDTO lectureApprovalOne = lectureApprovalService.getLectureApprovalOne(lectureApprovalNo);
		model.addAttribute("lectureApprovalOne", lectureApprovalOne);
		
		// 강의결재요일 테이블에서 데이터 가져오기.
		List<LectureApprovalWeekdayListDTO> lectureApprovalWeekday = lectureApprovalService.getLectureApprovalWeekday(lectureApprovalNo);
		model.addAttribute("lectureApprovalWeekday", lectureApprovalWeekday);
		
		// 파일 테이블에서 데이터 가져오기.
		List<Files> lectureApprovalFile = lectureApprovalService.getLectureApprovalFile(lectureApprovalNo);
		model.addAttribute("lectureApprovalFile", lectureApprovalFile);
		
		// 결재자 테이블에서 데이터 가져오기.
		List<LectureApprovalEmployeeListDTO> lectureApprovalEmployee = lectureApprovalService.getLectureApprovalEmployee(lectureApprovalNo);
		model.addAttribute("lectureApprovalEmployee", lectureApprovalEmployee);
		
		// 결재자 테이블에서 최고 결재자 가져오기.
		Integer maxLevel = lectureApprovalService.getApprovalEmployeeMaxLevel(lectureApprovalNo);
		model.addAttribute("maxLevel", maxLevel);
		
		return "completeLectureApprovalOne";
	}
	
	// 진수우 : 강의결재 신청서 제출.
	@PostMapping("/addLectureApproval")
	public String addLectureApproval(Model model, LectureApprovalAddDTO lectureApprovalDTO) {
		lectureApprovalService.addLectureApproval(lectureApprovalDTO);
		return "redirect:/applicationList";
	}
	
	// 진수우 : 강의결재 신청서 작성페이지 호출.
	@GetMapping("/addLectureApproval")
	public String addAttendanceApproval(Model model) {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        model.addAttribute("userNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userRole", userDetails.getUserRole());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	    }
	    
	    // 1) 강의 요일 조회(셀렉박스)
 		List<Common> commonWeekday = commonService.getWeekday();
 		model.addAttribute("commonWeekday", commonWeekday);
 		
 		// 2) 강의 시간 조회(셀렉박스)
 		List<Common> commonTime = commonService.getTime();
 		model.addAttribute("commonTime", commonTime);
 		
 		// 3) 강의실 조회(셀렉박스)
 		List<ClassroomListDTO> classroomList = classroomService.getClassroomList();
	 	model.addAttribute("classroomList", classroomList);
		
		return "addLectureApproval";
	}
	
}

/*
 * 강의 결재 관련 요청 처리하는 컨트롤러
 * Model 객체를 통해 View로 데이터 전달
 * Spring Security로 인증 정보 획득
 * 
 */
