document.addEventListener('alpine:init', () => {
    // main section
    Alpine.data('scrollToTop', () => ({
        showTopButton: false,
        init() {
            window.onscroll = () => {
                this.scrollFunction();
            };
        },

        scrollFunction() {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                this.showTopButton = true;
            } else {
                this.showTopButton = false;
            }
        },

        goToTop() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        },
    }));

    // theme customization
    Alpine.data('customizer', () => ({
        showCustomizer: false,
    }));

    // sidebar section
    Alpine.data('sidebar', () => ({
        init() {
            const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
            if (selector) {
                selector.classList.add('active');
                const ul = selector.closest('ul.sub-menu');
                if (ul) {
                    let ele = ul.closest('li.menu').querySelectorAll('.nav-link');
                    if (ele) {
                        ele = ele[0];
                        setTimeout(() => {
                            ele.click();
                        });
                    }
                }
            }
        },
    }));

    // header section
    Alpine.data('header', () => ({
		notifications: [],  // 빈 배열로 초기화
			    employeeNo: employeeNo,  // 예시로 직원 번호를 하드코딩했지만, 실제 값에 맞게 설정

			    // 알림 데이터를 가져오는 함수
			    loadNotifications() {
			        $.ajax({
			            url: `http://${locations}:${ports}/academy/restapi/newNoticeList`,  // REST API 엔드포인트
			            contentType: 'application/json',
			            type: 'POST',
			            data: JSON.stringify(this.employeeNo),  // this.employeeNo를 사용해 보내기
			            success: (data) => {
			                // 서버에서 받은 데이터를 notifications 배열 형식으로 변환
			                this.notifications = data.map(item => ({
			                    id: item.noticeNo,  // 알림 ID
			                    message: `<span class="text-sm mr-1">${item.noticeContent}</span>`,  // 메시지
			                    time: item.createDate,  // 시간
			                }));
			                console.log(this.notifications);  // 확인용
			            },
			            error: () => {
			                alert("알림을 불러오는 중 오류가 발생했습니다.");
			            }
			        });
			    },

			    // 초기화 시 알림을 로드하는 함수
			    init() {
			        this.loadNotifications();  // 알림 목록 로드
			    }
    }));
	
	Alpine.data('contacts', () => ({
		editUser(user) {
            this.params = this.defaultParams;
            if (user) {
                this.params = JSON.parse(JSON.stringify(user));
            }

            this.addContactModal = true;
        },
	}));
	
	
	// 신청 시작날짜 캘린더
	Alpine.data("form1", () => ({
        init() {
            const defaultDate1 = document.getElementById('beginDate').value;
			// Flatpickr 초기화
            flatpickr(document.getElementById('beginDate'), {
                dateFormat: 'Y-m-d',	// 날짜 형식 설정 (예: 2025-01-08)
                //defaultDate: defaultDate1, // 기본값 설정 
            });
        },
    }));
	
	// 신청 종료날짜 캘린더
	Alpine.data("form2", () => ({
        init() {
            const defaultDate1 = document.getElementById('endDate').value;
			// Flatpickr 초기화
            flatpickr(document.getElementById('endDate'), {
                dateFormat: 'Y-m-d',	// 날짜 형식 설정 (예: 2025-01-08)
                //defaultDate: defaultDate1, // 기본값 설정 
            });
        },
    }));
	
	
});

// 파일 크기 단위까지 포함해서 출력
window.addEventListener('DOMContentLoaded', (event) => {
		// DOM이 완전히 로드된 후 렌더링이 완료되었을 때 파일 크기 처리
	   setTimeout(() => {
	       // 1. 모든 파일 목록 가져오기
	       document.querySelectorAll('[id^="fileSize"]').forEach(fileElement => {
	           const fileNo = fileElement.id.replace('fileSize', ''); // id가 fileSize1, fileSize2이므로 fileSize 제거하고 번호만 추출
	           const fileSize = parseInt(fileElement.value, 10); // 파일 크기 값 가져오기 (정수로 변환)
	           console.log('원래 fileSize:', fileSize);  // 크기 출력 로그
	
	           // 2. 단위 포함해서 크기 계산
	           let size = '';
	           if (fileSize < 1000000) {
	               size = Math.floor(fileSize / 1000) + 'KB';
	           } else {
	               size = Math.floor(fileSize / 1000000) + 'MB';
	           }
	           console.log('파일 size:', size);  // 크기 출력 로그
	
	           // 3. 계산된 size html에 출력
	           const fileSizePrElement = document.getElementById(`fileSizePr${fileNo}`);
	           if (fileSizePrElement) {
	               fileSizePrElement.textContent = size;
	           } else {
	               console.error(`fileSizePr${fileNo} 요소를 찾을 수 없습니다.`);
	           }
	       });
	   }, 100);  // 100ms 지연 후 실행 (필요에 따라 조정 가능)
	
});

// 밑에부터 모달관련
// 신청서 삭제확인 모달 관련 DOM 요소
const closeModalButtonDelApproval = document.getElementById('closeModalButtonDelApproval');
const cancelButtonDelApproval = document.getElementById('cancelButtonDelApproval');
const modalBackgroundDelApproval = document.getElementById('modalBackgroundDelApproval');
const modalWrapperDelApproval = document.getElementById('modalWrapperDelApproval');
const checkDelApproval = document.getElementById('checkDelApproval');
const delBtn = document.getElementById('delBtn');

// 모달 닫기
const closeModalDelApproval = () => {
	  modalBackgroundDelApproval.classList.remove('block');
	  modalBackgroundDelApproval.classList.add('hidden');  // 모달 배경 숨기기
};

if (closeModalButtonDelApproval) closeModalButtonDelApproval.addEventListener('click', closeModalDelApproval); // [x] 버튼 클릭 시
if (cancelButtonDelApproval) cancelButtonDelApproval.addEventListener('click', closeModalDelApproval); // [x] 버튼 클릭 시

// attendanceApprovalNo값 받아오기
const attendanceApprovalNo = document.getElementById('attendanceApprovalNo').value;

// 삭제버튼 클릭시
delBtn.addEventListener('click', () => {
	modalBackgroundDelApproval.classList.toggle('hidden', false);
	modalBackgroundDelApproval.classList.toggle('block', true);
});

// 삭제 안내 모달 [확인]버튼 클릭시
if (checkDelApproval) {
	checkDelApproval.addEventListener('click', () => {
		// 모달 닫기
		modalBackgroundDelApproval.classList.remove('block');
		modalBackgroundDelApproval.classList.add('hidden');  // 모달 배경 숨기기
		
		// AJAX 요청 보내기
		$.ajax({
			url:'removeAttendanceApproval',	// 매핑주소
			type: 'GET',	// GET 요청
			data: {attendanceApprovalNo: attendanceApprovalNo // 서버로 전송할 데이터	
			},	
			success: (redirectUrl) => {
				console.log('컨트롤러 실행 완료'); // 성공 로그
				// 서버에서 응답으로 전달된 URL로 이동
				console.log("서버에서 받은 URL:", redirectUrl); // 반환값 확인
				window.location.href = redirectUrl;
			},
			error: (xhr, status, error) => {
			        console.error('오류 발생:', error); // 실패 로그
			}
		});
	
	});
}	

