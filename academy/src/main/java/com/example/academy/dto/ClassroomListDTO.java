package com.example.academy.dto;

import lombok.Data;

@Data
public class ClassroomListDTO {
	private Integer classroomNo;
	private String classroomName;
	private Integer classroomManager;
	private Integer classroomCapacity;
	private String createDate;
	private String updateDate;
	
	// 담당자
	private Integer employeeNo;
	private String employeeName;
	private String photoFileName;
	private String photoFileExt;
	
	// 데이터를 배열로 반환
	public Object[] toArray() {
		return new Object[] {
			this.classroomNo
			, this.classroomName
			, this.classroomManager
			, this.classroomCapacity 
			, this.employeeNo
			, this.employeeName
			, this.photoFileName
			, this.photoFileExt
		};
	}
}
