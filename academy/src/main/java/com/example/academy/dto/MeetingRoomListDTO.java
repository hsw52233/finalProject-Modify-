package com.example.academy.dto;

import lombok.Data;

@Data
public class MeetingRoomListDTO {
	
	private Integer meetingroomNo;
	private String meetingroomName;
	private Integer meetingroomManager;
	private String employeeName;
	private Integer meetingroomCapacity;
	private String createDate;
	private String updateDate;
	private String photoFileName;
	private String photoFileExt;
	
	// 데이터를 배열로 변환
	public Object[] toArray() {
		return new Object[] {
				this.meetingroomNo,
				this.meetingroomName,
				this.employeeName,
				this.meetingroomManager,
				this.meetingroomCapacity,
				this.createDate,
				this.updateDate,
				this.photoFileName,
				this.photoFileExt
		};
	}

}
