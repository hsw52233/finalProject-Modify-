package com.example.academy.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.ClassroomAddDTO;
import com.example.academy.dto.ClassroomListDTO;

@Mapper
public interface ClassroomMapper {
	// 박시현 : 강의실 삭제
	Integer deleteClassroom(Integer classroomNo);
	
	// 박시현 : 강의실번호 별 상세정보
	ClassroomListDTO classroomOne(Integer classroomNo);
	
	// 박시현 : 강의실 수정
	Integer updateClassroom(ClassroomAddDTO classroomAddDTO);
	
	// 박시현 : 강의실 등록 
	Integer insertClassroom(ClassroomAddDTO classroomAddDTO);
	
	// 박시현 : 강의실리스트 출력
	List<ClassroomListDTO> selectClassroomList();
}
