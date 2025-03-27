package com.example.academy.dto;

import lombok.Data;

@Data
public class CalendarReservationListDTO {
	private String reservationTitle;
	private String beginTimeName;
	private String endTimeName;
	private String reservationDate;
	private String reservationContent;
}
