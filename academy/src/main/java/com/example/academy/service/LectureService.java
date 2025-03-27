package com.example.academy.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.LectureListDTO;
import com.example.academy.dto.LectureModifyDTO;
import com.example.academy.dto.LectureOneDTO;
import com.example.academy.dto.LectureOneTimeListDTO;
import com.example.academy.mapper.LectureMapper;
import com.example.academy.mapper.LectureWeekdayMapper;
import com.example.academy.vo.LectureWeekday;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
public class LectureService {
	@Autowired LectureMapper lectureMapper;
	@Autowired LectureWeekdayMapper lectureWeekdayMapper;
	
	// 김혜린 : 강의 삭제(사용여부 비활성화)
	public void removeLecture(Integer lectureNo) {
		// 강의 삭제 (사용여부 비활성화)
		lectureMapper.updateUseLecture(lectureNo);
	}	
	
	// 김혜린, 진수우 : 강의 수정
	public void modifyLecture(LectureModifyDTO lectureModifyDTO, List<String> list) {
		
		int index=0;
		List<LectureOneTimeListDTO> timeList = new ArrayList<>();
		
		if (list != null) {
			// 수정폼에서 입력한 강의시간정보 가져온 후, LectureOneTimeListDTO에 set.
			for(int i=0; i<list.size()/3; i++) {
				LectureOneTimeListDTO time = new LectureOneTimeListDTO();	//객체
				time.setWeekdayCode(list.get(index));
				index++;
				time.setBeginTimeCode(list.get(index));
				index++;
				time.setEndTimeCode(list.get(index));
				index++;
				timeList.add(time);
			}
			log.debug("timeList" +timeList);
			
			// 강의번호로 현재 저장되어 있는 강의시간번호를 데이터베이스에서 조회.
			List<Integer> alreadyWeekdayList = lectureMapper.selectLectureLectureWeekdayNo(lectureModifyDTO.getLectureNo());
			
			// 데이터베이스에서 조회한 강의시간번호로 현재 저장되어 있는 강의시간 데이터를 조회한 후, 배열로 저장.
			List<LectureWeekday> alreadyLectureWeekday = new ArrayList<>();
			for (Integer alreadyWeekday : alreadyWeekdayList) {
				alreadyLectureWeekday.add(lectureMapper.selectLectureWeekday(alreadyWeekday));
			}
			
			// 수정폼에서 입력한 강의시간정보와 데이터베이스에 있는 강의시간정보가 일치하는지 확인.
			for (LectureWeekday lectureWeekday : alreadyLectureWeekday) { // 데이터베이스 시간정보.
				int existCount = 0;
				for (LectureOneTimeListDTO lectureOneTimeListDTO : timeList) { // 수정폼 시간정보.
					int equalCount = 0;
					if (lectureWeekday.getWeekdayCode().equals(lectureOneTimeListDTO.getWeekdayCode())) equalCount++;
					if (lectureWeekday.getBeginTimeCode().equals(lectureOneTimeListDTO.getBeginTimeCode())) equalCount++;
					if (lectureWeekday.getEndTimeCode().equals(lectureOneTimeListDTO.getEndTimeCode())) equalCount++;
					if (equalCount == 3) {
						timeList.remove(existCount);
						break; // 요일, 시작시간, 종료시간이 완전히 같다면 아무작업도 수행하지 않음.
					}
					else existCount++;
					if (existCount == timeList.size()) {
						// 요일, 시작시간, 종료시간이 완전히 같은 시간정보가 수정폼에서 없다면 강의/강의시간 연결테이블에서 해당 정보 삭제.
						lectureMapper.deleteLectureWeekday(lectureWeekday.getLectureWeekdayNo());
					}
				}
			}
			
			for (LectureOneTimeListDTO lectureOneTimeListDTO : timeList) {
				// 수정폼에서 새로 입력된 강의시간정보 삽입.
				lectureMapper.insertLectureWeekday(lectureOneTimeListDTO);
				Integer lectureWeekdayNo = lectureOneTimeListDTO.getLectureWeekdayNo();
				// 강의/강의시간 연결테이블에 해당 정보 삽입.
				Map<String, Integer> resultMap = new HashMap<>();
				resultMap.put("lectureWeekdayNo", lectureWeekdayNo);
				resultMap.put("lectureNo", lectureModifyDTO.getLectureNo());
				lectureMapper.insertLectureLectureWeekday(resultMap);
			}
		}
		
		
		String[] parts = lectureModifyDTO.getLecturer().split("\\[|\\]"); // '[' 또는 ']'로 분리
		lectureModifyDTO.setLecturer(parts[1]);
		// 강의날짜(개강/종강일), 강의명, 강의내용 수정
		lectureMapper.updateLecture(lectureModifyDTO);
	}
	
	// 김혜린 : 강의 상세페이지 / 강의수정 기존정보불러오기
	public LectureOneDTO getLectureOne(Integer lectureNo) {
		LectureOneDTO lectureOne = lectureMapper.selectLectureOne(lectureNo);
		
		return lectureOne;		
	}
	
	// 김혜린 : 강의 상세페이지 - 강의 시간 리스트 출력
	public List<LectureOneTimeListDTO> getLectureOneTimeList(Integer lectureNo) {
		List<LectureOneTimeListDTO> lectureOneTimeList = lectureMapper.selectLectureOneTimeList(lectureNo);
		
		return lectureOneTimeList;
	}
	
	// 김혜린 : 강의 리스트 출력
	public List<LectureListDTO> getLectureList() {
		List<LectureListDTO> lectureList = lectureMapper.selectLectureList();
		
		return lectureList;
	}


}
