package com.example.academy.dto;

import lombok.Data;

@Data
public class EmployeeListDTO {
	private Integer employeeNo;
    private String employeePw;
    private String employeeName;
    private String employeeGender;
    private String employeeBirth;
    private Integer addressNo;
    private String employeePhone;
    private String employeeDepartment;
    private String employeePosition;
    private Integer photoFileNo;
    private Integer stampFileNo;
    private String employeeMail;
    private String employeeDate;
    private String createDate;
    private String updateDate;
    private Integer fileNo;
	private String fileName;
	private String fileExt;
	private String fileOrigin;
	private String fileSize;
	private String fileCategory;
	
	// 데이터를 배열로 반환하는 메서드
    public Object[] toArray() {
        return new Object[]{
            this.employeeName,
            this.employeeNo,
            this.employeePhone,
            this.employeeDepartment,
            this.employeePosition,
            this.fileName + "." + this.fileExt
        };
    }
}
