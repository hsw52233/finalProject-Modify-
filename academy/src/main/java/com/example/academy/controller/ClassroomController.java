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

import com.example.academy.dto.ClassroomAddDTO;
import com.example.academy.dto.ClassroomListDTO;
import com.example.academy.dto.EmployeeListDTO;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.ClassroomService;
import com.example.academy.service.EmployeeService;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class ClassroomController {
	@Autowired ClassroomService classroomService;
	@Autowired EmployeeService employeeService;
	
	// 박시현 : 강의실 삭제
	@GetMapping("/removeClassroom")
	public String removeClassroom(@RequestParam Integer classroomNo) {
		int row = classroomService.removeClassroom(classroomNo);
		if(row == 0) { // 삭제 실패시
			return "classroomList";
		}
		return "redirect:/classroomList";
	}
	
	// 박시현 : 강의실 등록
	@PostMapping("/addClassroom")
	public String addClassroom(Model model, ClassroomAddDTO classroomAddDTO) {
		classroomService.addClassroom(classroomAddDTO);
		return "redirect:/classroomList";
	}
	
	// 박시현 : 강의실 목록 조회
	@GetMapping("/classroomList")
	public String classroomList(Model model, EmployeeListDTO EmployeeListDTO, Integer classroomNo) {
		
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
		
		// 강의실 리스트 조회 - addClassroom 모달창에서 담당자를 조회하기 위해
		List<EmployeeListDTO> classroom = employeeService.getEmployeeList();
		model.addAttribute("classroom",classroom);
		List<ClassroomListDTO> classrooms = classroomService.getClassroomList();
		model.addAttribute("classrooms",classrooms);
		
		return "classroomList";
	}


}
