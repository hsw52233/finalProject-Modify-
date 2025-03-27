package com.example.academy.vo;

import lombok.Data;

@Data
public class LectureApproval {
	
	private Integer lectureApprovalNo;		// PK
    private Integer lecturer;          		// FK
    private String lectureApprovalTitle;            
    private String lectureApprovalContent;            
    private String lectureName;   
    private String lectureContent;
    private Integer classroomNo;     		// FK
    private String lectureBeginDate;         
    private String lectureEndDate;        
    private String lectureApprovalStatus;  	// FK        
    private Integer lectureApprovalStep;           
    private String createDate;        
    private String updateDate;   
    private String useYn;

}