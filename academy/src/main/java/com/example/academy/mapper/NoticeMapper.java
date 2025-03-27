package com.example.academy.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.academy.dto.NewNoticeListDTO;
import com.example.academy.dto.NoticeAddDTO;

@Mapper
public interface NoticeMapper {
	// 진수우 : 전체 알림 조회.
	List<NewNoticeListDTO> selectAllNotice(Integer employeeNo);
	
	// 진수우 : 최근 알림 조회.
	List<NewNoticeListDTO> selectNewNotice(Integer employeeNo);
	
	// 진수우 : 알림저장.
	Integer insertNotice(NoticeAddDTO noticeAddDTO);
	
	// 진수우 : 알림삭제.
	Integer deleteNotice(Integer noticeNo);
}
