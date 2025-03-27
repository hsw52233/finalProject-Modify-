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

import com.example.academy.dto.AffiliationModifyDTO;
import com.example.academy.dto.EmployeeAddDTO;
import com.example.academy.dto.EmployeeModifyDTO;
import com.example.academy.dto.EmployeeModifyGetDTO;
import com.example.academy.dto.EmployeeOneDTO;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.CommonService;
import com.example.academy.service.EmployeeService;
import com.example.academy.service.FilesService;
import com.example.academy.vo.Common;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class EmployeeController {
	@Autowired EmployeeService employeeService;
	@Autowired CommonService commonService;
	@Autowired FilesService filesService;
	
	// 진수우 : 사원 삭제.
	@GetMapping("/deleteEmployee")
	public String deleteEmployee(Integer employeeNo) {
		// 데이터베이스에서 사원삭제.
		employeeService.removeEmployee(employeeNo);
		return "redirect:/employeeList";
	}
	
	// 진수우 : 사원 부서/직책 수정.
	@PostMapping("/modifyEmployee")
	public String modifyEmployee(EmployeeModifyDTO employeeModifyDTO) {
		// 데이터베이스에서 사원/직책 수정.
		employeeService.modifyEmployee(employeeModifyDTO);
		return "redirect:/employeeOne?employeeNo=" + employeeModifyDTO.getEmployeeNo();
	}
	
	// 진수우 : 사원 부서/직책 수정.
	@PostMapping("/modifyAffiliation")
	public String modifyAffiliation(AffiliationModifyDTO affiliationModifyDTO) {
		// 데이터베이스에서 사원/직책 수정.
		employeeService.modifyAffiliation(affiliationModifyDTO);
		return "redirect:/employeeOne?employeeNo=" + affiliationModifyDTO.getEmployeeNo();
	}
	
	// 진수우 : 주소록 상세페이지, 마이페이지.
	@GetMapping("/employeeOne")
	public String employeeOne(Model model, Integer employeeNo, @RequestParam(value = "resultPw", required = false) Integer resultPw) {
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
		// 데이터베이스에서 해당 사원 조회.
		EmployeeOneDTO employee = employeeService.getEmployeeOne(employeeNo);
		model.addAttribute("employee", employee);
		// 데이터베이스에서 부서 카테고리 조회.
		List<Common> commonDepartment = commonService.getDepartmentCategory();
		model.addAttribute("commonDepartment", commonDepartment);
		// 데이터베이스에서 직급 카테고리 조회.
		List<Common> commonPosition = commonService.getPositionCategory();
		model.addAttribute("commonPosition", commonPosition);
		// 비밀번호 수정요청 결과값.
		model.addAttribute("resultPw", resultPw);
		// 데이터베이스에서 개인정보 수정 페이지 해당 사원 조회.
		EmployeeModifyGetDTO employeeModify = employeeService.getEmployeeModify(employeeNo);
		model.addAttribute("employeeModify", employeeModify);
		EmployeeModifyGetDTO employeeModifyFile = filesService.getEmployeeModifyFile(employeeNo);
		model.addAttribute("employeeModifyFile", employeeModifyFile);
		
		return "employeeOne";
	}
	
	// 진수우 : 주소록 리스트 페이지.
	@GetMapping("/employeeList")
	public String employeeList(Model model) {
		// 로그인 계정정보 조회.
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        model.addAttribute("userNo", userDetails.getUsername());
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userRole", userDetails.getUserRole());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	    }
		// 데이터베이스에서 부서 카테고리 조회.
		List<Common> commonDepartment = commonService.getDepartmentCategory();
		model.addAttribute("commonDepartment", commonDepartment);
		// 데이터베이스에서 직급 카테고리 조회.
		List<Common> commonPosition = commonService.getPositionCategory();
		model.addAttribute("commonPosition", commonPosition);
		return "employeeList";
	}
	
	// 진수우 : 사원 등록 로직.
	@PostMapping("/addEmployee")
	public String addEmployee(Model model, EmployeeAddDTO employAddDTO) {
		employeeService.addEmployee(employAddDTO); // 데이터베이스에 사원 추가.
		return "redirect:/employeeList";
	}
}
