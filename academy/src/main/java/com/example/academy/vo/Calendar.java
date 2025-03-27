package com.example.academy.vo;

import java.util.List;

import com.example.academy.dto.Rrule;

import lombok.Data;

@Data
public class Calendar {
	private Integer calendarNo;
	private Integer employeeNo;
	private Integer reservationNo;
	private Integer lectureNo;
    private String calendarTitle;
    private String calendarStart;
    private String calendarEnd;
    private String calendarDate;
    private String calendarBeginDate;
    private String calendarEndDate;
    private String calendarClassName;
    private String calendarDescription;
    private Rrule rrule;
    private String createDate;
    private String updateDate;
    
    // 주마다 반복되는 일정.
    private List<Integer> weekday;
    
}