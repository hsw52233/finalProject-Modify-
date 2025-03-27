package com.example.academy.dto;

import lombok.Data;

@Data
public class EmployeeModifyGetDTO {
	// 사원정보
	private Integer employeeNo;
    private String employeeName;
    private String employeeGender;
    private String employeeBirth;
    private String employeePhone;
    private String employeeMail;
    private String employeeDate;
    private String employeeDepartment;
    private String employeePosition;
    private Integer addressNo;
    private Integer photoFileNo;
    private Integer stampFileNo;
    
    // 주소정보
	private String addressName;
	private String addressDetail;
	private Integer postCode;
    
    // 파일정보
	private String photoFileOrigin;
	private String photoFileExt;
	private String stampFileOrigin;
	private String stampFileExt;
	private String photoFileName;
	private String stampFileName;
}
