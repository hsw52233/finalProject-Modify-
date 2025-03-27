package com.example.academy.restcontroller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.academy.dto.AttendanceListDTO;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.AttendanceService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class AttendanceRestController {
	@Autowired AttendanceService attendanceService;
	
	@GetMapping("/restapi/attendanceList")
	public List<Object[]> attendanceList(AttendanceListDTO attendanceListDTO) {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        
	        attendanceListDTO.setEmployeeNo(Integer.parseInt(userDetails.getUsername()));
	    }
		List<AttendanceListDTO> attendancesList = attendanceService.getAttendanceList(attendanceListDTO);
		List<Object[]> result = new ArrayList<>();
		for(AttendanceListDTO attendanceList : attendancesList) {
			result.add(attendanceList.toArray());
		}
		return result;
	}
}
