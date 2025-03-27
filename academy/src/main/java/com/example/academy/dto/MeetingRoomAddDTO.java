package com.example.academy.dto;


import lombok.Data;

@Data
public class MeetingRoomAddDTO {
	
	private Integer meetingroomNo;
	private String meetingroomName; 
    private String meetingroomManager; 
    private String employeeName; 
    private Integer meetingroomCapacity; 
	private String createDate;
	private String updateDate;

}
