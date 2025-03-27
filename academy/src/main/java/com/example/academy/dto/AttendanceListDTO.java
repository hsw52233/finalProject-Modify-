package com.example.academy.dto;

import lombok.Data;

@Data
public class AttendanceListDTO {

	private String date;
	private String name;
	private String checkin;
	private String checkout;
	private String workTime;
	private String overTime;

	private Integer employeeNo;
	private String month;
	
	// 데이터를 배열로 반환하는 매서드
    public Object[] toArray() {
    	return new Object[] {
    			this.date
    			, this.name
    			, this.checkin
    			, this.checkout
    			, this.workTime
    			, this.overTime	
    	};
    }
}
