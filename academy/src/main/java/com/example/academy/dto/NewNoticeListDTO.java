package com.example.academy.dto;

import lombok.Data;

@Data
public class NewNoticeListDTO {
	private Integer NoticeNo;
	private String noticeContent;
	private String noticeType;
	private String createDate;
}
