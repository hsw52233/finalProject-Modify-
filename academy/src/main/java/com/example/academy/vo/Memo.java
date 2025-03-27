package com.example.academy.vo;

import lombok.Data;

@Data
public class Memo {

	private Integer memoNo;
    private String memoContent;
    private Integer writer;
    private String createDate;
    private String updateDate;

}