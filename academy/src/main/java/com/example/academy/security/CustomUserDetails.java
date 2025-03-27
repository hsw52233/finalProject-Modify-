package com.example.academy.security;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.academy.dto.AuthDTO;

public class CustomUserDetails implements UserDetails {

    private AuthDTO employee; // DB에서 가져온 사원 정보를 담고 있다.

    public CustomUserDetails(AuthDTO employee) {
        this.employee = employee;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collection = new ArrayList<>(); // 권한(Role)을 나타냄. Spring Security에서 권한 체크할 때 사용됨.

        collection.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {
            	return "ROLE_" + employee.getEmployeeRole(); // 권한명 앞에 ROLE_ 접두사를 추가해야 필터체인 정상작동.
            }
        });
        return collection;
    }
    
    // 부서 정보
    public String getUserDepartment() {
        return employee.getEmployeeDepartment();
    }
    
    // 직책 정보
    public String getUserPosition() {
        return employee.getEmployeePosition();
    }
    
    // 프로필사진 이름 정보
    public String getUserPhotoFileName() {
        return employee.getPhotoFileName();
    }
    
    // 프로필사진 확장자 정보
    public String getUserPhotoFileExt() {
        return employee.getPhotoFileExt();
    }
    // 이메일 정보
    public String getUserMail() {
        return employee.getEmployeeMail();
    }
    
    // 이름 정보
    public String getUserRealName() {
        return employee.getEmployeeName();
    }
    
    // 권한 정보
    public String getUserRole() {
        return employee.getEmployeeRole();
    }
    
    // 비밀번호 정보
    @Override
    public String getPassword() {
        return employee.getEmployeePw();
    }

    // 사원번호 정보
    @Override
    public String getUsername() {
    	return employee.getEmployeeNo().toString();
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

/*
 * CustomUserDetails클래스는 Spring Security에서 인증된 사용자 정보를 담아두는 UserDetails 구현체야.
 * Spring Security에서 유저 정보를 세션에 저장하고 접근할 때, 이 객체를 통해 유저 세부 정보를 가져오도록 하는 역할을 함.
 * SecurityContextHolder.getContext().getAuthentication()을 통해 유저 정보 접근.
 * 
 * 
 */



