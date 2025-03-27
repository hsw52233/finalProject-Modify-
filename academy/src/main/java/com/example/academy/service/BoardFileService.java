package com.example.academy.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.BoardFileDTO;
import com.example.academy.mapper.BoardFileMapper;

@Service
@Transactional
public class BoardFileService {
	@Autowired private BoardFileMapper boardFileMapper;
	
	// boardNo에 해당하는 게시물 파일 리스트를 가져오기
	public List<BoardFileDTO> getBoardFileList(Integer boardNo) {
		return boardFileMapper.selectBoardFileList(boardNo);
	}
}
