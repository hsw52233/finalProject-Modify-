package com.example.academy.restcontroller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.example.academy.dto.BoardListDTO;
import com.example.academy.service.BoardService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@Slf4j
public class BoardRestController {
	@Autowired BoardService boardService;
	
	// 공지사항 리스트 조회
	@GetMapping("/restapi/boardList/{categoryCode}")
	public List<Object[]> boardList(@PathVariable("categoryCode") String categoryCode) {
		
		List<BoardListDTO> boardsList = boardService.getBoardList(categoryCode);
		List<Object[]> result = new ArrayList<>();
		for(BoardListDTO boardList : boardsList) {
			result.add(boardList.toArray());
		}
		return result;
	}
}
