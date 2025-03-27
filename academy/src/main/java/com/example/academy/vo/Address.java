package com.example.academy.vo;

import lombok.Data;

@Data
public class Address {
	
	private Integer addressNo;
	private String addressName;
	private String addressDetail;
	private Integer postCode;
	private String createDate;
    private String updateDate;
    
}
