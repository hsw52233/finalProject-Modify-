package com.example.academy.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.example.academy.dto.AddCommonDTO;
import com.example.academy.dto.BoardDTO;
import com.example.academy.dto.BoardFileDTO;
import com.example.academy.dto.BoardModifyDTO;
import com.example.academy.dto.CommentListDTO;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.BoardFileService;
import com.example.academy.service.BoardService;
import com.example.academy.service.CommonService;
import com.example.academy.vo.Common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Slf4j
@Controller
public class BoardController {
	@Autowired BoardService boardService;
	@Autowired BoardFileService boardFileService;
	@Autowired CommonService commonService;
	
	// 게시판 관리 페이지
	@GetMapping("/Administration/boardManagement")
	public String boardManagement(Model model) {
		
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    
	        model.addAttribute("employeeNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	    }
		
	    // 공지사항 게시판을 제외한 게시판 종류 리스트 불러오기
		List<Common> boardCategoryList = commonService.getBoardCategoryByNotice();
		log.debug("------------------->" + boardCategoryList);
		
		model.addAttribute("boardCategoryList", boardCategoryList);
		
		return "boardManagement";
	}
	
	// 공지사항yn 수정
	@GetMapping("/deleteBoard")
	public String modifyBoardYN(Integer boardNo, String boardCategory) {
		
		Integer updateRow = boardService.updateBoardYN(boardNo);
		log.debug("updateRow --------------------> " + updateRow);
		
		return "redirect:/boardList/" + boardCategory;
	}
	
	// 공지사항 수정
	@PostMapping("/modifyBoard")
	public String modifyBoard(@ModelAttribute BoardModifyDTO boardModifyDTO) {
		
		log.debug("---------------------------------------" + boardModifyDTO);
		
		boardService.updateBoard(boardModifyDTO);
		
		return "redirect:/boardOne?boardNo=" + boardModifyDTO.getBoardNo();
	}
	
	// 공지사항 수정 폼 호출
 	@GetMapping("/modifyBoard")
	public String modifyBoard(Model model, Integer boardNo) {
		
 		log.debug("boardNo -------> " + boardNo);
 		
 		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    
	        model.addAttribute("employeeNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	    }
 		
		// 상세 공지사항 정보 조회
		BoardDTO boardOne = boardService.boardOne(boardNo);
		
		// 공지사항 파일리스트 조회
		List<BoardFileDTO> boardFileList = boardFileService.getBoardFileList(boardNo);
		
		// 게시판 카테고리 조회
	    List<Common> commonBoardCategory = commonService.getBoardCategory();
		
		// 모델에 정보 담기
		model.addAttribute("boardOne", boardOne);
		model.addAttribute("boardFileList", boardFileList);
		model.addAttribute("commonBoardCategory", commonBoardCategory);
		
		return "modifyBoard";
	}
	
	// 공지사항 추가
	@PostMapping("/addBoard")
	public String addBoard(@ModelAttribute BoardDTO boardDTO) {
		
		log.debug("---------------------------------------" + boardDTO);
		
		boardService.addBoard(boardDTO);
		
		return "redirect:/boardList/" + boardDTO.getBoardCategory();	
	}
	
	// 공지사항 추가 폼 호출
	@GetMapping("/addBoard")
	public String addBoard(Model model, String name) {
		// 게시판 카테고리 이름 디버깅
		log.debug("name---------------------------------------" + name);
		
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    
	        // 게시판 카테고리 이름 모델에 넣기
	        model.addAttribute("name", name);
	        model.addAttribute("employeeNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	    }
	    // 게시판 카테고리 조회
	    List<Common> commonBoardCategory = commonService.getBoardCategory();
	    model.addAttribute("commonBoardCategory", commonBoardCategory);
	    
		return "addBoard";
	}
	
	// 상세 공지사항 조회
	@GetMapping("/boardOne")
	public String boardOne(Model model, Integer boardNo, String name) {
		
		log.debug("name----------->" + name);
		log.debug("boardNo-------->" + boardNo);
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        model.addAttribute("userNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	        model.addAttribute("userDepartment", userDetails.getUserDepartment());
	        log.debug("userDepartment ---->"  + userDetails.getUserDepartment());
	    }
	    
		// boardNo에 해당하는 상세 공지사항 정보 조회
		BoardDTO boardOne = boardService.boardOne(boardNo);
		log.debug("boardOne ----> " + boardOne);
		
		// boardNo에 해당하는 공지사항의 파일 리스트 조회
		List<BoardFileDTO> boardFileList = boardFileService.getBoardFileList(boardNo); 		
		log.debug("boardFileList ----> " + boardFileList);
		
		// boardNo에 해당하는 댓글 조회
		List<CommentListDTO> commentList = boardService.getCommentList(boardNo); 		
		log.debug("commentList ----> " + commentList);
		
		// 모델에 정보 담기
		model.addAttribute("name", boardOne.getName());
		model.addAttribute("boardOne", boardOne);
		model.addAttribute("boardFileList", boardFileList);
		model.addAttribute("commentList", commentList);
		
		return "boardOne";
	}
	
	// 공지사항 리스트 조회
	@GetMapping("/boardList/{categoryCode}")
	public String boardList(@PathVariable("categoryCode") String categoryCode
							, Model model) {
	
		log.debug("categoryCode--------------------->" + categoryCode);
		
		// 해당 게시판 카테고리 조회
		AddCommonDTO boardCategory = commonService.getBoardCategoryOne(categoryCode);
		// 해당 게시판 카테고리 이름 조회
		String name = boardCategory.getName();
		log.debug("name--------------------->" + name);
		
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 model에 정보담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	 
	        model.addAttribute("name", name);
	        model.addAttribute("userNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("employeeNo", Integer.parseInt(userDetails.getUsername()));
	        model.addAttribute("userName", userDetails.getUserRealName());
	        model.addAttribute("userMail", userDetails.getUserMail());
	        model.addAttribute("userRole", userDetails.getUserRole());
	        model.addAttribute("userPhotoFileName", userDetails.getUserPhotoFileName());
	        model.addAttribute("userPhotoFileExt", userDetails.getUserPhotoFileExt());
	    }
		
		return "boardList";
	}
	
}


/* 게시판 관리 시스템에서 공지사항 및 게시글을 다루는 HTTP 요청을 처리하는 역할
 * 주로 CRUD 기능을 제공하며, 사용자 인증 정보를 포함하여 동적으로 뷰에 데이터를 전달함.
 * MVC 패턴에서 Controller 역할을 수행함.
 */ 
