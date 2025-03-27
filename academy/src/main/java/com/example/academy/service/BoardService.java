package com.example.academy.service;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.academy.dto.BoardDTO;
import com.example.academy.dto.BoardFileDTO;
import com.example.academy.dto.BoardListByMainDTO;
import com.example.academy.dto.BoardListDTO;
import com.example.academy.dto.BoardModifyDTO;
import com.example.academy.dto.CommentAddDTO;
import com.example.academy.dto.CommentListDTO;
import com.example.academy.mapper.BoardFileMapper;
import com.example.academy.mapper.BoardMapper;
import com.example.academy.mapper.FilesMapper;
import com.example.academy.util.InputFile;
import com.example.academy.vo.BoardFile;
import com.example.academy.vo.Files;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class BoardService {
	@Autowired BoardMapper boardMapper;
	@Autowired FilesMapper filesMapper;
	@Autowired BoardFileMapper boardFileMapper;
	
	// 진수우 : 댓글 삭제.
	public Integer removeComment(Integer commentNo) {
		return boardMapper.deleteComment(commentNo);
	}
	
	// 진수우 : 추가한 댓글 조회.
	public CommentListDTO getNewComment(Integer employeeNo) {
		return boardMapper.selectNewComment(employeeNo);
	}
	
	// 진수우 : 댓글 등록.
	public void addComment(CommentAddDTO commentAddDTO) {
		// 댓글 테이블에 데이터 추가.
		boardMapper.insertComment(commentAddDTO);
		
		// 게시물/댓글 연결테이블에 데이터 추가.
		boardMapper.insertBoardComment(commentAddDTO);
	}
	
	// 진수우 : 해당 게시물의 댓글 조회.
	public List<CommentListDTO> getCommentList(Integer boardNo) {
		return boardMapper.selectCommentList(boardNo);
	}
	
	// 메인페이지에 최신 공지사항 3개 조회
	public List<BoardListByMainDTO> getBoardListByMain() {
		List<BoardListByMainDTO> boardList = boardMapper.selectBoardListByMain();
		for(BoardListByMainDTO board : boardList) {
			board.setCreateDate(board.getCreateDate().substring(0, 10));
		}
		return boardList;
	}
	
	// 공지사항 삭제 버튼 클릭 시 yn 수정
	public Integer updateBoardYN(Integer boardNo) {
		boardMapper.deleteAllComment(boardNo);
		return boardMapper.updateBoardYN(boardNo);
	}
	
	// 공지사항 수정
	public void updateBoard(BoardModifyDTO boardModifyDTO) {
		
		// 1) 공지사항 제목, 내용 수정 
		Integer boardRow = boardMapper.updateBoard(boardModifyDTO);
		log.debug("boardRow = " + boardRow);
	    
	    // 2) 파일 수정
 		// 수정하지 않은 파일 목록 가져오기
 		List<String> alreadyfilesList = boardModifyDTO.getAlreadyFiles();
 		System.out.println("alreadyfilesList-----------------> " + alreadyfilesList);
 		
 		// 데이터베이스에 저장되어있는 파일목록 가져오기
 		List<BoardFileDTO> boardFileList = boardFileMapper.selectBoardFileList(boardModifyDTO.getBoardNo());
 		log.debug("boardFileList-----------------> " + boardFileList);
 		
 		// 수정하지 않은 파일은 제외하고 데이터베이스 파일정보와 물리적 파일 삭제
 		for(BoardFileDTO files : boardFileList) {
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
 						boardFileMapper.deleteBoardFile(delFileNo, boardModifyDTO.getBoardNo());
 						
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
 				boardFileMapper.deleteBoardFile(delFileNo, boardModifyDTO.getBoardNo());
 				
 				// 파일테이블 데이터 삭제
 				filesMapper.deleteFile(files.getFileName());
 				
 				// 서버에 있는 물리적 파일 삭제
 				String fullname = "/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + files.getFileName() + "." + files.getFileExt();
 				File f = new File(fullname);
 				f.delete();
 			}
 		}
 			
 		// 새로 입력한 파일이 있다면 데이터베이스 파일정보와 물리적 파일 추가
 		if(boardModifyDTO.getBoardFiles() != null) {	// 파일이 첨부된경우(비어있지 않으면)
 			
 			for(MultipartFile mf : boardModifyDTO.getBoardFiles()) {
 				if(mf.isEmpty()) continue;	
 				InputFile inputFile = new InputFile(); // inputFile 인스턴스 생성.
 				inputFile.setOriginFileName(mf.getOriginalFilename());	// 파일 실제 이름 추출 후 inputFile 인스턴스에 set.
 				
 				Files file = new Files();
 				file.setFileName(inputFile.getUUID());		// 서버 파일명
 				file.setFileExt(inputFile.getFileExt());	// 파일 확장자
 				file.setFileOrigin(inputFile.getFileName());	// 기존 파일명
 				file.setFileSize(mf.getSize());		// 파일크기
 				file.setFileType(mf.getContentType());	// 파일 타입
 				file.setFileCategory("FC002");	// 파일 카테고리
 				// file 테이블에 삽입
 				Integer result = filesMapper.insertFile(file);	
 				Integer fileNo = file.getFileNo();	// 데이터베이스에 파일정보 삽입 시 자동으로 생성되는 fileNo값 가져옴
 				log.debug("fileNo = " + fileNo);
 				
 				// 근태신청서-파일 테이블에 삽입할 데이터 set
 				BoardFile addDTO2 = new BoardFile();
 				log.debug("삽입전 확인 boardNo = " + boardModifyDTO.getBoardNo());
 				addDTO2.setBoardNo(boardModifyDTO.getBoardNo());
 				addDTO2.setFileNo(fileNo);
 				// board_file 테이블에 삽입
 				boardFileMapper.insertBoardFile(addDTO2);
 				
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
	
	
	// 상세 공지사항 
	public BoardDTO boardOne(Integer boardNo) {
		
		// boardNo 해당 게시물을 조회 시 조회 수 증가
		boardMapper.updateBoardCount(boardNo);
		
		// 게시물 상세 조회
		BoardDTO boardDTO = boardMapper.selectBoardOne(boardNo);
		log.debug("boardDTO -----> " + boardDTO);
		
		// 날짜를 2025-01-09 형식으로 넘기기
		boardDTO.setUpdateDate(boardDTO.getUpdateDate().substring(0, 10));
		
		return boardDTO;
	}
	
	// 공지사항 추가
	public void addBoard(BoardDTO boardDTO) {
		int result1 = 0;
		int result2 = 0;		
		result1 += boardMapper.insertBoard(boardDTO);
		log.debug("result1 = " + result1);
		Integer boardNo = boardDTO.getBoardNo();
		log.debug("boardNo = " + boardNo);
		
		List<MultipartFile> files = boardDTO.getBoardFiles(); // 폼에 입력되었던 파일데이터 가져옴.
		
		// 파일이 첨부되지 않은 경우, files가 null일 수 있으므로 null 체크 후, 비어있는 리스트로 처리
	    if (files == null || files.isEmpty()) {
	        log.debug("No files to upload");
	    } else {
	        // 파일이 첨부된 경우 파일 처리 로직 실행
			// 파일정보 데이터베이스에 삽입.
			for(MultipartFile mf : files) {					
				
				InputFile inputFile = new InputFile(); // inputFile 인스턴스 생성.
				inputFile.setOriginFileName(mf.getOriginalFilename()); // 파일의 실제이름을 추출해서 inputFile 인스턴스에 set.
				
				Files file = new Files();
				file.setFileName(inputFile.getUUID()); // 서버에서 관리되는 파일이름.
				file.setFileOrigin(inputFile.getFileName()); // 실제 파일이름.
				file.setFileExt(inputFile.getFileExt()); // 파일 확장자.
				file.setFileSize(mf.getSize()); // 파일 크기.
				file.setFileType(mf.getContentType()); // 파일 타입.
				file.setFileCategory("FC002"); // 파일 카테고리.
				result2 += filesMapper.insertFile(file); // 파일정보 삽입.
				log.debug("result2 = " + result2);
				Integer fileNo = file.getFileNo();
				log.debug("fileNo = " + fileNo);
				
				BoardFile boardFile = new BoardFile();
				boardFile.setBoardNo(boardNo);
				boardFile.setFileNo(fileNo);
				result2 += boardFileMapper.insertBoardFile(boardFile);
				log.debug("result2 = " + result2);			
				
				// 모든 db에 잘 삽입되었다면 서버에 물리적 파일 저장
				if(result1 == 1 && result2 == 2) {
					try {
						mf.transferTo(new File("/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + file.getFileName() + "." + file.getFileExt()));
					} catch (Exception e) {
						e.printStackTrace();
						throw new RuntimeException();
					} 
				result2 = 0;
				}
			}
	    }
	}
	
	// 공지사항 리스트 조회
	public List<BoardListDTO> getBoardList(String categoryCode) {
		List<BoardListDTO> boardList = boardMapper.selectBoardList(categoryCode);
		for(BoardListDTO board : boardList) {
			board.setUpdateDate(board.getCreateDate().substring(0, 10));
		}
		return boardList;
	}
	
}
