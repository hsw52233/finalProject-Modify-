package com.example.academy.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.academy.dto.chattingMessageDTO;

@Mapper
public interface ChattingMapper {
	

	// 전체 읽지 않은 메시지 개수 조회
		int totalUnreadMessages(Integer userId);
	
	// 메시지 상태 변화
	void updateUseYn(@Param("fromUserName") String fromUserName, @Param("toUserName") String toUserName);
	
	// 읽지 않은 메시지 개수 조회
    int countUnreadMessages(@Param("fromUserName") String fromUserName, 
                            @Param("toUserName") String toUserName);
	
    // 메시지 입력
	void insertMessage(chattingMessageDTO message);
	
	// 메시지 조회
	List<chattingMessageDTO> getMessages(@Param("fromUserName") Integer fromUserName, 
            @Param("toUserName") Integer toUserName);
}
