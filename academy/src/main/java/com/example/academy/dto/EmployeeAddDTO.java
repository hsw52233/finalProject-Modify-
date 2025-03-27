package com.example.academy.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class EmployeeAddDTO {
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
    
    // 주소정보
	private String addressName;
	private String addressDetail;
	private Integer postCode;
    
    // 프로필사진 파일
    private MultipartFile employeePhoto;
}
