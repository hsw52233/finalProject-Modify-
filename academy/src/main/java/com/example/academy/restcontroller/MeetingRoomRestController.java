package com.example.academy.restcontroller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.academy.dto.MeetingRoomAddDTO;
import com.example.academy.dto.MeetingRoomListDTO;
import com.example.academy.service.MeetingRoomService;

@RestController
public class MeetingRoomRestController {
	
	
@Autowired MeetingRoomService meetingroomservice;
	
	// 하상우 : 회의실목록 출력
	@GetMapping("/restapi/MeetingRoomList")
    public List<Object[]> classroomList() {
        List<MeetingRoomListDTO> meetingroom = meetingroomservice.getMeetingRoomList();
        List<Object[]> result = new ArrayList<>();
        for (MeetingRoomListDTO meetingRoomList : meetingroom) {
            result.add(meetingRoomList.toArray()); 
        }
        return result;
    }
    
    
    // 하상우) 회의실 수정 ( meetingroomNo 가져오기)
    @GetMapping("/modifyMeetingRoom")
    public ResponseEntity<MeetingRoomAddDTO> getMeetingRoom(@RequestParam Integer meetingroomNo) {
        MeetingRoomAddDTO meetingRoom = meetingroomservice.getMeetingRoomNo(meetingroomNo);
        if (meetingRoom != null) {
            return ResponseEntity.ok(meetingRoom);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 하상우 ) 회의실 수정
    @PostMapping("/modifyMeetingRoom")
    public ResponseEntity<String> modifyMeetingRoom(@ModelAttribute MeetingRoomAddDTO modifyMeetingRoom) {
        int row = meetingroomservice.modifyMeetingRoom(modifyMeetingRoom);
        if (row > 0) {
            return ResponseEntity.ok("Success");
        } else {
            return ResponseEntity.badRequest().body("Failed to modify meeting room");
        }
    }

}
