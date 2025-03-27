package com.example.academy.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.vo.Memo;

@Mapper
public interface MemoMapper {
	
	// 진수우 : 메모삭제.
	Integer deleteMemo(Integer employeeNo);
	
	// 진수우 : 사원메모 추가.
	Integer insertMemo(Memo memo);
	
	// 진수우 : 사원메모 수정.
	Integer updateMemo(Memo memo);
	
	// 진수우 : 사원메모 조회.
	String selectMemo(Integer writer);
}