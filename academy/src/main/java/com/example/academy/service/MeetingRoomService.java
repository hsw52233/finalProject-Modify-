package com.example.academy.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.MeetingRoomAddDTO;
import com.example.academy.dto.MeetingRoomListDTO;
import com.example.academy.mapper.MeetingRoomMapper;


@Service
@Transactional
public class MeetingRoomService {
	
	@Autowired
	public MeetingRoomMapper meetingRoomMapper;
	
	// 하상우) 회의실 수정
	public Integer modifyMeetingRoom(MeetingRoomAddDTO modifymeetingroom) {
		String[] inputManager = modifymeetingroom.getMeetingroomManager().split("\\[|\\]");
		modifymeetingroom.setMeetingroomManager(inputManager[1]); // 사원번호만 추출해서 담당자정보 재정의.
	    return meetingRoomMapper.modifyMeetingRoom(modifymeetingroom);
	}

	// 하상우) 회의실 번호 조회
	public MeetingRoomAddDTO getMeetingRoomNo(Integer meetingroomNo) {
		return meetingRoomMapper.getMeetingRoomNo(meetingroomNo);
	}
	
	
	// 하상우 ) 회의실 삭제
	public Integer deleteMeetingRoom(Integer meetingroomNo) {
		return meetingRoomMapper.deleteMeetingRoom(meetingroomNo);
	}
	
	
	// 하상우) 회의실 추가
	public Integer addMeetingRoom(MeetingRoomAddDTO meetingroomaddDTO) {
		String[] inputManager = meetingroomaddDTO.getMeetingroomManager().split("\\[|\\]");
		meetingroomaddDTO.setMeetingroomManager(inputManager[1]); // 사원번호만 추출해서 담당자정보 재정의.
		return meetingRoomMapper.addMeetingRoom(meetingroomaddDTO);
	}
	
	
	// 하상우) 회의실 리스트
	public List<MeetingRoomListDTO> getMeetingRoomList(){
		return meetingRoomMapper.getMeetingRoomList();
	}

}
