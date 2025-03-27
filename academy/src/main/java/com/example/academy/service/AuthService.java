package com.example.academy.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.academy.dto.PasswordModifyDTO;
import com.example.academy.dto.PasswordResetDTO;
import com.example.academy.mapper.AuthMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class AuthService {
	@Autowired private BCryptPasswordEncoder bCryptPasswordEncoder;
	@Autowired AuthMapper authMapper;
	@Autowired JavaMailSender javaMailSender;
	
	// mail.yml파일에 등록된 메일주소정보 가져오기.
	@Value("${spring.mail.username}")
    private String adminMail;
	
	// 진수우 : 사원 비밀번호찾기.
	public Integer passwordReset(PasswordResetDTO passwordResetDTO) {
		// 입력한 사원번호, 이메일이 있는지 확인.
		if (authMapper.selectPasswordReset(passwordResetDTO) == 1) {
			// 랜덤문자 6자리로 해당 사원의 비밀번호 변경.
			String newPw = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
			
			// 변경된 비밀번호 이메일로 전송.
			SimpleMailMessage mailMsg = new SimpleMailMessage();
			mailMsg.setFrom(adminMail);
			mailMsg.setTo(passwordResetDTO.getEmail());
			mailMsg.setSubject("[Academy Groupware] 발급된 임시비밀번호 안내드립니다.");
			mailMsg.setText(passwordResetDTO.getEmployeeNo() + "번 사원의 변경된 임시비밀번호는 "+ newPw+ " 입니다. 임시비밀번호로 로그인한 후 비밀번호를 변경해주세요.");
			javaMailSender.send(mailMsg);
			
			// 비밀번호 암호화.
			String encodeNewPw = bCryptPasswordEncoder.encode(newPw);
			// 데이터베이스에 새로운 비밀번호로 변경.
			authMapper.updatePasswordReset(passwordResetDTO.getEmployeeNo(), encodeNewPw);
			return 1;
		} else {
			return 0; // 실패.
		}
	}
	
	// 진수우 : 사원 비밀번호변경
	public Integer modifyPw(PasswordModifyDTO passwordModifyDTO) {
		// 입력받은 기존 비밀번호 암호화.
		// passwordModifyDTO.setEmployeeNowPw(bCryptPasswordEncoder.encode(passwordModifyDTO.getEmployeeNowPw()));
		// 데이터베이스에서 기존 비밀번호가 일치하는지 확인.
		String nowPassword = authMapper.selectEmployeeNowPw(passwordModifyDTO);
		boolean result = bCryptPasswordEncoder.matches(passwordModifyDTO.getEmployeeNowPw(), nowPassword);
		// 입력한 비밀번호와 데이터베이스에 있는 비밀번호가 일치하다면,
		if (result == true) {
			// 새 비밀번호와 새 비밀번호 확인에 입력한 값이 일치하다면,
			if(passwordModifyDTO.getEmployeeChangePw().equals(passwordModifyDTO.getEmployeeChangePwCheck())) {
				// 입력받은 새 비밀번호 암호화.
				passwordModifyDTO.setEmployeeChangePw(bCryptPasswordEncoder.encode(passwordModifyDTO.getEmployeeChangePw()));
				// 데이터베이스에서 사원 비밀번호 수정.
				authMapper.updateEmployeePw(passwordModifyDTO);
				return 1; // 비밀번호 수정 성공.
			}
			else return 2; // 새 비밀번호와 새 비밀번호 확인에 입력한 값이 일치하지 않음.
		}
		else return 3; // 기존 비밀번호가 일치하지 않음.
	}
}
