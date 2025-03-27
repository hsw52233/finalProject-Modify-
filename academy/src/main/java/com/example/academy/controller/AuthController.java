package com.example.academy.controller;

import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.academy.dto.PasswordModifyDTO;
import com.example.academy.dto.PasswordResetDTO;
import com.example.academy.service.AuthService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class AuthController {
	@Autowired AuthService authService;
	
	// 진수우 : 임시비밀번호 이메일전송.
	@PostMapping("/passwordSendMail")
	public String passwordSendMail(PasswordResetDTO passwordResetDTO) {
		Integer result = authService.passwordReset(passwordResetDTO);
		if (result == 1)  return "redirect:/passwordReset?msg=1"; // 이메일 전송 성공
		else return "redirect:/passwordReset?msg=2"; // 이메일 전송 실패
	}
	
	// 진수우 : 비밀번호찾기페이지 호출.
	@GetMapping("/passwordReset")
	public String passwordReset(Model model, @RequestParam(value = "msg", required = false) Integer msg) {
		model.addAttribute("msg", msg);
		return "passwordReset";
	}
	
	// 진수우 : 사원 비밀번호 변경.
	@PostMapping("/modifyPassword")
	public String modifyPw(PasswordModifyDTO passwordModifyDTO) {
		Integer resultPw = authService.modifyPw(passwordModifyDTO);
		return "redirect:/employeeOne?employeeNo=" + passwordModifyDTO.getEmployeeNo() + "&resultPw=" + resultPw;
	}
	
	// 진수우 : 로그인페이지 호출.
	@GetMapping("/login")
    public String loginP() {
        return "login";
    }  
}

// 인증 및 비밀번호 관련 기능을 처리하는 컨트롤러
