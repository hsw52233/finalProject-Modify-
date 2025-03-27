package com.example.academy.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.NewNoticeListDTO;
import com.example.academy.mapper.NoticeMapper;

@Service
@Transactional
public class NoticeService {
	@Autowired NoticeMapper noticeMapper;
	
	// 진수우 : 알림삭제.
	public Integer removeNotice(Integer noticeNo) {
		return noticeMapper.deleteNotice(noticeNo);
	}
	
	// 진수우 : 전체 알림 조회.
	public List<NewNoticeListDTO> getAllNotice(Integer employeeNo) {
		return noticeMapper.selectAllNotice(employeeNo);
	}
	
	// 진수우 : 최근 알림 조회.
	public List<NewNoticeListDTO> getNewNotice(Integer employeeNo) {
		return noticeMapper.selectNewNotice(employeeNo);
	}
}
