package com.example.academy.restcontroller;

import org.springframework.web.bind.annotation.RestController;

import com.example.academy.dto.EmployeeListDTO;
import com.example.academy.service.EmployeeService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class EmployeeRestController {
	@Autowired EmployeeService employeeService;
	
	// 진수우 : 사원목록 출력.
	@GetMapping("/restapi/employeeList")
	public List<Object[]> employeeList() {
		List<EmployeeListDTO> employeesList = employeeService.getEmployeeList();
		List<Object[]> result = new ArrayList<>();
		for (EmployeeListDTO employeeList : employeesList) {
            result.add(employeeList.toArray()); // Employee 객체를 배열로 변환
        }
		return result;
	}
	
}
