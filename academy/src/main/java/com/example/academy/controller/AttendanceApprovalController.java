package com.example.academy.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken; // 현재 로그인한 사용자의 인증 정보를 조회
import org.springframework.security.core.Authentication; // 로그인한 사용자의 인증 정보 객체
import org.springframework.security.core.context.SecurityContextHolder; // 현재 로그인한 사용자의 인증 정보를 조회
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.example.academy.dto.AttendanceApprovalAddDTO;
import com.example.academy.dto.AttendanceApprovalModifyDTO;
import com.example.academy.dto.AttendanceApprovalOneDTO;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.AnnualLeaveService;
import com.example.academy.service.ApprovalEmployeeService;
import com.example.academy.service.AttendanceApprovalFileService;
import com.example.academy.service.AttendanceApprovalService;
import com.example.academy.vo.Files;

import lombok.extern.slf4j.Slf4j;// 로그 기능을 제공. log.info(), log.debug(), log.error()등을 사용해 로그를 남길 수 있음.

@Slf4j  // 로깅을 사용할 수 있도록 해줌
@Controller
public class AttendanceApprovalController {
	@Autowired AttendanceApprovalService attendanceApprovalService;
	@Autowired ApprovalEmployeeService approvalEmployeeService;
	@Autowired AttendanceApprovalFileService attendanceApprovalFileService;
	@Autowired AnnualLeaveService annualLeaveService;
	
	// 김혜린 : 근태 신청서 재신청페이지 GET
	@GetMapping("/retryAttendanceApproval")
	public String retryAttendanceApproval(Model model, Integer attendanceApprovalNo) {
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
	        
	        // 년별 사용연차 개수 조회
	        Double useCount = annualLeaveService.getAnnualLeaveCount(Integer.parseInt(userDetails.getUsername()));
	        // 잔여연차
	        model.addAttribute("annualLeave", 15.0 - useCount);
	    }
	    
		// 원래 정보 불러오기
		// 1) 근태신청서 테이블 정보
		AttendanceApprovalOneDTO attendanceApproval = attendanceApprovalService.getAttendanceApprovalOne(attendanceApprovalNo);
		model.addAttribute("attendanceApproval", attendanceApproval);
		// 근태신청서 현재 결재단계
		model.addAttribute("step",attendanceApproval.getAttendanceApprovalStep());
		
		// 특정 attendanceApprovalNo에 해당하는 근태 신청서 정보를 가져와 모델에 추가
		
		log.debug("근태신청서 상세 : " + attendanceApproval);	//디버깅
		log.debug("==============attendanceApprovalNo2 : " + attendanceApprovalNo);	//디버깅
		// 2) 결재자 목록
		List<AttendanceApprovalOneDTO> approvers  = approvalEmployeeService.getAttendanceApproverList(attendanceApprovalNo);
		model.addAttribute("approvers", approvers);
		// 해당 신청서의 결재자 목록을 조회하여 모델에 추가
		log.debug("결재자 목록 : " + approvers);	//디버깅
		// 3) 파일 목록
		List<Files> files = attendanceApprovalFileService.getAttendanceApprovalFileList(attendanceApprovalNo);
		model.addAttribute("files", files);
		// 해당 신청서에 첨부된 파일 목록을 조회하여 모델에 추가
		
		log.debug("파일 목록 : " + files);	//디버깅
		
		return "retryAttendanceApproval";
	}
	
	// 김혜린 : 근태 신청서 재신청페이지 POST
	@PostMapping("/retryAttendanceApproval")
	public String retryAttendanceApproval(AttendanceApprovalAddDTO attendanceApprovalAddDTO) {
		log.debug("+~+~+~+~+attendanceApprovalAddDTO 목록 : " + attendanceApprovalAddDTO);	//디버깅
		attendanceApprovalService.retryAttendanceApproval(attendanceApprovalAddDTO); // 근태 신청서를 재신청하는 서비스 메서드 호출
		
		return "redirect:/applicationList";
	}
	
	// 김혜린 : 근태 신청서 승인 시 
	@PostMapping("/agreeAttendanceApproval")
	public String agreeAttendanceApproval(Model model, AttendanceApprovalOneDTO attendanceApprovalOneDTO) {
		
		log.debug("승인전 데이터 확인 : " + attendanceApprovalOneDTO);	//디버깅
		attendanceApprovalService.agreeAttendanceApproval(attendanceApprovalOneDTO);
		
		return "redirect:/completeAttendanceApprovalOne?attendanceApprovalNo=" + attendanceApprovalOneDTO.getAttendanceApprovalNo();
	}
	
	// 김혜린 : 근태 신청서 반려 시
	@PostMapping("/rejectAttendanceApproval")
	public String rejectAttendanceApproval(Model model, AttendanceApprovalOneDTO attendanceApprovalOneDTO) {
	    
		log.debug("반려전 데이터 확인 : " + attendanceApprovalOneDTO);	//디버깅
	    attendanceApprovalService.rejectAttendanceApproval(attendanceApprovalOneDTO);
	   
	    return "redirect:/completeAttendanceApprovalOne?attendanceApprovalNo=" + attendanceApprovalOneDTO.getAttendanceApprovalNo();
	}
	
	// 김혜린 : 근태 신청서 삭제
	@GetMapping("/removeAttendanceApproval")
	@ResponseBody // AJAX 요청에 적합한 응답 처리
	public String removeAttendanceApproval(Integer attendanceApprovalNo) {
		attendanceApprovalService.removeAttendanceApproval(attendanceApprovalNo);
		
		return "applicationList";
	}
	
	// 김혜린 : 근태 신청서 수정페이지 GET
	@GetMapping("/modifyAttendanceApproval")
	public String modifyAttendanceApproval(Model model, Integer attendanceApprovalNo) {
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
	        
	        // 년별 사용연차 개수 조회
	        Double useCount = annualLeaveService.getAnnualLeaveCount(Integer.parseInt(userDetails.getUsername()));
	        // 잔여연차
	        model.addAttribute("annualLeave", 15.0 - useCount);
	    }
		
		// 원래 정보 불러오기
		// 1) 근태신청서 테이블 정보
		AttendanceApprovalOneDTO attendanceApproval = attendanceApprovalService.getAttendanceApprovalOne(attendanceApprovalNo);
		model.addAttribute("attendanceApproval", attendanceApproval);
		// 근태신청서 현재 결재단계
		model.addAttribute("step",attendanceApproval.getAttendanceApprovalStep());
		
		log.debug("근태신청서 상세 : " + attendanceApproval);	//디버깅
		log.debug("==============attendanceApprovalNo2 : " + attendanceApprovalNo);	//디버깅
		// 2) 결재자 목록
		List<AttendanceApprovalOneDTO> approvers  = approvalEmployeeService.getAttendanceApproverList(attendanceApprovalNo);
		model.addAttribute("approvers", approvers);
		log.debug("결재자 목록 : " + approvers);	//디버깅
		// 3) 파일 목록
		List<Files> files = attendanceApprovalFileService.getAttendanceApprovalFileList(attendanceApprovalNo);
		model.addAttribute("files", files);
		log.debug("파일 목록 : " + files);	//디버깅
		
		
		return "modifyAttendanceApproval";
	}
	
	// 김혜린 : 근태 신청서 수정페이지 POST
	@PostMapping("/modifyAttendanceApproval")
	public String modifyAttendanceApproval(AttendanceApprovalModifyDTO attendanceApprovalModifyDTO) {
		log.debug("+~+~+~+~+attendanceApprovalModifyDTO 목록 : " + attendanceApprovalModifyDTO);	//디버깅
		attendanceApprovalService.modifyAttendanceApproval(attendanceApprovalModifyDTO);
		
		return "redirect:/attendanceApprovalOne?attendanceApprovalNo=" + attendanceApprovalModifyDTO.getAttendanceApprovalNo();
	}
	
	
	// 김혜린 : 근태 신청서 상세페이지 - 나의 신청 목록
	@GetMapping("/attendanceApprovalOne")
	public String attenddanceApprovalOne(Model model, Integer attendanceApprovalNo) {
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
		
		log.debug("==============attendanceApprovalNo1 : " + attendanceApprovalNo);	//디버깅
		// 1) 근태신청서 테이블 상세
		AttendanceApprovalOneDTO attendanceApproval = attendanceApprovalService.getAttendanceApprovalOne(attendanceApprovalNo);
		model.addAttribute("attendanceApproval", attendanceApproval);
		// 근태신청서 현재 결재단계
		model.addAttribute("step",attendanceApproval.getAttendanceApprovalStep());
		log.debug("근태신청서 상세 : " + attendanceApproval);	//디버깅
		log.debug("==============attendanceApprovalNo2 : " + attendanceApprovalNo);	//디버깅
		// 2) 결재자 목록
		List<AttendanceApprovalOneDTO> approvers  = approvalEmployeeService.getAttendanceApproverList(attendanceApprovalNo);
		model.addAttribute("approvers", approvers);
		log.debug("결재자 목록 : " + approvers);	//디버깅
		// 3) 파일 목록
		List<Files> files = attendanceApprovalFileService.getAttendanceApprovalFileList(attendanceApprovalNo);
		model.addAttribute("files", files);
		log.debug("파일 목록 : " + files);	//디버깅
		
		return "attendanceApprovalOne";
	}
	// 김혜린 : 결재대기 근태 신청서 상세페이지 - 결재 대기 목록
	@GetMapping("/waitAttendanceApprovalOne")
	public String waitAttendanceApprovalOne(Model model, Integer attendanceApprovalNo) {
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
		
		log.debug("==============attendanceApprovalNo1 : " + attendanceApprovalNo);	//디버깅
		// 1) 근태신청서 테이블 상세
		AttendanceApprovalOneDTO attendanceApproval = attendanceApprovalService.getAttendanceApprovalOne(attendanceApprovalNo);
		model.addAttribute("attendanceApproval", attendanceApproval);
		// 근태신청서 현재 결재단계
		model.addAttribute("step",attendanceApproval.getAttendanceApprovalStep());
		log.debug("근태신청서 상세 : " + attendanceApproval);	//디버깅
		log.debug("==============attendanceApprovalNo2 : " + attendanceApprovalNo);	//디버깅
		// 2) 결재자 목록
		List<AttendanceApprovalOneDTO> approvers  = approvalEmployeeService.getAttendanceApproverList(attendanceApprovalNo);
		model.addAttribute("approvers", approvers);
		log.debug("결재자 목록 : " + approvers);	//디버깅
		// 3) 파일 목록
		List<Files> files = attendanceApprovalFileService.getAttendanceApprovalFileList(attendanceApprovalNo);
		model.addAttribute("files", files);
		log.debug("파일 목록 : " + files);	//디버깅
		
		return "waitAttendanceApprovalOne";
	}
	
	// 김혜린 : 결재완료 근태 신청서 상세페이지 - 결재 완료 목록
	@GetMapping("/completeAttendanceApprovalOne")
	public String completeAttendanceApprovalOne(Model model, Integer attendanceApprovalNo) {
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
		
		log.debug("==============attendanceApprovalNo1 : " + attendanceApprovalNo);	//디버깅
		// 1) 근태신청서 테이블 상세
		AttendanceApprovalOneDTO attendanceApproval = attendanceApprovalService.getAttendanceApprovalOne(attendanceApprovalNo);
		model.addAttribute("attendanceApproval", attendanceApproval);
		// 근태신청서 현재 결재단계
		model.addAttribute("step",attendanceApproval.getAttendanceApprovalStep());
		log.debug("근태신청서 상세 : " + attendanceApproval);	//디버깅
		log.debug("==============attendanceApprovalNo2 : " + attendanceApprovalNo);	//디버깅
		// 2) 결재자 목록
		List<AttendanceApprovalOneDTO> approvers  = approvalEmployeeService.getAttendanceApproverList(attendanceApprovalNo);
		model.addAttribute("approvers", approvers);
		log.debug("결재자 목록 : " + approvers);	//디버깅
		// 3) 파일 목록
		List<Files> files = attendanceApprovalFileService.getAttendanceApprovalFileList(attendanceApprovalNo);
		model.addAttribute("files", files);
		log.debug("파일 목록 : " + files);	//디버깅
		
		return "completeAttendanceApprovalOne";
	}
	
	// 김혜린 : 근태 신청
	@GetMapping("/addAttendanceApproval")
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
	        
	        // 년별 사용연차 개수 조회
	        Double useCount = annualLeaveService.getAnnualLeaveCount(Integer.parseInt(userDetails.getUsername()));
	        // 잔여연차
	        model.addAttribute("annualLeave", 15.0 - useCount);
	    }
	    
		return "addAttendanceApproval";		
	}
	
	// 김혜린 : 근태신청
	@PostMapping("/addAttendanceApproval")
	public String addAttendanceApproval(AttendanceApprovalAddDTO attendanceApprovalAddDTO) {
		log.debug("============attendanceApprovalAddDTO========" + attendanceApprovalAddDTO);
		attendanceApprovalService.addAttendanceApproval(attendanceApprovalAddDTO);
		
		
		return "redirect:/applicationList";
	}
	

}


/*
 *  근태 신청서에 대한 상세 정보 조회 및 수정 기능을 담당
 * 컨트롤러의 전체적인 흐름
	1.사용자가 근태 신청서 상세 페이지로 이동하면
	→ GET /attendanceApprovalOne 요청을 통해 신청서 정보 + 결재자 목록 + 첨부 파일 목록을 조회하여 화면에 출력
	2.사용자가 근태 신청서를 수정하려고 하면
	→ GET /modifyAttendanceApproval 요청을 통해 기존 데이터가 포함된 수정 화면을 제공
	3.사용자가 수정 내용을 입력하고 제출하면
	→ POST /modifyAttendanceApproval 요청을 처리하여 DB 업데이트 후 상세 페이지로 이동
 * 
 * 
 */
 

