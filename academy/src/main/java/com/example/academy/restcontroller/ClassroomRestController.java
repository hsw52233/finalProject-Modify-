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

import com.example.academy.dto.ClassroomAddDTO;
import com.example.academy.dto.ClassroomListDTO;
import com.example.academy.service.ClassroomService;

@RestController
public class ClassroomRestController {
	@Autowired ClassroomService classroomService;
	
	// 박시현 : 강의실 수정
    @GetMapping("/restapi/modifyClassroom")
    public ResponseEntity<ClassroomListDTO> modifyClassroom(@RequestParam("classroomNo") Integer classroomNo) {
	   ClassroomListDTO classroom = classroomService.getClassroomOne(classroomNo);
        if (classroom != null) {
            return ResponseEntity.ok(classroom);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/restapi/modifyClassroom")
    public ResponseEntity<String> modifyClassroom(@ModelAttribute ClassroomAddDTO classroomAddDTO) {
    	//@ModelAttribute - 각각의 객체를 받아오지않아도 ClassroomListDTO의 여러개의 객체를 받아옴
        int row = classroomService.modifyClassroom(classroomAddDTO);
        if (row > 0) {
            return ResponseEntity.ok("Success");
        } else {
            return ResponseEntity.badRequest().body("Failed to modify classroom");
        }
    }
	
	// 박시현 : 강의실목록 출력
	@GetMapping("/restapi/classroomList")
    public List<Object[]> classroomList() {
        List<ClassroomListDTO> classroom = classroomService.getClassroomList();
        List<Object[]> result = new ArrayList<>();
        for (ClassroomListDTO classroomList : classroom) {
            result.add(classroomList.toArray()); 
        }
        return result;
    }
}
