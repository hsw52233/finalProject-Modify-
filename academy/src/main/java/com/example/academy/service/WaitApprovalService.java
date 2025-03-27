package com.example.academy.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.WaitApprovalListDTO;
import com.example.academy.mapper.WaitApprovalMapper;

@Service
@Transactional
public class WaitApprovalService {
	@Autowired WaitApprovalMapper waitApprovalMapper;
	
	// 박시현 : 메인페이지 - 미결재 리스트
	public List<WaitApprovalListDTO> getWaitApprovalList(Integer employeeNo) {
		List<WaitApprovalListDTO> waitApprovalList = waitApprovalMapper.selectWaitApprovalList(employeeNo);
		for(WaitApprovalListDTO waitApproval : waitApprovalList) {
			waitApproval.setCreateDate(waitApproval.getCreateDate().substring(0, 10));
		}
		return waitApprovalList;	
	}
}
