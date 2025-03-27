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
	
	
	
});

// 강의삭제 모달 관련 DOM 요소
const openModalButtonLectureDelete = document.getElementById('openModalButtonLectureDelete');		// 강의상세페이지 [삭제]버튼
const closeModalButtonLectureDelete = document.getElementById('closeModalButtonLectureDelete');		// 삭제모달 [x]버튼
const modalBackgroundLectureDelete = document.getElementById('modalBackgroundLectureDelete');
const modalWrapperLectureDelete = document.getElementById('modalWrapperLectureDelete');
const cancelButtonLectureDelete = document.getElementById('cancelButtonLectureDelete');		// 삭제모달 [취소]버튼

// 강의삭제 모달 열기
openModalButtonLectureDelete.addEventListener('click', () => {
  modalBackgroundLectureDelete.classList.remove('hidden');  // 모달 배경 보이기
  modalBackgroundLectureDelete.classList.add('block');     // 모달 배경 보이게 설정
});

// 강의삭제 모달 닫기
const closeModalLectureDelete = () => {
  modalBackgroundLectureDelete.classList.remove('block');
  modalBackgroundLectureDelete.classList.add('hidden');  // 모달 배경 숨기기
  
};

closeModalButtonLectureDelete.addEventListener('click', closeModalLectureDelete); // [x]버튼 클릭 시
cancelButtonLectureDelete.addEventListener('click', closeModalLectureDelete);     // 취소 버튼 클릭 