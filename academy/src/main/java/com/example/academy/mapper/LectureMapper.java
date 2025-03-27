package com.example.academy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.LectureApprovalOneDTO;
import com.example.academy.dto.LectureListDTO;
import com.example.academy.dto.LectureModifyDTO;
import com.example.academy.dto.LectureOneDTO;
import com.example.academy.dto.LectureOneTimeListDTO;
import com.example.academy.vo.LectureWeekday;

@Mapper
public interface LectureMapper {
	// 진수우 : 강의수정 시 강의/강의시간 연결테이블에서 기존 강의시간번호 조회
	List<Integer> selectLectureLectureWeekdayNo(Integer lectureNo);
	
	// 진수우 : 진수우 : 강의수정 시 강의시간 테이블에서 강의시간정보 조회
	LectureWeekday selectLectureWeekday(Integer lectureWeekdayNo);
	
	// 진수우 : 강의수정 시 삭제된 강의시간을 강의/강의시간 연결테이블에서 삭제
	Integer deleteLectureWeekday(Integer lectureWeekdayNo);
	
	// 진수우 : 강의수정 시 새로 입력된 강의시간을 강의시간 테이블에 삽입
	Integer insertLectureWeekday(LectureOneTimeListDTO lectureOneTimeListDTO);
	
	// 진수우 : 강의결재 승인 시 강의/강의시간 추가
	Integer insertLectureLectureWeekday(Map<String, Integer> resultMap);
	
	// 진수우 : 강의결재 승인 시 강의 추가
	Integer insertLecture(LectureApprovalOneDTO lectureApprovalOneDTO);
	
	// 김혜린 : 강의 삭제(사용여부 비활성화)
	Integer updateUseLecture(Integer lectureNo);
	
	// 김혜린 : 강의 수정(강의날짜(개강/종강일), 강의명, 강의내용)
	Integer updateLecture(LectureModifyDTO lectureModifyDTO);
	
	// 김혜린 : 강의 상세페이지 / 강의수정 기존정보불러오기 
	LectureOneDTO selectLectureOne(Integer lectureNo);
	
	// 김혜린 : 강의 상세페이지 / 강의수정 기존정보불러오기 - 강의 시간 리스트 출력
	List<LectureOneTimeListDTO> selectLectureOneTimeList(Integer lectureNo);
	
	// 김혜린 : 강의리스트 출력
	List<LectureListDTO> selectLectureList();

}
