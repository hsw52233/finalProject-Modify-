package com.example.academy.dto;

import lombok.Data;

@Data
public class LectureListDTO {
	private Integer lectureNo;	// 강의번호
	private Integer lecturer;	// 강사번호
	private String employeeName; // 강사이름
	
	private String lectureName;		// 강의명
	private String lectureContent;	// 강의상세설명
	
	private String lectureBeginDate;	// 개강일
	private String lectureEndDate;		// 종강일
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
		return new Object[] {
				this.lectureNo,
				this.fileName + "." + this.fileExt,
				this.employeeName,
				this.lectureName,
				this.lectureBeginDate,
				this.lectureEndDate
		};
	}
	

}
