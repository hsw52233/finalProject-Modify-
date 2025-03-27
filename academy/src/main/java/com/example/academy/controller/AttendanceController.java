package com.example.academy.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.academy.dto.AttendanceContentDTO;
import com.example.academy.dto.AttendanceDTO;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.AttendanceService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class AttendanceController {
	@Autowired AttendanceService attendanceService;
	
	// 퇴근 버튼 클릭시 수정
	@GetMapping("/modifyCheckout")
	public String modifyCheckOut(AttendanceDTO attendanceDTO) {
		
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(	authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        
	        // 사원 번호
	        Integer employeeNo = Integer.parseInt(userDetails.getUsername());
	        
	        // 현재 날짜 ex) 2025-11-11
	        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
	        
	        // DTO에 추가
	        attendanceDTO.setEmployeeNo(employeeNo);
	        attendanceDTO.setCurrentDate(currentDate);
	        
	        // 퇴근 수정 메서드 호출
	        Integer row = attendanceService.modifyCheckOut(attendanceDTO);
	        log.debug("퇴근 수정 확인---->" + row);
	    }
		return "redirect:/main";
	}
	
	// 출근 버튼 클릭시 수정
	@GetMapping("/modifyCheckin")
	public String modifyCheckin(AttendanceDTO attendanceDTO) {
		
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(	authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        
	        // 사원 번호
	        Integer employeeNo = Integer.parseInt(userDetails.getUsername());
	    
	        // 현재 날짜 ex) 2025-11-11
	        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
	        
	        // DTO에 추가
	        attendanceDTO.setEmployeeNo(employeeNo);
	        attendanceDTO.setCurrentDate(currentDate);
	        
	        // 출근 수정 메서드 호출
	        Integer row = attendanceService.modifyCheckin(attendanceDTO);
	        log.debug("출근 수정 확인---->" + row);
	    }
	    return "redirect:/main";
	}
	
	// 출근 관리 폼 호출
	@GetMapping("/attendanceList")
	public String attendanceList(Model model) {
		
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        
	        // 현재 시각을 가져와서 "yyyy-MM" 형식으로 포맷팅
	        String currentMonth = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
	        log.debug("currentMonth ------>" + currentMonth);
	        
	        // 당일 월 지각, 조퇴, 결근 횟수 조회
	        AttendanceContentDTO content = attendanceService.getAttendanceContent(Integer.parseInt(userDetails.getUsername()));
	        
	        // 최근 6개월 월별 근무시간 총합 조회
	        List<Integer> totalWorkTime = attendanceService.getAttendanceTotalWorkTime(Integer.parseInt(userDetails.getUsername()));
	        
	        // 모델에 추가	        	        
	        model.addAttribute("totalWorkTimeList", totalWorkTime); // 최근 6개월 월별 근무시간 총합 리스트
	        model.addAttribute("absence", content.getAbsence()); // 결근
	        model.addAttribute("earlyLeave", content.getEarlyLeave()); // 조퇴
	        model.addAttribute("late", content.getLate()); // 지각
	        model.addAttribute("currentMonth", currentMonth); // 현재 날짜 ex) 2025-01
	        model.addAttribute("employeeNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	    }
		return "attendanceList";
	}
}

//이 컨트롤러는 Spring Security를 활용해 현재 로그인한 사용자 정보를 가져와서 근태 데이터를 기록하고, 조회하는 역할
//MVC 패턴을 기반으로 컨트롤러 → 서비스 → DTO 형태로 데이터를 관리 
