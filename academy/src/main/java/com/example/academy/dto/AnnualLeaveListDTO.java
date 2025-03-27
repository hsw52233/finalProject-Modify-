package com.example.academy.dto;

import lombok.Data;

@Data
public class AnnualLeaveListDTO {

	private Integer approvalNo;
    private String beginDate;
    private String endDate;
    private String createDate;
    private String updateDate;
    private String name;
    
    private String month;
    private Integer employeeNo;

    // 데이터를 배열로 반환하는 매서드
    public Object[] toArray() {
    	return new Object[] {
    			this.approvalNo
    			, this.beginDate
    			, this.endDate
    			, this.updateDate
    			, this.createDate
    			, this.name
    	};
    }
}
