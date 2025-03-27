package com.example.academy.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;
import lombok.Data;

@Data
public class ReservationListDTO {
	private Integer reservationNo;
	private Integer meetingroomNo; // meetingroom
	private String beginTimeCode;  // common
	private String endTimeCode; // common
	
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", shape = Shape.STRING) 
	private String reservationDate;
	
	private Integer reservationPerson; // 예약자
	private String reservationTitle;
	private String reservationContent;
	private String createDate;
	private String updateDate;
	
	// 예약참여자
	private List<ReservationEmployeeDTO> reservationEmployees;
	
	// 회의실 명
	private String meetingroomName;
	
	// 예약 참여자 삭제
	private String[] deleteEmployee;
	
	
	// 데이터를 배열로 반환
	public Object[] toArray() {
		return new Object[] {
			this.reservationNo
			, this.meetingroomNo
			, this.beginTimeCode
			, this.endTimeCode 
			, this.reservationDate
			, this.reservationPerson
			, this.reservationTitle
			, this.reservationContent
			, this.reservationEmployees
			, this.meetingroomName
		};
	}
	
}
