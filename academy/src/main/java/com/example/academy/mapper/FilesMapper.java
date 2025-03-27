package com.example.academy.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.EmployeeModifyGetDTO;
import com.example.academy.vo.Files;

@Mapper
public interface FilesMapper {
	// 진수우 : 강의결재 재신청 시 파일테이블에서 복사할 파일 정보조회
	Files selectCopyFile(String fileName);
	
	// 김혜린 : 근태신청서 수정 시 파일테이블에서 해당정보 삭제
	Integer deleteFile(String fileName);
	
	// 김혜린 : 근태신청서 수정 시 파일테이블에서 삭제할 파일번호 조회
	Integer selectDeleteFileNo(String fileName);
	
	// 진수우 : 프로필사진파일 삭제.
	Integer deletePhotoFile(Integer employeeNo);
	
	// 진수우 : 도장사진파일 삭제.
	Integer deleteStampFile(Integer employeeNo);
	
	// 진수우 : 사원파일(프로필사진, 도장사진) 삭제.
	Integer deleteFile(Integer fileNo);
	
	// 진수우 : 사원파일(프로필사진, 도장사진) 수정.
	Integer updateFile(Files photofile);
	
	// 진수우 : 개인정보수정 기존파일명출력.
	EmployeeModifyGetDTO selectEmployeeModifyFile(Integer employeeNo);
	
	// 진수우 : 파일 저장.
	Integer insertFile(Files files);
}
