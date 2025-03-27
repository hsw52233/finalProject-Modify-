package com.example.academy.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.BoardDTO;
import com.example.academy.dto.BoardListByMainDTO;
import com.example.academy.dto.BoardListDTO;
import com.example.academy.dto.BoardModifyDTO;
import com.example.academy.dto.CommentAddDTO;
import com.example.academy.dto.CommentListDTO;

@Mapper
public interface BoardMapper {
	// 진수우 : 전체 댓글 삭제.
	Integer deleteAllComment(Integer boardNo);
	
	// 진수우 : 댓글 삭제.
	Integer deleteComment(Integer commentNo);
	
	// 진수우 : 추가한 댓글 조회.
	CommentListDTO selectNewComment(Integer employeeNo);
	
	// 진수우 : 게시물/댓글 추가.
	Integer insertBoardComment(CommentAddDTO commentAddDTO);
	
	// 진수우 : 댓글 추가.
	Integer insertComment(CommentAddDTO commentAddDTO);
	
	// 진수우 : 해당 게시물의 댓글 조회.
	List<CommentListDTO> selectCommentList(Integer boardNo);
	
	// 메인페이지에 최신 공지사항 3개 조회
	List<BoardListByMainDTO> selectBoardListByMain();
	
	// 공지사항 삭제 버튼 클릭 시 yn 수정
	Integer updateBoardYN(Integer boardNo);
	
	// 조회수 수정
	Integer updateBoardCount(Integer boardNo);
	
	// 공지사항 수정
	Integer updateBoard(BoardModifyDTO boardModifyDTO);
	
	// 공지사항 추가
	Integer insertBoard(BoardDTO boardDTO); 
	
	// 상세 공지사항 조회
	BoardDTO selectBoardOne(Integer boardNo);
	
	// 공지사항 리스트 조회
	List<BoardListDTO> selectBoardList(String categoryCode);
	
}
