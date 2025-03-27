package com.example.academy.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.academy.dto.CommentAddDTO;
import com.example.academy.dto.CommentListDTO;
import com.example.academy.security.CustomUserDetails;
import com.example.academy.service.BoardService;

@RestController
public class CommentRestController {
	@Autowired BoardService boardService;
	
	// 진수우 : 댓글 등록.
	@PostMapping("/restapi/addComment")
	public CommentListDTO addComment(@RequestBody CommentAddDTO commentAddDTO) {
		// 스프링시큐리티에서 계정정보 가져오기.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 로그인 상태일 때만 commentAddDTO에 사원번호 담기.
	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        commentAddDTO.setEmployeeNo(Integer.parseInt(userDetails.getUsername()));
	    }
		// 댓글추가.
		boardService.addComment(commentAddDTO);
		// 추가된 댓글 rest로 반환.
		return boardService.getNewComment(commentAddDTO.getEmployeeNo());
	}
	
	// 진수우 : 댓글 삭제.
	@PostMapping("/restapi/removeComment")
	public void removeComment(@RequestBody Integer commentNo) {
	    boardService.removeComment(commentNo);
	}
}
