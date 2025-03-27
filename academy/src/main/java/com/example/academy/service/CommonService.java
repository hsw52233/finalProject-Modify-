package com.example.academy.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.AddCommonDTO;
import com.example.academy.mapper.CommonMapper;
import com.example.academy.vo.Common;

@Service
@Transactional
public class CommonService {
	@Autowired CommonMapper commonMapper;
	
	// 조세영 : 게시판 카테고리 조회
	public AddCommonDTO getBoardCategoryOne(String code) {
		return commonMapper.selectBaordCategoryOne(code);
	}
	
	// 조세영 : 제일 최근 추가된 게시판 카테고리 조회
	public AddCommonDTO getBoardCategoryByOne() {
		return commonMapper.selectBoardCategoryByOne();
	}
	
	// 조세영 : 게시판 카테고리 삭제
	public Integer deleteBoardCategory(String code) {
		return commonMapper.deleteBoardCategory(code);
	}
	
	// 조세영 : 게시판 카테고리 추가
	public Integer addBoardCategory(String name) {
		
		// 게시판 카테고리 중 코드번호가 제일 높은 거 하나 조회
		String code = commonMapper.selectBoardCategoryByCode();  // "BF005" 반환
		String prefix = code.substring(0, 2);  // "BF" 부분 추출
		int number = Integer.parseInt(code.substring(2));  // 숫자 부분인 "005"를 정수로 변환
		number += 1;  // 1을 더함
		String newCode = prefix + String.format("%03d", number);  // "BF006"을 포맷팅하여 생성
		
		AddCommonDTO addCommonDTO = new AddCommonDTO();
		addCommonDTO.setCode(newCode);
		addCommonDTO.setName(name);
		
		return commonMapper.insertBoardCategory(addCommonDTO);
	}
	
	// 조세영 : 게시판 카테고리 중 공지사항 제외하고 조회
	public List<Common> getBoardCategoryByNotice() {
		return commonMapper.selectBoardCategoryByNotice();
	}
	
	// 조세영 : 게시판 카테고리 조회
	public List<Common> getBoardCategory() {
		return commonMapper.selectBoardCategory();
	}
	
	// 김혜린 : 시간 조회
	public List<Common> getTime() {
		return commonMapper.selectTime();
	}
	
	// 김혜린 : 요일 조회
	public List<Common> getWeekday() {
		return commonMapper.selectWeekday();
	}
	
	// 진수우 : 부서 카테고리 조회.
	public List<Common> getDepartmentCategory() {
		return commonMapper.selectDepartmentCategory();
	}
	
	// 진수우 : 직급 카테고리 조회.
	public List<Common> getPositionCategory() {
		return commonMapper.selectPositionCategory();
	}
}
