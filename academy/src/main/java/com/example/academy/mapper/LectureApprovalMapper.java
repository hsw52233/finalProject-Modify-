package com.example.academy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.ApprovalAddDTO;
import com.example.academy.dto.LectureApprovalAddDTO;
import com.example.academy.dto.LectureApprovalEmployeeListDTO;
import com.example.academy.dto.LectureApprovalGetBeginTimeDTO;
import com.example.academy.dto.LectureApprovalListDTO;
import com.example.academy.dto.LectureApprovalModifyDTO;
import com.example.academy.dto.LectureApprovalOneDTO;
import com.example.academy.dto.LectureApprovalWeekdayListDTO;
import com.example.academy.vo.Common;
import com.example.academy.vo.Files;
import com.example.academy.vo.LectureWeekday;

@Mapper
public interface LectureApprovalMapper {
	
	// 김혜린 : 결재 완료 목록 - 강의신청서 리스트 조회
	List<LectureApprovalListDTO> selectCompleteLectureApprovalList(Integer employeeNo);
		
	// 김혜린 : 결재 대기 목록 - 강의신청서 리스트 조회
	List<LectureApprovalListDTO> selectWaitLectureApprovalList(Integer employeeNo);
	
	// 김혜린 : 나의 신청 목록 - 강의신청서 리스트 조회
	List<LectureApprovalListDTO> selectLectureApprovalList(Integer employeeNo);
	
	// 진수우 : 강의결재 승인처리 시 결재 테이블에서 해당 결재의 결재상태를 변경
	Integer updateLectureApprovalStatusAccept(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 승인처리 시 결재자 테이블에서 결재상태가 승인인 항목 개수 조회
	Integer countApprovalEmployeeStatusAccept(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 승인처리 시 결재자 테이블에서 최고 결재단계를 조회
	Integer selectApprovalEmployeeMaxLevel(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 승인처리 시 강의결재 테이블에서 해당 결재의 결재단계를 증가
	Integer updateLectureApprovalStepAccept(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 승인처리 시 결재자 테이블에서 해당 결재자의 결재상태를 변경
	Integer updateApprovalEmployeeStatusAccept(Integer lectureApprovalNo, Integer approver);
	
	// 진수우 : 강의결재 반려처리 시 결재자 테이블에서 해당 결재자의 결재상태변경
	Integer updateApprovalEmployeeStatusReturn(Integer lectureApprovalNo, Integer approver);
	
	// 진수우 : 강의결재 반려처리 시 강의결재 테이블에서 결재상태 변경
	Integer updateLectureApprovalStatusReturn(Integer lectureApprovalNo, String rejectReason);
	
	// 진수우 : 강의결재 삭제 시 강의결재 테이블에서 사용상태변경
	Integer updateLectureApprovalUse(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 수정 시 파일테이블에서 삭제할 파일번호 조회
	Integer selectDeleteFileNo(String fileName);
	
	// 진수우 : 강의결재 수정 시 강의결재/파일 연결테이블에서 해당정보 삭제
	Integer deleteContactLectureApprovalFile(Integer fileNo, Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 수정 시 결재자테이블에 있는 데이터 수 카운트
	Integer countApprovalEmployee(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 수정 시 파일테이블에서 해당정보 삭제
	Integer deleteLectureApprovalFile(String fileName);
	
	// 진수우 : 강의결재 수정 시 결재자테이블에서 결재자 삭제 (없어지거나 결재순서가 바뀐 사원만 삭제)
	Integer deleteApprovalEmployee(Integer lectureApprovalNo, Integer approvalLevel);
	
	// 진수우 : 강의결재 수정 시 결재자테이블에서 수정이 안된 결재자가 있는지 확인
	Integer selectNotChangeEmployee(Integer approver, Integer approvalLevel, Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 수정 시 강의결재/강의시간 연결테이블에서 해당정보 모두 삭제
	Integer deleteLectureApprovalLectureWeekday(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 수정 시 강의시간테이블에서 해당정보 모두 삭제
	Integer deleteLectureWeekday(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 수정 시 강의결재테이블에서 해당정보 수정
	Integer updateLectureApproval(LectureApprovalModifyDTO lectureApprovalModifyDTO);
	
	// 진수우 : 강의결재 상세페이지에서 결재자 출력
	List<LectureApprovalEmployeeListDTO> selectLectureApprovalEmployee(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 상세페이지에서 파일 출력
	List<Files> selectLectureApprovalFile(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 상세페이지에서 강의시간 출력
	List<LectureApprovalWeekdayListDTO> selectLectureApprovalWeekday(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재 상세페이지에서 강의정보 출력
	LectureApprovalOneDTO selectLectureApprovalOne(Integer lectureApprovalNo);
	
	// 진수우 : 강의결재신청 시 강의결재/파일 연결테이블에 해당정보 저장
	Integer insertLectureApprovalFile(Map<String,Integer> resultMap);
	
	// 진수우 : 강의결재신청 시 결재자테이블에 해당정보 저장
	Integer insertApprovalEmployee(ApprovalAddDTO approvalAddDTO);
	
	// 진수우 : 강의결재신청 시  강의결재테이블에 해당정보 저장
	Integer insertLectureApproval(LectureApprovalAddDTO lectureApprovalAddDTO);
	
	// 진수우 : 강의결재신청 시 강의시간/강의 연결테이블에 해당정보 저장
	Integer insertLectureApprovalLectureWeekday(Map<String,Integer> resultMap);
	
	// 진수우 : 강의결재신청 시 강의시간테이블에 해당정보 저장
	Integer insertLectureWeekday(LectureWeekday lectureWeekday);
	
	// 진수우 : 시작시간 선택 시 가능한 시간만 출력
	List<Common> selectLectureApprovalGetBeginTime(LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO);

	// 진수우 : 종료시간 선택 시 가능한 시간만 출력
	List<Common> selectLectureApprovalGetEndTime(LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO);
	
	// 진수우 : 시작시간 선택 시 가능한 시간만 출력 + 현재 수정 중인 강의시간도 출력
	List<Common> selectLectureApprovalGetBeginTimeFromModify(LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO);
	
	// 진수우 : 종료시간 선택 시 가능한 시간만 출력 + 현재 수정 중인 강의시간도 출력
	List<Common> selectLectureApprovalGetEndTimeFromModify(LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO);
	
	// 진수우 : 시작시간 선택 시 가능한 시간만 출력 + 현재 수정 중인 강의시간도 출력(강의수정)
	List<Common> selectLectureApprovalGetBeginTimeFromLectureModify(LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO);
		
	// 진수우 : 종료시간 선택 시 가능한 시간만 출력 + 현재 수정 중인 강의시간도 출력(강의수정)
	List<Common> selectLectureApprovalGetEndTimeFromLectureModify(LectureApprovalGetBeginTimeDTO lectureApprovalGetBeginTimeDTO);
}
