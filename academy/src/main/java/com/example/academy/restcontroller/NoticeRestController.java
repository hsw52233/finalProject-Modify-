package com.example.academy.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.example.academy.dto.NewNoticeListDTO;
import com.example.academy.service.NoticeService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class NoticeRestController {
	@Autowired NoticeService noticeService;
	
	// 진수우 : 알림 삭제.
	@PostMapping("/restapi/removeNotice")
	public void removeNotice(@RequestBody Integer noticeNo) {
		noticeService.removeNotice(noticeNo);
	}
	
	// 진수우 : 최근 알림 조회.
	@PostMapping("/restapi/newNoticeList")
	public List<NewNoticeListDTO> newNoticeList(@RequestBody Integer employeeNo) {
		return noticeService.getNewNotice(employeeNo);
	}
}
