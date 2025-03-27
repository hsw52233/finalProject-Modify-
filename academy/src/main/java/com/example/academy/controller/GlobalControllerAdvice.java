package com.example.academy.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.ChattingService;
import com.example.academy.service.CommonService;
import com.example.academy.vo.Common;

// 모든 컨트롤러 모델 값에 넣기
@ControllerAdvice
public class GlobalControllerAdvice {
	
	@Autowired ChattingService chattingService;
	
    @Autowired CommonService commonService;
    
    @Value("${custom.location}")
    private String location;

    @Value("${custom.port}")
    private int port;

    @ModelAttribute("location")
    public String location() {
        return location;
    }

    @ModelAttribute("port")
    public int port() {
        return port;
    }
    
 // 사이드메뉴에 게시판 리스트에 사용하기 위해
    @ModelAttribute("chatCount")
    public Integer getTotalCount() {
    	
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    Integer userId = 0;
	    
	    
    	if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        userId = Integer.parseInt(userDetails.getUsername()); // Logged-in user's ID  
	    }
    	
    	
        return chattingService.totalUnreadMessages(userId);
    }

    // 사이드메뉴에 게시판 리스트에 사용하기 위해
    @ModelAttribute("boardCategory")
    public List<Common> boardCategoryList() {
        return commonService.getBoardCategory();
    }
    
    // 사이드메뉴에 게시판 관리 버튼이 행정팀에게만 보이기 위해
    @ModelAttribute("userRole")
    public String userRole() {
    	// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        
	        return userDetails.getUserRole();
	    }
	    return "GUEST";
    }
}
