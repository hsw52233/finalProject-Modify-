package com.example.academy.restcontroller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.example.academy.dto.AddCommonDTO;
import com.example.academy.service.CommonService;
import com.example.academy.vo.Common;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@RestController
public class CommonRestController {
	@Autowired CommonService commonService;
	
	// 조세영 : 게시판 카테고리 삭제
	@PostMapping("/restapi/removeBoardCategory")
	public void removeBoardCategory(@RequestBody String code) {
	    
		log.debug("code------------->" + code);
		
		// 게시판 삭제
		commonService.deleteBoardCategory(code);
	}
	
	// 조세영 : 게시판 카테고리 등록
	@PostMapping("/restapi/addBoardCategory")
	public AddCommonDTO addBoardCategory(@RequestBody String name) {
		
		// String name = request.get("name");
		
		log.debug("name-------------->" + name);
		
		// 카테고리 추가
		commonService.addBoardCategory(name);
		
		// 추가된 카테고리 rest로 변환
		return commonService.getBoardCategoryByOne();
	}
	
	// 진수우 : 시간목록 출력.
	@GetMapping("/restapi/getTime")
	public List<Common> getTime() {
		return commonService.getTime();
	}
	
	// 진수우 : 요일목록 출력.
	@GetMapping("/restapi/getWeekday")
	public List<Common> getWeekday() {
		return commonService.getWeekday();
	}
	
	// 진수우 : 시간목록 출력.
	@GetMapping("/restapi/getDepartment")
	public List<Common> getDepartment() {
		return commonService.getDepartmentCategory();
	}
	
}
