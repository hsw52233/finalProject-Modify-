package com.example.academy.dto;

import lombok.Data;

@Data
public class MeetingroomEmployeeDTO {
	// reservation_employee
	private Integer reservationNo;
	private Integer employeeNo;
	
	// meetingroom
	private Integer meetingroomNo;
	private Integer meetingroomCapacity;
	
	private String employeeName;
	
	private ReservationEmployeeDTO reservationEMployeeDTO;
	private MeetingRoomListDTO meetingroomListDTO;
}
