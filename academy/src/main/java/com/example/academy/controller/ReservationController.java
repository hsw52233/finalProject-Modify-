package com.example.academy.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.academy.dto.AddReservationDTO;
import com.example.academy.dto.MeetingRoomListDTO;
import com.example.academy.dto.ReservationEmployeeDTO;
import com.example.academy.dto.ReservationListDTO;
import com.example.academy.mapper.ReservationMapper;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.CalendarService;
import com.example.academy.service.CommonService;
import com.example.academy.service.MeetingRoomService;
import com.example.academy.service.ReservationService;
import com.example.academy.vo.Common;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class ReservationController {
	@Autowired ReservationService reservationService;
	@Autowired CalendarService calendarService;
	@Autowired CommonService commonService;
	@Autowired MeetingRoomService meetingroomService;
	@Autowired ReservationMapper reservationMapper;
	
	// 박시현 : 예약 취소
	@GetMapping("/removeReservation")
	public String removeReservation(@RequestParam Integer reservationNo) {
	    Integer row = reservationService.removeReservation(reservationNo);
	    if (row > 0) {
	        return "redirect:/reservationList"; // 성공 시 reservationList로 리다이렉트
	    }
	    return "redirect:/modifyReservation"; // 실패 시 modifyReservation으로 리다이렉트
	}
	
	// 박시현 : 예약 수정
	@PostMapping("/modifyReservation")
	public String modifyReservation(@ModelAttribute ReservationListDTO reservationListDTO, ReservationEmployeeDTO reservationEmployeeDTO) {
		int row = reservationService.modifyReservation(reservationListDTO, reservationEmployeeDTO);
        if (row == 0) {
        	// 실패 시 
        	log.debug("실패 : "+row);
            return "redirect:/modifyReservation";
        } 
        log.debug("성공 : "+row);
        return "redirect:/reservationList";
	}
		
	// 박시현 : 수정하기 전 input에 정보 출력
	@GetMapping("/modifyReservation")
	public String modifyReservation(Model model, @RequestParam("reservationNo") Integer reservationNo, @ModelAttribute AddReservationDTO addReservationDTO) {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 예약자가 본인일 경우에만 열리도록
		if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        int loggedInUserId = Integer.parseInt(userDetails.getUsername());
	        
	        model.addAttribute("userNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userRole", userDetails.getUserRole());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	        
	        ReservationListDTO reservation = reservationService.getReservationOne(reservationNo);
	        // 예약자가 로그인한 사용자와 일치하는지 확인
	        if (reservation.getReservationPerson() != loggedInUserId) {
	        	log.debug("접근실패");
	        	return "redirect:/reservationList";
	        }
	        log.debug("reservationList : " + reservation);
	        model.addAttribute("reservation",reservation);
	        
	        // 시간 조회 
	        List<Common> time = commonService.getTime();	        
	        model.addAttribute("time",time);	        
	        // 회의실 조회
	        
	        List<MeetingRoomListDTO> meetingroom = meetingroomService.getMeetingRoomList(); 
	        model.addAttribute("meetingroom",meetingroom);
	        
		}
		
		return "modifyReservation";
	}
	
	// 박시현 : 예약 신청
	@PostMapping("/addReservation")
	public String addReservation(@ModelAttribute AddReservationDTO addReservationDTO) {
		// 예약 신청
		int row = reservationService.insertReservation(addReservationDTO);
		// 예약 참여자 테이블에 데이터 추가
		if(row == 0) {
			return "addReservation";
		}
		return "redirect:/reservationList";
	}
	
	// 박시현 : 예약 신청
	@GetMapping("/addReservation")
	public String addReservation(Model model) {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 시간 조회
		List<Common> time = commonService.getTime(); 
		model.addAttribute("time",time);
		
		// 회의실 조회
		List<MeetingRoomListDTO> meetingroom = meetingroomService.getMeetingRoomList(); 
		model.addAttribute("meetingroom",meetingroom);
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    
	        model.addAttribute("reservationPerson", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userRole", userDetails.getUserRole());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	    }
	    return "addReservation"; 
	}
	
	// 박시현 : 예약 리스트
	@GetMapping("/reservationList")
	public String reservationList(Model model) {
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
		return "reservationList";
	}
}
