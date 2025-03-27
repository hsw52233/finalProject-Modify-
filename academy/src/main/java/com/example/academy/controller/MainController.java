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
import org.springframework.web.bind.annotation.PostMapping;

import com.example.academy.dto.AttendanceContentDTO;
import com.example.academy.dto.AttendanceDTO;
import com.example.academy.dto.BoardListByMainDTO;
import com.example.academy.dto.NewNoticeListDTO;
import com.example.academy.dto.WaitApprovalListDTO;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.AnnualLeaveService;
import com.example.academy.service.AttendanceService;
import com.example.academy.service.AuthService;
import com.example.academy.service.BoardService;
import com.example.academy.service.MemoService;
import com.example.academy.service.NoticeService;
import com.example.academy.service.WaitApprovalService;
import com.example.academy.vo.Memo;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class MainController {
	@Autowired AuthService authService;
	@Autowired AnnualLeaveService annualLeaveService;
	@Autowired AttendanceService attendanceService;
	@Autowired BoardService boardService;
	@Autowired MemoService memoService;
	@Autowired WaitApprovalService waitApprovalService;
	@Autowired NoticeService noticeService;
	
	// 진수우 : 전체알림페이지 호출.
	@GetMapping("/allNotice")
	public String allNotice(Model model) {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        model.addAttribute("userNo", userDetails.getUsername());
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	        model.addAttribute("writer", Integer.parseInt(userDetails.getUsername()));
	        List<NewNoticeListDTO> newNoticeListDTO = noticeService.getAllNotice(Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("noticeList", newNoticeListDTO);
	    }
		return "allNotice";
	}
	
	// 진수우 : 메인페이지 호출.
	@GetMapping("/main")
	public String main(Model model) {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        
	        // 이번년도 연차 개수 조회
	        Double annualLeaveCount = annualLeaveService.getAnnualLeaveCount(Integer.parseInt(userDetails.getUsername()));
	        
	        // 당일 월 지각, 조퇴, 결근 횟수 조회
	        AttendanceContentDTO content = attendanceService.getAttendanceContent(Integer.parseInt(userDetails.getUsername()));
 
	        // 최근 6개월 월별 근무시간 총합 조회
	        List<Integer> totalWorkTime = attendanceService.getAttendanceTotalWorkTime(Integer.parseInt(userDetails.getUsername()));
	        
	        // 최근 공지사항 5개 조회
	        List<BoardListByMainDTO> boardList = boardService.getBoardListByMain();
	        
	        // 메모 조회.
	        String memoContent = memoService.getMemo(Integer.parseInt(userDetails.getUsername()));
	        
	        // 현재 날짜 ex) 2025-11-11
	        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
	        
	        AttendanceDTO attendanceDTO = new AttendanceDTO();
	        attendanceDTO.setCurrentDate(currentDate);
	        attendanceDTO.setEmployeeNo(Integer.parseInt(userDetails.getUsername()));
	        
	        // 오늘 출퇴근 활성화 확인
	        Integer checkinNo = attendanceService.getSelectCheckin(attendanceDTO);
	        Integer checkoutNo = attendanceService.getSelectCheckout(attendanceDTO);
	        log.debug("checkinNo--------->" + checkinNo);
	        log.debug("checkoutNo--------->" + checkoutNo);
	        
	        
	     // 오늘 출퇴근 시간 조회
	        AttendanceDTO checkTime = attendanceService.getCheckTime(attendanceDTO);
	        String checkin = "";
	        String checkout = "";

	        if (checkTime != null) { // null 체크 추가
	            checkin = checkTime.getAttendanceCheckIn() != null ? checkTime.getAttendanceCheckIn() : "";
	            checkout = checkTime.getAttendanceCheckOut() != null ? checkTime.getAttendanceCheckOut() : "";
	        }
	        
	        // 문자열을 LocalDateTime으로 파싱
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	        // 원하는 포맷으로 시간만 추출
	        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
	        
	     // 출퇴근 시간이 공백이 아닐 때만 변환
	        if (!checkin.isEmpty()) {
	            LocalDateTime dateinTime = LocalDateTime.parse(checkin, formatter);
	            checkin = dateinTime.format(timeFormatter);
	            log.debug("checkin----------->" + checkin); // 출근 시간
	        }

	        if (!checkout.isEmpty()) {
	            LocalDateTime dateoutTime = LocalDateTime.parse(checkout, formatter);
	            checkout = dateoutTime.format(timeFormatter);
	            log.debug("checkout----------->" + checkout); // 퇴근 시간
	        }
	        
	        // 출퇴근시간이 공백이 아닐 시
	        if(!checkin.equals("")) {
		        LocalDateTime dateinTime = LocalDateTime.parse(checkin, formatter);
		        checkin = dateinTime.format(timeFormatter);
		        log.debug("checkin----------->" + checkin); // 퇴근시간
	        }
	        if(!checkout.equals("")) {
	        	LocalDateTime dateoutTime = LocalDateTime.parse(checkout, formatter);
	        	checkout = dateoutTime.format(timeFormatter);
	        	log.debug("checkout----------->" + checkout); // 퇴근시간
	        	
	        }
	        
	        // 미결재 리스트
	        List<WaitApprovalListDTO> waitApprovalList = waitApprovalService.getWaitApprovalList(Integer.parseInt(userDetails.getUsername())); 
	        log.debug("waitApprovalList------------>" + waitApprovalList);	        
	        
	        model.addAttribute("checkin", checkin); // 출근시간
	        model.addAttribute("checkout", checkout); // 퇴근시간
	        model.addAttribute("checkinNo", checkinNo); // 오늘 출근 활성화
	        model.addAttribute("checkoutNo", checkoutNo); // 오늘 퇴근 활성화
	        model.addAttribute("boardList", boardList); // 최근 공지사항 5개 조회
	        model.addAttribute("count", annualLeaveCount); // 이번 달 연차 사용 갯수
	        model.addAttribute("totalWorkTimeList", totalWorkTime); // 최근 6개월 월별 근무시간 총합 리스트
	        model.addAttribute("absence", content.getAbsence()); // 결근
	        model.addAttribute("earlyLeave", content.getEarlyLeave()); // 조퇴
	        model.addAttribute("late", content.getLate()); // 지각
	        model.addAttribute("waitApprovalList", waitApprovalList); // 미결재 리스트
	        model.addAttribute("userNo", userDetails.getUsername());
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	        model.addAttribute("memoContent", memoContent);
	        model.addAttribute("writer", Integer.parseInt(userDetails.getUsername()));
	    }
		return "main";
	}
	
	// 진수우 : 메모 저장.
	@PostMapping("/saveMemo")
	public String saveMemo(Memo memo) {
		// 메모저장 수행.
		memoService.saveMemo(memo);
		return "redirect:/main";
	}
	
	@GetMapping("/removeMemo")
	public String removeMemo(Integer employeeNo) {
		// 메모삭제 수행.
		memoService.removeMemo(employeeNo);
		return "redirect:/main";
	}
	
}
