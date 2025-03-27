# **학원 그룹웨어 프로젝트 📚**  
## 개요 📝
- **Spring Boot**기반으로 **MySQL**과 **MyBatis**를 활용하여 제작한 학원 그룹웨어 시스템.
- 강의 관리, 근태 관리, 결재 관리 기능을 중심으로 시스템을 개발. 🎯
- 2025/01/02부터 2025/02/11까지 해당 프로젝트를 진행.

<br>

## 주요기능 💡
### 로그인 🔑
<img width="100%" alt="로그인" src="https://github.com/user-attachments/assets/18220e6c-bb0d-4af6-8128-104e2853f316" /><br>
- 사용자는 사원번호와 비밀번호를 입력해야 합니다.
- 올바른 인증 정보 입력 시 메인 페이지로 이동합니다. ✔️
- 사원번호를 브라우저 쿠키에 저장하여 이후 로그인 시 자동 입력 가능합니다. 🍪
---
### 비밀번호 찾기 🕵️‍♀️
<img width="1470" alt="비밀번호찾기" src="https://github.com/user-attachments/assets/e8d21f90-3247-4736-8967-85d8f064defe" /><br>
- 등록된 이메일을 입력하면 무작위 임시 비밀번호 8자리가 메일을 통해 발급되고, 이를 통해 로그인할 수 있습니다. 📧
- 비밀번호변경기능을 활용해 사용하고 싶은 비밀번호로 변경이 가능합니다.
---
### 메인 페이지 🏠
![메인](https://github.com/user-attachments/assets/e326d115-708b-4796-88fc-9fbe054441d3)<br>
- 현재 시각을 표시하며 출퇴근 시간을 등록할 수 있습니다. 🕓
- 근태 정보, 연차 정보를 확인할 수 있고, 월별 근무 시간 그래프를 확인할 수 있습니다. 📊
- OpenWeather API를 통해 근무지의 실시간 날씨를 확인할 수 있습니다. 🌤️
- 최근 5개의 공지사항과 미결재 목록을 확인할 수 있습니다. 📢
---
### 주소록 📇
![주소록](https://github.com/user-attachments/assets/946ed0e5-3ce5-4efe-ae7e-03203be971e5)<br>
- 사원 정보를 검색하고 정렬할 수 있는 테이블을 제공합니다. 🔍
- 페이지 이동 및 행 수 선택 기능이 제공되어 편리하게 주소록을 탐색할 수 있습니다. 📄
---
### 사원 등록 📝
<img width="1470" alt="사원등록" src="https://github.com/user-attachments/assets/b6efe079-35e7-4044-9519-d95389189dbe" /><br>
- 인사팀 권한을 가진 사원만 사원 등록을 할 수 있습니다. 👥
- 사원 정보, 부서, 직책, 주소 등을 입력해야 하며, 주소 입력은 Kakao 주소 API를 사용합니다. 📍
- 사원등록을 하면 초기비밀번호는 '1234'로 설정이되며, 추가된 사원은 비밀번호변경기능을 통해 자신의 비밀번호로 수정을 해야합니다.
---
### 사원 상세 페이지 🔍
![주소록상세](https://github.com/user-attachments/assets/b6e85513-759f-4e30-9ed1-7002c59a9a5c)<br>
- 좌측에는 사원의 개인정보를 확인할 수 있고, 우측에는 FullCalendar API를 사용하여 해당 사원의 일정정보(회의, 강의, 휴가 등)를 확인할 수 있습니다. 📅
- 본인 사원 상세페이지(마이페이지)에는 비밀번호변경, 개인정보수정을 할 수 있습니다.
---
### 근태 결재 📝
<img width="1470" alt="근태결재신청" src="https://github.com/user-attachments/assets/ed6489a8-1041-48b4-8fbf-c21bc28517cf" /><br>
- 연차, 반차, 병가, 공가를 신청할 때 필요한 결재를 신청할 수 있습니다.
- 결재신청할 때는 신청날짜선택, 신청내용입력, 파일첨부 및 결재선설정을 할 수 있습니다. 📎
- 결재선설정은 1명부터 3명까지 자유롭게 설정할 수 있으며, 위쪽에 배치되어있는 사원부터 결재가 차례대로 진행이 됩니다.
- 연차 신청 시 잔여 연차를 초과하면 결재가 진행되지 않습니다. ⛔
---
### 강의 결재 📝
<img width="1470" alt="강의결재신청" src="https://github.com/user-attachments/assets/bc05feb4-acd9-4cdf-8d24-df3d4d19c6d7" /><br>
- 강의를 개설하고자 할 때 필요한 결재를 신청할 수 있습니다. ⏰
- 결재신청할 때는 신청날짜선택, 신청시간선택, 강의실선택, 강의내용입력, 신청내용입력, 파일첨부 및 결재선설정을 할 수 있습니다. 📎
- 결재선설정은 1명부터 3명까지 자유롭게 설정할 수 있으며, 위쪽에 배치되어있는 사원부터 결재가 차례대로 진행이 됩니다. 🔄
- 이미 등록되어있는 강의시간이나 신청이 진행중인 강의시간은 선택할 수 없으며, 잘못된 강의시간이 입력되지 않도록 다양한 유효성기능을 제공합니다.
---
### 강의 관리 🎓
<img width="1470" alt="강의목록" src="https://github.com/user-attachments/assets/0fa47260-5826-45ff-b5a4-b90b473a3334" /><br>
- 행정팀 권한을 가진 사원만 결재된 강의를 수정할 수 있습니다. ✏️
- 강사, 강의실, 강의제목, 강의내용, 강의시간 등 강의에 대한 모든 정보를 수정할 수 있습니다.
- 강의시간은 이미 등록되어있는 강의시간이나 신청이 진행중인 강의시간은 선택할 수 없지만, 수정 중인 강의의 강의시간은 선택할 수 있습니다.
- 잘못된 강의시간이 입력되지 않도록 다양한 유효성기능을 제공합니다.
---
### 게시판 📝
<img width="1469" alt="게시판" src="https://github.com/user-attachments/assets/939aab37-0a0d-48b8-981c-28c89dc475d9" /><br>
- 게시판선택, 게시물제목입력, 게시물내용입력, 게시물고정, 파일첨부를 할 수 있습니다.
- Quill Editor API를 통해서 게시물내용을 다양한 글꼴모양, 다양한 글꼴크기, 다양한 글꼴색상을 활용할 수 있습니다.
- 공지사항 게시판은 고정적으로 존재하며, 게시판을 새로 개설하거나 삭제할 수 있습니다.


***
### 메시지 및 채팅 💬
![채팅](https://github.com/user-attachments/assets/56cf9a62-7452-4bd2-a248-367480befb81)
- 실시간 채팅 기능을 통해 사원들과 1:1 의사소통할 수 있습니다. 📱
- 읽지 않은 메시지는 사원 이름 옆에 알림 수가 표시되며, 채팅방에서 실시간으로 대화가 가능합니다. 🔔

***
### 근태 관리 🌴
<img width="1470" alt="출근관리" src="https://github.com/user-attachments/assets/0103f08c-af16-48bf-9563-1f929b84422c" /><br>
- 월별로 로그인된 사원의 근태정보(정상출근, 결근 등)를 확인할 수 있으며, 그래프로 총 근무시간을 시각적으로 볼 수 있습니다. 📅📉
***
### 연차 관리 🌴
<img width="1470" alt="연차정보페이지" src="https://github.com/user-attachments/assets/9e933045-bde7-4758-8906-f99c69e49de7" /><br>
- 월별로 승인된 연차를 확인할 수 있으며, 그래프로 사용한 연차를 시각적으로 볼 수 있습니다. 📅📉
***
### 회의실 예약 🏢
<img width="1470" alt="회의목록" src="https://github.com/user-attachments/assets/be533740-98a0-4292-8c02-ed830b314061" /><br>
- Full Calendar API를 활용하여 예약목록을 확인할 수 있습니다.
- 예약을 신청할 때는 회의실선택, 예약날짜선택, 예약시간선택, 회의제목입력, 회의내용입력, 참여인원선택을 할 수 있습니다. 🗓️
- 이미 등록되어있는 회의시간은 선택할 수 없습니다.
- 예약자는 해당 예약을 수정하거나 삭제할 수 있으며, 다른 사원이 등록한 예약은 수정이나 삭제를 할 수 없습니다. 🔒
***
### 근태 등록/ 근태확정  스케줄러 ⏰
- 매일 00시에 모든 사원의 근태 데이터가 자동 생성되며, 데이터 생성 당일에 근태신청서가 있는 사원은 근태신청서에 적힌 근태유형(연차, 병가, 공가 등)으로 변경됨. 🔄
- 매일 23:59에 출퇴근 기록과 근태 유형이 없는 사원은 결석으로 처리되며, 주말에는 휴일로 처리됩니다. 📆

<br><br>

## 데이터베이스 구조 💾
![academy](https://github.com/user-attachments/assets/bee00497-0c29-4a5c-92d4-da495ce508d6)<br>  
📄 [ERD CLOUD 보러가기](https://www.erdcloud.com/d/2K3qNBC8u2kbMX8Lk)  

<br><br>

## 사용된 기술 스택 💻
| **분류**          | **기술 및 도구** |
|------------------|---------------------------------------------------------------|
| 🌐 **백엔드**     | ![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) ![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white) ![MyBatis](https://img.shields.io/badge/MyBatis-000000?style=for-the-badge&logo=&logoColor=white) ![Apache Tomcat](https://img.shields.io/badge/Tomcat-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=black) |
| 🎨 **프론트엔드** | ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white) |
| 📜 **템플릿 엔진** | ![Thymeleaf](https://img.shields.io/badge/Thymeleaf-005F0F?style=for-the-badge&logo=thymeleaf&logoColor=white) |
| 💾 **데이터베이스** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![MySQL Workbench](https://img.shields.io/badge/MySQL%20Workbench-4479A1?style=for-the-badge&logo=mysql&logoColor=white) |
| 🤝 **협업 및 디자인** | ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white) ![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=google-drive&logoColor=white) |
| 🔧 **개발 도구**   | ![STS](https://img.shields.io/badge/Spring%20Tool%20Suite-6DB33F?style=for-the-badge&logo=spring&logoColor=white) ![ERD Cloud](https://img.shields.io/badge/ERD%20Cloud-005FCC?style=for-the-badge&logoColor=white) ![FileZilla](https://img.shields.io/badge/FileZilla-BF0000?style=for-the-badge&logo=filezilla&logoColor=white) |

<br><br>

## 프로젝트 설계 문서 📑 
| 문서이름       | 문서툴              | 링크                                                                 |
|----------------|---------------------|----------------------------------------------------------------------|
| 기능 요구사항 정의서 | ![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=google-drive&logoColor=white) |[보러가기](https://docs.google.com/spreadsheets/d/1gGca0uRlSDLVAm9M9VOJv_4-IwDch2k5BVnrTimr2-k/edit?usp=sharing)|
| 테이블 요구사항 정의서 | ![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=google-drive&logoColor=white) |[보러가기](https://docs.google.com/spreadsheets/d/1sVAALbD1u538aRXUgKcvdULasvhgFWJBEMSuuAwxg-w/edit?usp=sharing)|
| 화면설계서     | ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white) |[보러가기](https://www.figma.com/design/Vc4psYCSXfQMj57Ji53wMM/figma?node-id=0-1&t=fAosbIlqz8wkW7Qx-1)|

<br><br>

## 팀 정보 🧑‍🤝‍🧑
| **이름** | **GitHub** | **담당 역할** |
|----------|-----------|--------------|
| 👨‍💻 **진수우**  | [https://github.com/orukdoline](https://github.com/orukdoline) | 로그인 기능, 주소록 기능, 강의결재 기능 |
| 👩‍💻 **김혜린**  | [https://github.com/hyerin716](https://github.com/hyerin716) | 근태결재 기능, 강의관리 기능 |
| 👩‍💻 **박시현**  | [https://github.com/Hyuns99](https://github.com/Hyuns99) | 회의실예약 기능, 강의실관리 기능 |
| 👨‍💻 **조세영**  | [https://github.com/seyoung512](https://github.com/seyoung512) | 근태관리 기능, 게시판 기능 |
| 👨‍💻 **하상우**  | [https://github.com/hsw52233](https://github.com/hsw52233) | 채팅 기능, 회의실관리 기능 |

<br><br>

## 설치 방법 ⚙️
1. **데이터베이스 설정**  
 - [여기](https://drive.google.com/file/d/17OUra5EzRRnyzsZAxfktDzymbBt9tjb_/view?usp=sharing)에서 sql파일을 다운로드 받아 쿼리문을 MySQL에서 실행시켜 데이터베이스를 구축.
2. **프로젝트 실행**  
 - 'src/main/resources' 경로에 [application-db](https://drive.google.com/file/d/1hesSD3dLRiLO8sjO2pJfjkEgsqXABoL4/view?usp=sharing), [application-mail](https://drive.google.com/file/d/1mIwvzvLb7RaT8-ZsaN3KDENNRqDaL7Aw/view?usp=sharing), [application-port](https://drive.google.com/file/d/1-bYM8n7ti_tzInjSa1I3fW2RC3chL78M/view?usp=sharing) 파일을 추가.
 - Spring Tool Suite에서 프로젝트를 실행.
 - 브라우저에서 `http://localhost/academy/login`으로 접속.
3. **로그인 진행**
- 로그인페이지에서 92(인사팀), 99(운영팀), 101(행정팀) 중 하나를 사원번호 입력칸에 입력.
- 1234를 비밀번호 입력칸에 입력.
<br>
