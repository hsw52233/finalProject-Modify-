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
import org.springframework.web.bind.annotation.RequestParam;

import com.example.academy.dto.ClassroomListDTO;
import com.example.academy.dto.LectureModifyDTO;
import com.example.academy.dto.LectureOneDTO;
import com.example.academy.dto.LectureOneTimeListDTO;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.ClassroomService;
import com.example.academy.service.CommonService;
import com.example.academy.service.LectureService;
import com.example.academy.vo.Common;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class LectureController {
	@Autowired LectureService lectureService;
	@Autowired CommonService commonService;
	@Autowired ClassroomService classroomService;
	
	// 김혜린 : 강의 삭제(사용여부 비활성화)
	@GetMapping("/removeLecture")
	public String removeLecture(Integer lectureNo) {
		lectureService.removeLecture(lectureNo);
		
		return "redirect:/lectureList";
	}
	
	// 김혜린, 진수우 : 강의 수정페이지
	@GetMapping("/modifyLecture")
	public String modifyLecture(Model model, Integer lectureNo) {
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
	    
		// 강의 기존정보 불러오기 
		// 1) 강의 상세정보 출력
		LectureOneDTO lecture = lectureService.getLectureOne(lectureNo);
		model.addAttribute("lecture", lecture);
		log.debug("강의상세정보 : " + lecture);	//디버깅
		// 2) 강의 시간 리스트 출력
		List<LectureOneTimeListDTO> timeList = lectureService.getLectureOneTimeList(lectureNo);
		model.addAttribute("timeList", timeList);
		log.debug("강의시간정보 리스트 : " + timeList);	//디버깅
		
		// 3) 강의 요일 조회(셀렉박스)
		List<Common> commonWeekday = commonService.getWeekday();
		model.addAttribute("commonWeekday", commonWeekday);
		log.debug("----요일 리스트 : " + commonWeekday);	//디버깅
		
		// 3) 강의 시간 조회(셀렉박스)
		List<Common> commonTime = commonService.getTime();
		model.addAttribute("commonTime", commonTime);
		log.debug("----시간 리스트 : " + commonTime);	//디버깅
		
		// 3) 강의실 조회(셀렉박스)
  		List<ClassroomListDTO> classroomList = classroomService.getClassroomList();
 	 	model.addAttribute("classroomList", classroomList);
 	 	
		return "modifyLecture";
	}
	// 김혜린, 진수우 : 강의 수정페이지
	@PostMapping("/modifyLecture")
	public String modifyLecture(LectureModifyDTO lectureModifyDTO, @RequestParam(value="timeList", required = false) List<String> list) {
		log.debug("----------lectureModifyDTO : " + lectureModifyDTO);	//디버깅
		log.debug("----------list : " + list);	//디버깅
		//	강의 수정 
		lectureService.modifyLecture(lectureModifyDTO, list);
		
		return "redirect:/lectureOne?lectureNo=" + lectureModifyDTO.getLectureNo();
	}
	
	
	// 김혜린, 진수우 : 강의 상세페이지
	@GetMapping("/lectureOne")
	public String lectureOne(Model model, Integer lectureNo) {
		
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
		
		// 강의 상세정보 출력
		LectureOneDTO lecture = lectureService.getLectureOne(lectureNo);
		model.addAttribute("lecture", lecture);
		log.debug("강의상세정보 : " + lecture);	//디버깅
		// 강의 시간 리스트 출력
		List<LectureOneTimeListDTO> timeList = lectureService.getLectureOneTimeList(lectureNo);
		model.addAttribute("timeList", timeList);
		log.debug("강의시간정보 리스트 : " + timeList);	//디버깅
		
		return "lectureOne";
	}
	
	
	// 김혜린 : 강의 리스트 출력
	@GetMapping("/lectureList")
	public String lectureList(Model model) {
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
		return "lectureList";		
	}

}


/*
 * 주요 기능 : 강의 리스트 조회, 강의 상세 조회, 강의 수정 페이지 호출&수정 처리, 강의 삭제 처리
 * 
 * 
 */
