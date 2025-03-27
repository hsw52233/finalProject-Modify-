package com.example.academy.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.WaitApprovalListDTO;

@Mapper
public interface WaitApprovalMapper {
	// 박시현 : 메인페이지 - 미결재 리스트
	List<WaitApprovalListDTO> selectWaitApprovalList(Integer employeeNo);
}
