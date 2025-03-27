package com.example.academy.dto;

import lombok.Data;

@Data
public class CommentListDTO {
	private Integer commentNo; // 댓글번호
	private Integer employeeNo; // 사원번호
	private String employeeName; // 사원이름
	private String employeeDepartmentName; // 부서이름
	private String commentContent; // 댓글내용
	private String updateDate; // 수정일
	private String photoFileName; // 프로필사진 파일이름
	private String photoFileExt; // 프로필사진 파일확장자
}
