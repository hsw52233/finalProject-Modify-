package com.example.academy.vo;

import lombok.Data;

@Data
public class MeetingRoom {
	
	private Integer meetingroomNo;
	private String meetingroomName;
	private Integer meetingroomManager;
	private Integer meetingroomCapacity;
	private String createDate;
	private String updateDate;
	
}