package com.example.academy.restcontroller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.academy.dto.LectureListDTO;
import com.example.academy.service.LectureService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class LectureRestController {
	@Autowired LectureService lectureService;
	
	@GetMapping("/restapi/lectureList")
	public List<Object[]> lectureList() {
		List<LectureListDTO> lectureList = lectureService.getLectureList();
		List<Object[]> result = new ArrayList<>();
		
		for(LectureListDTO list : lectureList) {
			result.add(list.toArray());	// lecture 객체를 배열로 변환
		}
		
		log.debug("rest 테스트");
		return result;		
	}
	

}
