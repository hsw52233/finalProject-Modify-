package com.example.academy.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.academy.vo.LectureWeekday;

import lombok.Data;

@Data
public class LectureApprovalModifyDTO {
	private Integer lectureApprovalNo; // 강의결재번호 - set
	private String lecturer; // 강사번호
    private String lectureBeginDate; // 개강일
    private String lectureEndDate; // 종강일
    private String classroomNo; // 강의실번호
    private String lectureName; // 강의명
    private String lectureContent; // 강의내용

    // 강의시간 정보
    private List<Integer> lectureWeekdayNo;
    private List<LectureWeekday> lectureWeekday;

    // 강의결재 정보
    private String lectureApprovalTitle; // 결재제목
    private String lectureApprovalContent; // 결재내용
    private Integer lectureApprovalStep; // 결재횟수 - set
    
    private List<String> approval;

    // 결재 파일
    private List<MultipartFile> lectureApprovalFile; // 새로 추가한 파일
    private List<String> alreadyFiles; // 기존에 파일 영역
    
    public Integer getLecturer() {
    	return Integer.parseInt(lecturer);
    }
}
