package com.example.academy.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.EmployeeListDTO;
import com.example.academy.dto.TreeNode;
import com.example.academy.mapper.CommonMapper;
import com.example.academy.mapper.EmployeeMapper;
import com.example.academy.vo.Common;

@Service
@Transactional
public class TreeNodeService {
	@Autowired CommonMapper commonMapper;
	@Autowired EmployeeMapper employeeMapper;
	
	public List<TreeNode> getEmployeeTreeNode(Integer loginEmployee, String department) {
		// 데이터베이스에서 부서목록 가져오기.
		List<Common> departmentList = new ArrayList<>();
		if (department == null) departmentList = commonMapper.selectDepartmentCategory();
		else if (department.equals("management")) {
			Common common = new Common();
			common.setCode("DP002");
			common.setName("운영팀");
			departmentList.add(common);
		}
		
		// 데이터베이스에서 직원목록 가져오기.
		List<EmployeeListDTO> employeeListOrigin = employeeMapper.selectEmployeeList();
		
		// 직원목록에서 로그인한 계정의 요소는 삭제.
		List<EmployeeListDTO> employeeList = new ArrayList<>();
		if(loginEmployee != null) {
			for (EmployeeListDTO employee : employeeListOrigin) {
				if (employee.getEmployeeNo() == loginEmployee) continue;
				else employeeList.add(employee);
			}
		} else {
			employeeList = employeeListOrigin;
		}
		
		// 부서이름을 차례대로 꺼내서 각각의 노드객체에 넣고, 해당 객체들을 리스트로 만들기.
		List<TreeNode> departmentNodeList = new ArrayList<>();
		for (Common common : departmentList) {
			TreeNode departmentTreeNode = new TreeNode();
			departmentTreeNode.setText(common.getName());
			// 해당 부서의 사원을 차례대로 꺼내서 각각의 노드객체에 넣고, 객체들을 리스트로 만든 후 부서노드의 자식필드에 넣기.
			List<TreeNode> employeeNodeList = new ArrayList<>();
			for (EmployeeListDTO employee : employeeList) {
				TreeNode EmployeeTreeNode = new TreeNode();
				if (common.getCode().equals(employee.getEmployeeDepartment())) {
					EmployeeTreeNode.setText(employee.getEmployeeName() + "[" + employee.getEmployeeNo() + "]");
					employeeNodeList.add(EmployeeTreeNode);
				}
			}
			departmentTreeNode.setChildren(employeeNodeList);
			departmentNodeList.add(departmentTreeNode);
		}
		// 최종 노드 리스트 결과 반환.
		return departmentNodeList;
	}
}
