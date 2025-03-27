package com.example.academy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.mapper.MemoMapper;
import com.example.academy.vo.Memo;

@Service
@Transactional
public class MemoService {
	@Autowired MemoMapper memoMapper;
	
	// 진수우 : 사원메모 추가.
	public void saveMemo(Memo memo) {
		if (memo.getMemoContent().length() != 0) {
			String exist = memoMapper.selectMemo(memo.getWriter());
			// 만약 저장된 메모가 있다면 수정.
			if (exist != null) memoMapper.updateMemo(memo);
			// 만약 저장된 메모가 없다면 새로 삽입.
			if (exist == null) memoMapper.insertMemo(memo);
		}
	}
	
	// 진수우 : 사원메모 조회.
	public String getMemo(Integer writer) {
		return memoMapper.selectMemo(writer);
	}
	
	// 진수우 : 사원메모 삭제.
	public Integer removeMemo(Integer writer) {
		return memoMapper.deleteMemo(writer);
	}
}