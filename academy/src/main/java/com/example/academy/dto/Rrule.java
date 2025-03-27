package com.example.academy.dto;

import java.util.List;

import lombok.Data;

@Data
public class Rrule {
	private String freq;
	private String interval;
	private List<ByWeekday> byweekday; // 반복요일
	private String dtstart; // 시작날짜
	private String until; // 종료날짜
}
