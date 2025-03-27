package com.example.academy.dto;

import lombok.Data;

@Data
public class BoardListDTO {
	
	private Integer boardNo;
	private String boardTitle;
	private String fileName;
	private String fileExt;
	private String employeeName;
	private String employeeDepartmentName;
	private Integer boardCount;
	private Integer boardFileCount;
	private String updateDate;
	private String createDate;
	private String categoryCode;
	private String name;
	private Integer pinned;
	
	// 데이터를 배열로 반환하는 메서드
	public Object[] toArray() {
		return new Object[] {
				this.boardNo,
				this.fileName + "." + this.fileExt,
				this.employeeName,
				this.boardTitle,
				this.boardCount,
				this.updateDate,
				this.createDate,
				this.employeeDepartmentName,
				this.boardFileCount,
				this.pinned
		};
	}
}
