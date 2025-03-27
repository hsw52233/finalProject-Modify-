package com.example.academy.util;
// util패키지는 일반적으로 여러 곳에서 재사용할 수 있는 유틸리티 기능을 제공하는 클래스들을 모아두는 패키지이다. 
import java.util.UUID; // 고유한 식별자 생성
import lombok.Data;

// 진수우 : 파일추가 객체.
@Data
public class InputFile {
	private String originFileName; // 실제 파일이름.
	
	// 파일명에서 점이 위치한 인덱스 계산.
	private Integer dotIndex(String fileName) {
		return this.originFileName.lastIndexOf("."); // 파일 확장자의 시작 위치를 찾는데 사용됨.
	}
	
	// 서버에 저장되는 파일이름.
	public String getUUID() {
		return UUID.randomUUID().toString().replace("-", "");
	}
	
	// 파일명 추출.
	public String getFileName() {
		return this.originFileName.substring(0, this.dotIndex(this.originFileName));
	}
	
	// 파일확장자 추출.
	public String getFileExt() {
		return this.originFileName.substring(this.dotIndex(this.originFileName)+1);
	}
}
