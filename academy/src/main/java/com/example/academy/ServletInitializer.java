package com.example.academy;

import org.springframework.boot.builder.SpringApplicationBuilder; 
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class ServletInitializer extends SpringBootServletInitializer { // War 파일로 패키징해서 외부 톰캣 같은 서블릿 컨테이너에 배포할 때는 SpringBootServletinitializer를 사용해야함

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) { // 외부 WAS에서 실행될 때 어떤 클래스를 실행할지 정의함.
		return application.sources(AcademyApplication.class); // AcademyApplication.class를 애플리케이션 시작점으로 설정. 즉,외부 WAS에서도 AcademyApplication이 실행되도록 함.
	}

}


/*ServletInitializer 클래스의 역할:
  Spring Boot 애플리케이션을 WAR 파일로 패키징하여 외부 WAS(톰캣, JBoss 등) 에 배포할 수 있도록 설정.
  SpringBootServletInitializer를 상속하고, configure() 메서드를 오버라이드하여 애플리케이션의 시작 클래스를 설정.
*/