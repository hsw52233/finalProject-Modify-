package com.example.academy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.EmployeeModifyGetDTO;
import com.example.academy.mapper.FilesMapper;

@Service
@Transactional
public class FilesService {
	@Autowired FilesMapper filesMapper;
	
	// 진수우 : 개인정보수정 기존파일명출력.
	public EmployeeModifyGetDTO getEmployeeModifyFile(Integer employeeNo) {
		return filesMapper.selectEmployeeModifyFile(employeeNo);
	}
	
}
