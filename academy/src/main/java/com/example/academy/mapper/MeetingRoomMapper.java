package com.example.academy.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.example.academy.dto.MeetingRoomAddDTO;
import com.example.academy.dto.MeetingRoomListDTO;


@Mapper
public interface MeetingRoomMapper {
	
	
	// 하상우) 회의실 수정
	MeetingRoomAddDTO getMeetingRoomNo(Integer meetingroomNo); 
	
	// 하상우) 회의실 수정
	Integer modifyMeetingRoom(MeetingRoomAddDTO modifymeetingroom);
	// 하상우) 회의실 삭제
	Integer deleteMeetingRoom(Integer meetingroomNo);
	
	// 하상우) 회의실 추가
	Integer addMeetingRoom(MeetingRoomAddDTO meetingroomaddDTO);
	// 하상우) 회의실 조회
	List<MeetingRoomListDTO> getMeetingRoomList();

}
