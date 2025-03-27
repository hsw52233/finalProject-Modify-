package com.example.academy.controller;

import java.time.LocalDateTime; // 날짜와 시간을 다루는 Java의 표준 클래스
import java.time.format.DateTimeFormatter; // 날짜 및 시간을 원하는 형식으로 변환하거나 파싱하는 데 사용
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken; // Spring Security에서 익명 사용자(로그인하지 않은 사용자)의 인증 정보를 다룰 때 사용하는 클래스
import org.springframework.security.core.Authentication; // 사용자의 인증 정보를 담는 인터페이스. 로그인한 사용자의 정보를 조회할 때 사용
import org.springframework.security.core.context.SecurityContextHolder; // 현재 로그인한 사용자의 인증 정보를 전역적으로 관리하는 컨텍스트.
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.academy.security.CustomUserDetails; // 프로젝트 내부에서 정의한 사용자 정보 클래스. 
import com.example.academy.service.AnnualLeaveService;

@Controller // 웹 요청을 받아서 처리하고 View로 데이터를 전달하는 역할.
public class AnnualLeaveController { // 연차 관련 요청을 처리하는 컨트롤러 클래스.
	@Autowired AnnualLeaveService annualLeaveService;
	
	// 연차 리스트 폼
	@GetMapping("/annualLeaveList")
	public String annualLeaveList(Model model) {
		
		// 스프링시큐리티에서 계정정보(인증정보) 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) { // 익명사용자가 아닌 경우만
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    
	        // 현재 시각을 가져와서 "yyyy-MM" 형식으로 포맷팅
	        String currentMonth = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
	        
	        // 이번 달 연차 개수 조회
	        Double annualLeaveCount = annualLeaveService.getAnnualLeaveCount(Integer.parseInt(userDetails.getUsername()));     
	        
	        // 최근 6개월 간 연차 사용 갯수 총합
	        List<Double> annualLeaveCountList = annualLeaveService.getAnnualLeaveCountByMonth(Integer.parseInt(userDetails.getUsername()));
	        
	        // 모델에 추가	        
	        model.addAttribute("annualLeaveCountList", annualLeaveCountList); // 최근 6개월 간 연차 사용 갯수 총합
	        model.addAttribute("count", annualLeaveCount); // 이번 달 연차 사용 개수
	        model.addAttribute("employeeNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	        model.addAttribute("currentMonth", currentMonth);
	    }
		
	    
	    
		return "annualLeaveList";
	}
}

/*
 * 이 컨트롤러는 로그인한 사용자의 연차 데이터를 조회하고 화면에 출력하는 역할을 함.
	REST API 스타일이 아니라, Spring MVC 기반의 웹 애플리케이션용 컨트롤러
 */
