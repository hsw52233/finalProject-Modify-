package com.example.academy.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class AddReservationDTO {
	private Integer reservationNo;
	private Integer meetingroomNo; // meetingroom
	private String beginTimeCode;  // common
	private String endTimeCode; // common
	private String reservationDate;
	private Integer reservationPerson; // 예약자
	private String reservationTitle;
	private String reservationContent;
	private String createDate;
	private String updateDate;
	
	// 예약참여자
	private List<ReservationEmployeeDTO> reservationEmployees = new ArrayList<>(); // 리스트 초기화 
	
	// 회의실 명
	private String meetingroomName;
}
