package com.example.academy.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

import com.example.academy.dto.TreeNode;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.TreeNodeService;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class TreeNodeRestController {
	@Autowired TreeNodeService treeNodeService;
	
	// 진수우 : 결재선추가에있는 ToastUI Tree API에 사원리스트를 제공.(로그인계정 비노출)
	@GetMapping("/restapi/employeeListNode")
	public List<TreeNode> employeeListNode() {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    return treeNodeService.getEmployeeTreeNode(Integer.parseInt(userDetails.getUsername()), null);
	}
	
	// 진수우 : 결재선추가에있는 ToastUI Tree API에 사원리스트를 제공.(로그인계정 노출)
	@GetMapping("/restapi/employeeListNodeShowMe")
	public List<TreeNode> employeeListNodeShowMe() {
	    return treeNodeService.getEmployeeTreeNode(null, null);
	}
	
	// 진수우 : 결재선추가에있는 ToastUI Tree API에 사원리스트를 제공.(운영팀만 노출)
	@GetMapping("/restapi/employeeListNodeManagement")
	public List<TreeNode> employeeListNodeManagement() {
	    return treeNodeService.getEmployeeTreeNode(null, "management");
	}
}
