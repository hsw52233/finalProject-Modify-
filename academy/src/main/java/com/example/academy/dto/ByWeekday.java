package com.example.academy.dto;

import lombok.Data;

@Data
public class ByWeekday {
	private String day; // 요일
	private String startTime; // 시작시간
	private String endTime; // 종료시간
}
