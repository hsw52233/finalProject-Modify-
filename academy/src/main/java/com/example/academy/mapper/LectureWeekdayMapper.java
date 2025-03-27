package com.example.academy.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.LectureOneTimeListDTO;

@Mapper
public interface LectureWeekdayMapper {

	// 김혜린 : 강의 수정(강의 요일,시간)
	Integer updateLectureWeekday(LectureOneTimeListDTO timeList);
}
