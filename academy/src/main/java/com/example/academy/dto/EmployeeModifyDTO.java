package com.example.academy.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class EmployeeModifyDTO {
	// 사원정보
	private Integer employeeNo;
    private String employeeName;
    private String employeeGender;
    private String employeeBirth;
    private String employeePhone;
    private String employeeMail;
    private String employeeDate;
    private Integer addressNo;
    private Integer photoFileNo;
    private Integer stampFileNo;
    
    
    // 주소정보
	private String addressName;
	private String addressDetail;
	private Integer postCode;
    
    // 파일
	private MultipartFile employeePhoto;
	private MultipartFile stampPhoto;
}
