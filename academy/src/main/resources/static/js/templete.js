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
	
	// 사원 등록 생년월일
	Alpine.data("form", () => ({
		date1: new Date().toISOString().split('T')[0],
        date2: new Date().toISOString().split('T')[0],
        init() {
            // 생년월일
            const defaultDate1 = document.getElementById('employeeBirth').value || this.date1;
            flatpickr(document.getElementById('employeeBirth'), {
                dateFormat: 'Y-m-d',
                //defaultDate: defaultDate1,
            });

            // 입사일
            const defaultDate2 = document.getElementById('employeeDate').value || this.date2;
            flatpickr(document.getElementById('employeeDate'), {
                dateFormat: 'Y-m-d',
                //defaultDate: defaultDate2,
            });
        },
    }));
});

// 모달 관련 DOM 요소
const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.getElementById('closeModalButton');
const modalBackground = document.getElementById('modalBackground');
const modalWrapper = document.getElementById('modalWrapper');
const cancelButton = document.getElementById('cancelButton');

// 모달 열기
openModalButton.addEventListener('click', () => {
  modalBackground.classList.remove('hidden');  // 모달 배경 보이기
  modalBackground.classList.add('block');     // 모달 배경 보이게 설정
});

// 모달 닫기
const closeModal = () => {
  modalBackground.classList.remove('block');
  modalBackground.classList.add('hidden');  // 모달 배경 숨기기
  // 모달 내부의 모든 입력 필드를 초기화
  const form = document.getElementById('employeeAddForm');
  form.reset(); // 모든 입력 필드와 라디오 버튼 초기화
  $('input').removeClass('errorInput');
  // 모든 에러 라벨 숨기기
  $('.error-label').hide();
};

closeModalButton.addEventListener('click', closeModal); // 닫기 버튼 클릭 시
cancelButton.addEventListener('click', closeModal);     // 취소 버튼 클릭 시


