package com.example.academy;

import org.springframework.boot.SpringApplication; // Spring Boot 애플리케이션을 실행하는 데 사용하는 SpringApplication 클래스를 가져옴
import org.springframework.boot.autoconfigure.SpringBootApplication; // @SpringBootApplication 어노테이션을 사용하기 위해 필요함
import org.springframework.scheduling.annotation.EnableScheduling; // @EnableScheduling 어노테이션을 사용하기 위해 필요함. 스프링에서 스케줄링 기능을 활성화하는 역할을 함
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry; // 정적 리소스를(이미지,파일 등)의 핸들링을 위한 ResourceHandlerRegistry 클래스를 가져옴
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;// Spring MVC 설정을 커스텀하기 위한 WebMvcConfigurer 인터페이스를 가져옴

@SpringBootApplication // 현재 클래스가 스프링 부트 애플리케이션의 진입점임을 나타냄. 자동 설정 및 Bean 스캔을 활성화함
@EnableScheduling // 스케줄러 기능 활성화. @Scheduled 어노테이션을 사용하여 주기적인 작업을 실행할 수 있다.
public class AcademyApplication implements WebMvcConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(AcademyApplication.class, args); // 스프링부트 애플리케이션을 시작함
	}
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/upload/**").addResourceLocations("file:/home/ubuntu/apache-tomcat-10.1.34/webapps/upload"); // 리눅스 OS
	} // 리눅스 서버 환경에서 업로드된 파일을 정적 리소스로 제공할 때 사용됨

}

/*
 * 스프링 부트 애플리케이션을 실행하고,
 * 스케줄링 기능을 활성화하며,/upload/경로로 들어오는 요청을 특정 서버 디렉토리에 매핑하는 역할을 함.
 */
 

