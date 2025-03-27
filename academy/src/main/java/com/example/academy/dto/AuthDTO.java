package com.example.academy.dto;

import lombok.Data;

@Data
public class AuthDTO {
	// 사원정보
	private Integer employeeNo;
	private String employeePw;
    private String employeeName;
    private String employeeGender;
    private String employeeBirth;
    private String employeePhone;
    private String employeeDepartment;
    private String employeePosition;
    private Integer stampFileNo;
    private String employeeMail;
    private String employeeDate;
    private Integer addressNo;
    private Integer photoFileNo;
    private String employeeRole;
    
    // 파일정보 
	private String photoFileName;
	private String photoFileExt;  
}
