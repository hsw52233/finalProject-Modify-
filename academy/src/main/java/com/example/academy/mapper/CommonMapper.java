package com.example.academy.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.AddCommonDTO;
import com.example.academy.vo.Common;

@Mapper
public interface CommonMapper {
	
	// 조세영 : 게시판 카테고리 조회
	AddCommonDTO selectBaordCategoryOne(String code);
	
	// 조세영 : 제일 최근 추가된 게시판 카테고리 조회
	AddCommonDTO selectBoardCategoryByOne();
	
	// 조세영 : 게시판 카테고리 삭제
	Integer deleteBoardCategory(String code);
	
	// 조세영 : 게시판 카테고리 추가
	Integer insertBoardCategory(AddCommonDTO addCommonDTO);
	
	// 조세영 : 게시판 카테고리 중 코드번호가 제일 높은 거 하나 조회
	String selectBoardCategoryByCode();
		
	// 조세영 : 게시판 카테고리 중 공지사항 제외하고 조회
	List<Common> selectBoardCategoryByNotice();
	
	// 조세영 : 게시판 카테고리 조회
	List<Common> selectBoardCategory();
	
	// 김혜린 : 시간 조회
	List<Common> selectTime();
	
	// 김혜린 : 요일 조회
	List<Common> selectWeekday();
	
	// 진수우 : 부서 카테고리 조회.
	List<Common> selectDepartmentCategory();
	
	// 진수우 : 직급 카테고리 조회.
	List<Common> selectPositionCategory();
	
	// 진수우 : 파일 카테고리 조회.
	List<Common> selectFileCategory();
	
}
