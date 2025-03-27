package com.example.academy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.example.academy.dto.MeetingRoomAddDTO;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.MeetingRoomService;

@Controller
public class MeetingRoomController {
	
	@Autowired
	public MeetingRoomService meetingroomservice;
	
	// 회의실 삭제
	@GetMapping("/deleteMeetingRoom")
	public String deleteMeetingRoom(@RequestParam Integer meetingroomNo) {
		
	    int row = meetingroomservice.deleteMeetingRoom(meetingroomNo);
	    if (row == 0) {
	        return "meetingRoom"; // 삭제 실패 시 현재 페이지 유지
	    }
	    return "redirect:/meetingRoomList"; // 삭제 성공 시 회의실 목록 페이지로 리다이렉트
	}
	
	// 하상우) 회의실 추가
	 @PostMapping("/addMeetingRoom")
	    public String addMeetingRoom(MeetingRoomAddDTO meetingroomaddDTO, Model model) {
	        int row = meetingroomservice.addMeetingRoom(meetingroomaddDTO);
	        if (row == 0) {
	            return "meetingRoom";
	        }
	        return "redirect:/meetingRoomList";
	    }
	
	// 하상우 ) 회의실 목록 조회
	@GetMapping("/meetingRoomList")
	public String meetingRoomList(Model model) {
		
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
        return "meetingRoom";
	}

}
