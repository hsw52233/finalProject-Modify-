package com.example.academy.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.academy.dto.AttendanceApprovalAddDTO;
import com.example.academy.dto.AttendanceApprovalListDTO;
import com.example.academy.dto.AttendanceApprovalModifyDTO;
import com.example.academy.dto.AttendanceApprovalOneDTO;
import com.example.academy.dto.NoticeAddDTO;
import com.example.academy.mapper.ApprovalEmployeeMapper;
import com.example.academy.mapper.AttendanceApprovalFileMapper;
import com.example.academy.mapper.AttendanceApprovalMapper;
import com.example.academy.mapper.FilesMapper;
import com.example.academy.mapper.NoticeMapper;
import com.example.academy.util.InputFile;
import com.example.academy.vo.Files;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class AttendanceApprovalService {
	@Autowired AttendanceApprovalMapper attendanceApprovalMapper;
	@Autowired ApprovalEmployeeMapper approvalEmployeeMapper;
	@Autowired FilesMapper filesMapper;
	@Autowired AttendanceApprovalFileMapper attendanceApprovalFileMapper;
	@Autowired NoticeMapper noticeMapper;
	
	// 김혜린 : 근태신청서 재신청 페이지
	public void retryAttendanceApproval(AttendanceApprovalAddDTO addDTO) {
		// 1) 근태신청서 attendance_approval 테이블에 추가
		attendanceApprovalMapper.insertAttendanceApproval(addDTO);
		Integer attendanceApprovalNo = addDTO.getAttendanceApprovalNo();	// pk값 받아오기
		log.debug("attendanceApprovalNo: " + attendanceApprovalNo);
		
		// 2) 결재자 추가 - approval_employee (결재자) 테이블에 추가
		// 	ㄴ if approvers(변경된 결재자)가 존재한다면 approvers로 추가 / 존재안하면 alreadyApprovers(기존 결재자)로 추가
		List<String> approvers = addDTO.getApprovers(); // 새로운 결재자 배열
		List<String> alreadyApprovers = addDTO.getAlreadyApprovers(); // 변경전 결재자 배열
		
		log.debug("새로운 결재자 배열 : " + approvers);
		log.debug("기존 결재자 배열 : " + alreadyApprovers);
		
		List<String> approverList;	// 최종 결재자 배열 세팅
		if (approvers != null && !approvers.isEmpty()) {	// approvers가 비어있지 않은 경우(결재자가 바뀐경우임)
			approverList = approvers;
		} else {	// 결재자가 안바뀐경우
			approverList = alreadyApprovers;
		}
		
		Integer index = 1; 	// 결재 순위 표시
		for(String approver : approverList) {
			// 결재자 배열 받아서 값세팅 ex)김아무개[32], 최아무개[36]
			String numberStr = approver.replaceAll("[^0-9]", "");	// 숫자 제외 ""로 바꾸기
			int number = Integer.parseInt(numberStr);
			addDTO.setApprover(number);
			addDTO.setApprovalLevel(index);
			addDTO.setAttendanceApprovalNo(attendanceApprovalNo);
			index++;
			log.debug("결재자 삽입전 확인=== : " + addDTO);	// 디버깅
			approvalEmployeeMapper.insertAttendanceApprovalEmployee(addDTO);
		}
		
		
		// 3) 파일 삽입
		// 수정하지 않은 파일 목록(기존파일) 가져오기
		List<String> alreadyfilesList = addDTO.getAlreadyFiles();	// fileName을 배열로 받아옴
		
		if(alreadyfilesList != null) {	// 기존파일이 존재한다면
			log.debug("기존파일존재!!!");	// 디버깅
			// 파일복사
			for(String fileName : alreadyfilesList) {
				Files copyFile = new Files();
				copyFile = filesMapper.selectCopyFile(fileName);	// 복사할 파일 조회
				InputFile inputFile = new InputFile();
				copyFile.setFileName(inputFile.getUUID());	// 새로운 fileName
				log.debug("새롭게 부여받은 uuid ???? ===> " + copyFile.getFileName());	// 디버깅
				
				// 파일테이블에 삽입
				filesMapper.insertFile(copyFile);	
				Integer fileNo = copyFile.getFileNo();	// 삽입된 파일 pk번호 받아오기
				log.debug("fileNo = " + fileNo);
				
				// 근태신청서-파일 테이블에 삽입할 데이터 set
				addDTO.setAttendanceApprovalNo(attendanceApprovalNo);
				addDTO.setFileNo(fileNo);
				// 근태신청서-파일 테이블에 삽입할 데이터 삽입
				attendanceApprovalFileMapper.insertAttendanceApprovalFile(addDTO);
				
				// 복사한 파일 물리적 파일 저장
				// 프로젝트의 static/upload 디렉토리 경로
				String basePath = "/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/";
				
				// 기존 파일 경로
				File alreadyFile = new File(basePath + fileName + "." + copyFile.getFileExt());
				log.debug("기존파일alreadyFile 경로 ===> " + alreadyFile);	// 디버깅
				
				// 새로운 파일(기존꺼 복사할) 경로
				File newFile = new File(basePath + copyFile.getFileName() + "." + copyFile.getFileExt());
				log.debug("새로운파일newFile 경로 ===> " + newFile);	// 디버깅
				
				try {
					log.debug("복사성공");	// 디버깅
					java.nio.file.Files.copy(alreadyFile.toPath(), newFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			
		} 
		
		// 새롭게 추가된 파일 추가
		if(addDTO.getAttendanceApprovalFiles() != null) {	// 파일이 첨부된경우(비어있지 않으면)
			log.debug("새롭게 추가된 파일 존재!!!");	// 디버깅
			List<MultipartFile> files = addDTO.getAttendanceApprovalFiles();	// 폼에 입력되었던 파일 가져옴
			
			for(MultipartFile mf : files) {
				if(mf.isEmpty()) continue;
				InputFile inputFile = new InputFile(); // inputFile 인스턴스 생성.
				inputFile.setOriginFileName(mf.getOriginalFilename());	// 파일 실제 이름 추출 후 inputFile 인스턴스에 set.
				
				Files file = new Files();
				file.setFileName(inputFile.getUUID());		// 서버 파일명
				file.setFileExt(inputFile.getFileExt());	// 파일 확장자
				file.setFileOrigin(inputFile.getFileName());	// 기존 파일명
				file.setFileSize(mf.getSize());		// 파일크기
				file.setFileType(mf.getContentType());	// 파일 타입
				file.setFileCategory("FC003");	// 파일 카테고리
				// file 테이블에 삽입
				filesMapper.insertFile(file);	
				Integer fileNo = file.getFileNo();	// 삽입된 파일 pk번호 받아오기
				log.debug("fileNo = " + fileNo);
				
				// 근태신청서-파일 테이블에 삽입할 데이터 set
				addDTO.setAttendanceApprovalNo(attendanceApprovalNo);
				addDTO.setFileNo(fileNo);
				// attendance_approval_file 테이블에 삽입
				attendanceApprovalFileMapper.insertAttendanceApprovalFile(addDTO);
				
				// 물리적 파일 저장
				try {
					mf.transferTo(new File("/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + file.getFileName() + "." + file.getFileExt()));
				} catch (Exception e) {
					e.printStackTrace();
					throw new RuntimeException();
				} 
				
			}
			
		}
		
	}
	
	// 김혜린 : 근태신청서 결재 승인 시
	public void agreeAttendanceApproval(AttendanceApprovalOneDTO attendanceApprovalOneDTO) {
		// 1) 결재자(approval_employee) 테이블에서 승인으로 상태 업데이트
		approvalEmployeeMapper.updateApprovalStatusAgree(attendanceApprovalOneDTO);
		
		// 2) 근태신청서(attendance_approval) 테이블에서 step + 1
		attendanceApprovalMapper.updateAttendanceApprovalStepPlus(attendanceApprovalOneDTO);
		
		// 근태 신청서 총 결재자 수
		Integer totalApprover = approvalEmployeeMapper.selectTotalApprover(attendanceApprovalOneDTO);
		
		// 근태신청서 현재 결재단계step 구하기
		Integer step = attendanceApprovalMapper.selectAttendanceApprovalStep(attendanceApprovalOneDTO);
		
		// 마지막 결재자라면 근태신청서(attendance_approval) 테이블에서 승인으로 상태 업데이트
		if(step == (totalApprover+1)) {
			attendanceApprovalMapper.updateAttendanceApprovalStatusAgree(attendanceApprovalOneDTO);
			
			// 알림테이블에 해당 정보 삽입.
			AttendanceApprovalOneDTO result = attendanceApprovalMapper.selectAttendanceApprovalOne(attendanceApprovalOneDTO.getAttendanceApprovalNo());
			NoticeAddDTO noticeAddDTO = new NoticeAddDTO();
			noticeAddDTO.setEmployeeNo(result.getEmployeeNo());
			noticeAddDTO.setNoticeContent("'" + result.getAttendanceApprovalTitle() + "' 결재가 승인되었습니다.");
			noticeAddDTO.setNoticeType("NT002");
			noticeMapper.insertNotice(noticeAddDTO);
		}
		
	}
	
	// 김혜린 : 근태신청서 결재 반려 시
	public void rejectAttendanceApproval(AttendanceApprovalOneDTO attendanceApprovalOneDTO) {
		// 1) 결재자(approval_employee) 테이블에서 반려로 상태 업데이트
		approvalEmployeeMapper.updateApprovalStatusReject(attendanceApprovalOneDTO);
		
		// 2) 근태신청서(attendance_approval) 테이블에서 반려로 상태 및 반려 사유 업데이트
		attendanceApprovalMapper.updateAttendanceApprovalStatusReject(attendanceApprovalOneDTO);
		
		// 3) 알림테이블에 해당 정보 삽입.
		AttendanceApprovalOneDTO result = attendanceApprovalMapper.selectAttendanceApprovalOne(attendanceApprovalOneDTO.getAttendanceApprovalNo());
		NoticeAddDTO noticeAddDTO = new NoticeAddDTO();
		noticeAddDTO.setEmployeeNo(result.getEmployeeNo());
		noticeAddDTO.setNoticeContent("'" + result.getAttendanceApprovalTitle() + "' 결재가 반려되었습니다.");
		noticeAddDTO.setNoticeType("NT002");
		noticeMapper.insertNotice(noticeAddDTO);
	}
	
	// 김혜린 : 근태 신청서 삭제 - 근태신청서 사용상태를 비활성화로 바꿔줌
	public void removeAttendanceApproval(Integer attendanceApprovalNo) {
		attendanceApprovalMapper.updateUseAttendanceApproval(attendanceApprovalNo);
	}
	
	// 김혜린 : 근태신청서 수정페이지
	public void modifyAttendanceApproval(AttendanceApprovalModifyDTO attendanceApprovalModifyDTO) {
		// 1) 근태신청서 테이블 수정
		attendanceApprovalMapper.updateAttendanceApproval(attendanceApprovalModifyDTO);
		
		// 2) 결재자 수정 - approval_employee (결재자) 테이블 수정
		// 	ㄴ if approvers가 존재한다면 변경(변경된거 기존꺼 삭제후 삽입) / 존재안하면 변경사항 없음
		List<String> approvers = attendanceApprovalModifyDTO.getApprovers(); // 새로운 결재자 배열
		List<String> alreadyApprovers = attendanceApprovalModifyDTO.getAlreadyApprovers(); // 변경전 결재자 배열
		
		log.debug("새로운 결재자 배열 : " + approvers);
		log.debug("기존 결재자 배열 : " + alreadyApprovers);
		
		if (approvers != null && !approvers.isEmpty()) {	 // approvers가 비어있지 않은 경우(결재자가 바뀐경우임)			
			AttendanceApprovalAddDTO addDTO = new AttendanceApprovalAddDTO();
			log.debug("====ModifyDTO의 AttendanceApprovalNo : " + attendanceApprovalModifyDTO.getAttendanceApprovalNo());
			addDTO.setAttendanceApprovalNo(attendanceApprovalModifyDTO.getAttendanceApprovalNo());	// 근태신청서번호 세팅
			log.debug("====addDTO의 AttendanceApprovalNo : " + addDTO.getAttendanceApprovalNo());
			int levelCount = 1; // 결재 순서 카운팅
			
			for(int i=0; i< approvers.size(); i++) {
				String newApprover = approvers.get(i); // 새로운 결재자 가져오기
				String alreadyApprover = (i < alreadyApprovers.size()) ? alreadyApprovers.get(i) : null;	// 기존결재자 수가 새로운결재자 수보다 작으면 null 반환
				
				// 결재자 변경이 없으면 아무것도 안함
				if(alreadyApprover != null && newApprover.equals(alreadyApprover)) {
					levelCount++;	
					continue; // 다음 반복으로 pass
				}
				
				// 결재자가 다르다면 기존 결재자 삭제 후 새로운 결재자 삽입				
				if(alreadyApprover != null) {
					// 기존 결재자 삭제
					String alreadyNumberStr = alreadyApprover.replaceAll("[^0-9]", "");	// 숫자 제외 ""로 바꾸기
					int alreadyNumber = Integer.parseInt(alreadyNumberStr);	// 기존 approver 값
					addDTO.setApprover(alreadyNumber);	// 결재자 세팅
					addDTO.setApprovalLevel(levelCount);	// 결재 순서 세팅
					log.debug("====기존 결재자 삭제전 addDTO확인 : " + addDTO);
					approvalEmployeeMapper.deleteAttendanceApprovalEmployee(addDTO);	// 기존 결재자 삭제
					
					// 새로운 결재자 삽입
					String newNumberStr = newApprover.replaceAll("[^0-9]", "");	// 숫자 제외 ""로 바꾸기
					int newNumber = Integer.parseInt(newNumberStr);	// 새로운 approver 값
					addDTO.setApprover(newNumber);	// 결재자 세팅
					addDTO.setApprovalLevel(levelCount);	// 결재 순서 세팅
					log.debug("====새로운 결재자 삽입전 addDTO확인 : " + addDTO);
					approvalEmployeeMapper.insertAttendanceApprovalEmployee(addDTO);	// 새로운 결재자 삽입
					
					levelCount++;
				}
			}
			
			// 새로운 결재자가 더 많은 경우, 그만큼 결재자 삽입
			if(approvers.size() > alreadyApprovers.size()) {
				for(int i = alreadyApprovers.size(); i<approvers.size(); i++) {
					String newNumberStr = approvers.get(i).replaceAll("[^0-9]", "");	// 숫자 제외 ""로 바꾸기
					int newNumber = Integer.parseInt(newNumberStr);
					addDTO.setApprover(newNumber);	// 결재자 세팅
					addDTO.setApprovalLevel(levelCount);	// 결재순위 세팅
					log.debug("==새로운 결재자가 더 많은 경우==삽입전 addDTO확인 : " + addDTO);
					approvalEmployeeMapper.insertAttendanceApprovalEmployee(addDTO);	// 새로운 결재자 삽입
					levelCount++;
				}
			}
			
			// 기존 결재자가 더 많은 경우, 그만큼 결재자 삭제
			if(approvers.size() < alreadyApprovers.size()) {
				for(int i=approvers.size(); i<alreadyApprovers.size(); i++) {
					String alreadyNumberStr = alreadyApprovers.get(i).replaceAll("[^0-9]", "");	// 숫자 제외 ""로 바꾸기
					int alreadyNumber = Integer.parseInt(alreadyNumberStr);
					addDTO.setApprover(alreadyNumber);	// 결재자 세팅
					addDTO.setApprovalLevel(levelCount);	// 결재순위 세팅
					log.debug("==기존 결재자가 더 많은 경우==삭제전 addDTO확인 : " + addDTO);
					approvalEmployeeMapper.deleteAttendanceApprovalEmployee(addDTO);	// 기존 결재자 삭제
					levelCount++;
				}
			}
		}
		
		// 3) 파일 수정
		// 수정하지 않은 파일 목록 가져오기
		List<String> alreadyfilesList = attendanceApprovalModifyDTO.getAlreadyFiles();
		
		// 데이터베이스에 저장되어있는 파일목록 가져오기
		List<Files> attendanceApprovalFileList = attendanceApprovalFileMapper.selectAttendanceApprovalFileList(attendanceApprovalModifyDTO.getAttendanceApprovalNo());
		
		// 수정하지 않은 파일은 제외하고 데이터베이스 파일정보와 물리적 파일 삭제
		for(Files files : attendanceApprovalFileList) {
			if(alreadyfilesList != null) {
				int fileCount = 0;
				for(String alreadyfiles : alreadyfilesList) {
					if(alreadyfiles.equals(files.getFileName())) {
						break;
					} else {
						fileCount++;
					}
					if(fileCount == alreadyfilesList.size()) {
						// 파일 테이블 삭제하기 전 해당 파일번호 가져오기
						Integer delFileNo = filesMapper.selectDeleteFileNo(files.getFileName());

						// 파일/결재 연결테이블 데이터 삭제
						attendanceApprovalFileMapper.deleteAttendanceApprovalFile(delFileNo, attendanceApprovalModifyDTO.getAttendanceApprovalNo());
						
						// 파일테이블 데이터 삭제
						filesMapper.deleteFile(files.getFileName());
						
						// 서버에 있는 물리적 파일 삭제
						String fullname = "/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + files.getFileName() + "." + files.getFileExt();
						File f = new File(fullname);
						f.delete();
					} 
				}	
			} else {
				// 파일 테이블 삭제하기 전 해당 파일번호 가져오기
				Integer delFileNo = filesMapper.selectDeleteFileNo(files.getFileName());

				// 파일/결재 연결테이블 데이터 삭제
				attendanceApprovalFileMapper.deleteAttendanceApprovalFile(delFileNo, attendanceApprovalModifyDTO.getAttendanceApprovalNo());
				
				// 파일테이블 데이터 삭제
				filesMapper.deleteFile(files.getFileName());
				
				// 서버에 있는 물리적 파일 삭제
				String fullname = "/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + files.getFileName() + "." + files.getFileExt();
				File f = new File(fullname);
				f.delete();
			}
		}
			
		// 새로 입력한 파일이 있다면 데이터베이스 파일정보와 물리적 파일 추가
		if(attendanceApprovalModifyDTO.getAttendanceApprovalFiles() != null) {	// 파일이 첨부된경우(비어있지 않으면)
			
			for(MultipartFile mf : attendanceApprovalModifyDTO.getAttendanceApprovalFiles()) {
				if(mf.isEmpty()) continue;	
				InputFile inputFile = new InputFile(); // inputFile 인스턴스 생성.
				inputFile.setOriginFileName(mf.getOriginalFilename());	// 파일 실제 이름 추출 후 inputFile 인스턴스에 set.
				
				Files file = new Files();
				file.setFileName(inputFile.getUUID());		// 서버 파일명
				file.setFileExt(inputFile.getFileExt());	// 파일 확장자
				file.setFileOrigin(inputFile.getFileName());	// 기존 파일명
				file.setFileSize(mf.getSize());		// 파일크기
				file.setFileType(mf.getContentType());	// 파일 타입
				file.setFileCategory("FC003");	// 파일 카테고리
				// file 테이블에 삽입
				Integer result = filesMapper.insertFile(file);	
				Integer fileNo = file.getFileNo();	// 데이터베이스에 파일정보 삽입 시 자동으로 생성되는 fileNo값 가져옴
				log.debug("fileNo = " + fileNo);
				
				// 근태신청서-파일 테이블에 삽입할 데이터 set
				AttendanceApprovalAddDTO addDTO2 = new AttendanceApprovalAddDTO();
				log.debug("삽입전 확인 attendanceApprovalNo = " + attendanceApprovalModifyDTO.getAttendanceApprovalNo());
				addDTO2.setAttendanceApprovalNo(attendanceApprovalModifyDTO.getAttendanceApprovalNo());
				addDTO2.setFileNo(fileNo);
				// attendance_approval_file 테이블에 삽입
				attendanceApprovalFileMapper.insertAttendanceApprovalFile(addDTO2);
				
				
				// 모든 db에 잘 삽입되었다면 서버에 물리적 파일 저장
				if(result == 1) {
					try {
						mf.transferTo(new File("/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + file.getFileName() + "." + file.getFileExt()));
					} catch (Exception e) {
						e.printStackTrace();
						throw new RuntimeException();
					} 
				}
				
			}
			
		}

	}
	
	// 김혜린 : 근태신청서 상세페이지
	public AttendanceApprovalOneDTO getAttendanceApprovalOne(Integer attendanceApprovalNo) {
		// 근태신청서 테이블 상세
		AttendanceApprovalOneDTO attendanceApprovalOne = attendanceApprovalMapper.selectAttendanceApprovalOne(attendanceApprovalNo);
		
		return attendanceApprovalOne;
	}
	
	// 김혜린 : 근태신청서 신청
	public void addAttendanceApproval(AttendanceApprovalAddDTO attendanceApprovalAddDTO) {
		int result = 0;	// 물리적 파일 추가전 db에 삽입 유무확인 

		// attendance_approval (근태신청서) 테이블에 추가
		result += attendanceApprovalMapper.insertAttendanceApproval(attendanceApprovalAddDTO);
		Integer attendanceApprovalNo = attendanceApprovalAddDTO.getAttendanceApprovalNo();	// pk값 받아오기
		log.debug("attendanceApprovalNo: " + attendanceApprovalNo);
		log.debug("attendance_approval테이블삽입확인:1? " + result);
		
		// approval_employee (결재자) 테이블에 추가
		// approvers 결재자 배열 받아서 값세팅 ex)김아무개[32], 최아무개[36]
		Integer index = 1; 	// 결재순위표시
		int row = 0;
		for(String a : attendanceApprovalAddDTO.getApprovers()) {
			String numberStr = a.replaceAll("[^0-9]", "");	// 숫자 제외 ""로 바꾸기
			int number = Integer.parseInt(numberStr);
			attendanceApprovalAddDTO.setApprover(number);
			attendanceApprovalAddDTO.setApprovalLevel(index);
			index++;
			attendanceApprovalAddDTO.setAttendanceApprovalNo(attendanceApprovalNo);
			row += approvalEmployeeMapper.insertAttendanceApprovalEmployee(attendanceApprovalAddDTO);
		}
		
		// 모든 결재자가 db에 삽입되면 result +1 
		if(attendanceApprovalAddDTO.getApprovers().size() == row) {
			result += 1;
		}
		log.debug("approval_employee 테이블삽입확인:2? " + result);
		
		// 파일 추가
		int row2=0;
		if(attendanceApprovalAddDTO.getAttendanceApprovalFiles() != null) {	// 파일이 첨부된경우(비어있지 않으면)
			List<MultipartFile> files = attendanceApprovalAddDTO.getAttendanceApprovalFiles();	// 폼에 입력되었던 파일 가져옴
			
			for(MultipartFile mf : files) {
				InputFile inputFile = new InputFile(); // inputFile 인스턴스 생성.
				inputFile.setOriginFileName(mf.getOriginalFilename());	// 파일 실제 이름 추출 후 inputFile 인스턴스에 set.
				
				Files file = new Files();
				file.setFileName(inputFile.getUUID());		// 서버 파일명
				file.setFileExt(inputFile.getFileExt());	// 파일 확장자
				file.setFileOrigin(inputFile.getFileName());	// 기존 파일명
				file.setFileSize(mf.getSize());		// 파일크기
				file.setFileType(mf.getContentType());	// 파일 타입
				file.setFileCategory("FC003");	// 파일 카테고리
				// file 테이블에 삽입
				row2 += filesMapper.insertFile(file);	
				Integer fileNo = file.getFileNo();	// 삽입된 파일 pk번호 받아오기
				log.debug("fileNo = " + fileNo);
				log.debug("파일 테이블삽입확인:row2? " + row2);
				
				// 근태신청서-파일 테이블에 삽입할 데이터 set
				attendanceApprovalAddDTO.setAttendanceApprovalNo(attendanceApprovalNo);
				attendanceApprovalAddDTO.setFileNo(fileNo);
				// attendance_approval_file 테이블에 삽입
				row2 += attendanceApprovalFileMapper.insertAttendanceApprovalFile(attendanceApprovalAddDTO);
				log.debug("신청서파일 테이블삽입확인:row2? " + row2);
				
				// 모든 db에 잘 삽입되었다면 서버에 물리적 파일 저장
				if(result == 2 && row2 == 2) {
					try {
						mf.transferTo(new File("/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + file.getFileName() + "." + file.getFileExt()));
					} catch (Exception e) {
						e.printStackTrace();
						throw new RuntimeException();
					} 
				}
				row2=0;
				
			}
			
		}
	}
	
	// 김혜린 : 결재완료목록 - 근태신청서리스트 조회
	public List<AttendanceApprovalListDTO> getCompleteAttendanceApprovalList(Integer employeeNo) {
		return attendanceApprovalMapper.selectCompleteAttendanceAprrovalList(employeeNo);
	}
	
	// 김혜린 : 결재대기목록 - 근태신청서리스트 조회
	public List<AttendanceApprovalListDTO> getWaitAttendanceApprovalList(Integer employeeNo) {
		return attendanceApprovalMapper.selectWaitAttendanceAprrovalList(employeeNo);
	}
	
	// 김혜린 : 나의 신청목록 - 근태신청서리스트 조회
	public List<AttendanceApprovalListDTO> getAttendanceApprovalList(Integer employeeNo) {
		return attendanceApprovalMapper.selectAttendanceAprrovalList(employeeNo);
	}
}
