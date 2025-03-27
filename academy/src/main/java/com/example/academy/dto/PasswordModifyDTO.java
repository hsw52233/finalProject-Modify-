package com.example.academy.dto;

import lombok.Data;

@Data
public class PasswordModifyDTO {
	private Integer employeeNo;
	private String employeeNowPw;
	private String employeeChangePw;
	private String employeeChangePwCheck;
}
