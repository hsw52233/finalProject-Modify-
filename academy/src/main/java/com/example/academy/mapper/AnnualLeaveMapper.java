package com.example.academy.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.AnnualLeaveListDTO;

@Mapper
public interface AnnualLeaveMapper {

	// 최근 6개월 월당 연차 개수 조회
	List<Double> annualLeaveCountByMonth(Integer employeeNo);
	
	// 년별 연차 개수 조회
	Double annualLeaveCount(Integer employeeNo);
	
	// 월별 연차리스트 조회
	List<AnnualLeaveListDTO> selectAnnualLeave(AnnualLeaveListDTO annualLeaveListDTO);
	
}
