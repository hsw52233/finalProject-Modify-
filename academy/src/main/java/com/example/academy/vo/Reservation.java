package com.example.academy.vo;

import lombok.Data;

@Data
public class Reservation {
	
	private Integer reservationNo;
	private Integer meetingroomNo;
	private String beginTimeCode;
	private String endTimeCode;
	private String reservationDate;
	private Integer reservationPerson;
	private String reservationTitle;
	private String reservationContent;
	private String createDate;
	private String updateDate;
	
}