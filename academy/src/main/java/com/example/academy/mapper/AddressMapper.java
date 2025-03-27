package com.example.academy.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.EmployeeModifyDTO;
import com.example.academy.vo.Address;

@Mapper
public interface AddressMapper {
	
	// 진수우 : 주소 수정.
	Integer updateAddress(EmployeeModifyDTO employeeModifyDTO);
	
	// 진수우 : 주소 저장.
	Integer insertAddress(Address address);
}
