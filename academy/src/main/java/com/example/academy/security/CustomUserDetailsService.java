package com.example.academy.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.academy.dto.AuthDTO;
import com.example.academy.mapper.AuthMapper;


import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AuthMapper authMapper;


    @Override
    public UserDetails loadUserByUsername(String employeeNo) throws UsernameNotFoundException {

    	AuthDTO emploayee = authMapper.findByUsername(employeeNo);

        if (emploayee != null) {
            return new CustomUserDetails(emploayee); // CustomUserDetails는 Spring Security에서 유저 세부 정보를 담는 객체
        }

        return null;
    }
}


/*
 * 
 * UserDetatilsService의 커스텀 구현체.
 * Spring Security는 로그인 시 입력받은 사용자 ID로 DB에서 유저 정보를 조회하고, 인증된 유저로 변환하는 과정을 이 클래스에서 처리함.
 * 
 * 
 */



