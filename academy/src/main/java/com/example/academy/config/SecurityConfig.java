package com.example.academy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // Spring security를 활성화하기 위해 
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // 비밀번호암호화하기 위해 
import org.springframework.security.web.SecurityFilterChain; // HTTP 요청 필터 체인을 구성하기 위해

@Configuration // 이 클래스가 Spring의 설정 클래스임을 나타냄
@EnableWebSecurity // Spring Security를 활성화하는 어노테이션. 보안 관련 설정을 커스텀할 수 있도록 해줌
public class SecurityConfig {
	
	// 단방향 암호화 메서드.
	@Bean // BCryptPasswordEncoder를 Bean으로 등록해서 필요할 때 주입받을 수 있도록 함.
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // BCryptPasswordEncoder로 빈 등록
    }
	
	// 권한 부여 메서드.
	@Bean // SecurityFilterChain을 Bean으로 등록해서 Spring Security의 Http 요청 보안 설정을 적용함.
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{ // HttpSecurity를 사용해 보안 설정을 정의하는 메서드.
        http.authorizeHttpRequests((auth) -> auth // authorizeHttpRequests -> Http 요청에 대한 접근 권한을 설정하는 메서드
        	.requestMatchers("/resources/**", "/static/**", "/css/**", "/js/**", "/images/**", "/upload/**", "/customjs/**").permitAll() // CSS, JS, 이미지 파일 접근 허용
        	 // 로그인 없이 접근 가능하도록 설정
            .requestMatchers("/login", "/loginProc", "/passwordReset", "/passwordSendMail").permitAll()
            // .requestMatchers("/all/**").hasAnyRole("management", "humanresources", "Administration") // 모든사원
            .requestMatchers("/management/**").hasRole("management") // 운영팀  ("management"역할을 가진 사용자만 접급 가능)
            .requestMatchers("/humanresources/**").hasRole("humanresources") // 인사팀
            .requestMatchers("/Administration/**").hasRole("Administration") // 행정팀
            
            //.anyRequest().permitAll()
            .anyRequest().authenticated() // 위에 등록되지 않은 경로는 로그인된 사원만 접근가능하도록 설정.(위에 URL을 제외한 나머지 요청들)
        );
        http
    	.formLogin((auth) -> auth.loginPage("/login") // 로그인 페이지 URL을 /login으로 지정
    				.loginProcessingUrl("/loginProc") // 로그인 처리 URL을 /loginProc으로 지정
    				.defaultSuccessUrl("/main", true)  // 로그인 성공 후 이동할 URL 설정. true 설정시 사용자가 직접 입력한 URL과 상관없이 항상 /main으로 이동.
    				.permitAll() // 로그인 페이지는 인증 없이 접근 가능
        )
		.logout((logout) -> logout
		        .logoutUrl("/logout") // 로그아웃 URL (기본값은 "/logout")
		        .logoutSuccessUrl("/login") // 로그아웃 성공 후 이동할 URL
		        .invalidateHttpSession(true) // 세션 무효화
		        // .deleteCookies("") // 로그아웃 시 삭제할 쿠키
		        .permitAll()
		);

        http.csrf((auth) -> auth.disable()); // 사이트 위변조 설정해제. (개발환경에서는 편의성을 위해 사용하지 않음)        
        return http.build(); // 설정이 완료된 HttpSecurity 객체를 SecurityFilterChain으로 반환.
    }
	// filterChain안에 설정한 기능들이 http 객체가 담고 있고 이걸 build()에서 SecurityFilterChatin으로 반환-> @Bean으로 등록됨.
	// 즉, SecurityFilterChain이 Spring에 등록되면서, Spring Security가 요청을 처리할 때 이 필터 체인을 자동으로 적용하게 됨.
	
	
	/*
	 * 이 SecurityConfig 클래스는 Spring Security를 사용하여 다음과 같은 보안 설정을 적용함:
		비밀번호 암호화 → BCryptPasswordEncoder
		정적 리소스 허용 → CSS, JS, 이미지 파일 접근 가능
		로그인/비밀번호 관련 페이지 허용
		역할(Role) 기반 접근 제어 → 특정 경로는 특정 역할을 가진 사용자만 접근 가능
		로그인 설정 → 로그인 성공 시 /main으로 이동
		로그아웃 설정 → 로그아웃 후 /login으로 이동, 세션 무효화
		CSRF 보호 비활성화 (개발 환경에서만 추천)
	 * 
	 * 
	 */
}
