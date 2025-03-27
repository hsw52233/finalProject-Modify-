package com.example.academy.dto;

import java.util.List;

import lombok.Data;

// 진수우 : ToastUI Tree API를 사용하기위한 Node 객체.
@Data
public class TreeNode {
	private String text;
	private String state;
	private List<TreeNode> children;
}
