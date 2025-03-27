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
	
	// 사원 등록 생년월일
	document.addEventListener('DOMContentLoaded', function () {
	    const beginDateInput = document.getElementById('beginDate');
	    const endDateInput = document.getElementById('endDate');

	    // Flatpickr 초기화 - 종강일 
	    const endDatePicker = flatpickr(endDateInput, {
	        dateFormat: 'Y-m-d',
	        clickOpens: false, // 초기에는 비활성화
	    });

	    // Flatpickr 초기화 - 개강일
	    flatpickr(beginDateInput, {
	        dateFormat: 'Y-m-d',
	        onChange: (selectedDates) => {
				
	            if (selectedDates.length > 0) {
	                const selectedDate = selectedDates[0];

	                // 종강일 캘린더 활성화 및 최소 날짜 설정
	                endDateInput.disabled = false;
	                endDatePicker.set('minDate', selectedDate); // 최소 날짜 설정
	                endDatePicker.set('clickOpens', true); // 달력 활성화
	            } else {
	                // 개강일 선택 해제 시 종강일 초기화 및 비활성화
	                endDatePicker.clear();
	                endDateInput.disabled = true;
	                endDatePicker.set('clickOpens', false); // 달력 비활성화
	            }
	        },
	    });

	    // 초기 상태에서 종강일 비활성화
	    endDateInput.disabled = true;
	});
});


// 모달 열기
if(openModalRejectReason){
	openModalRejectReason.addEventListener('click', () => {
		modalBackgroundRejectReason.classList.remove('hidden');	// 모달 배경 보이기
		modalBackgroundRejectReason.classList.add('block');		// 모달 배경 보이게 설정
	});
}

// 모달 닫기
const closeModal = () => {
	modalBackgroundRejectReason.classList.remove('block');	
	modalBackgroundRejectReason.classList.add('hidden');		// 모달 배경 숨기기
	// 모달 내부의 입력 필드를 초기화
	const form = document.getElementById('addRejectForm');
	form.reset();
	$('textarea').removeClass('textarea-error');
	// 모든 에러 라벨 숨기기
	$('.error-label').hide();
};

if (closeModalButtonRejectReason) closeModalButtonRejectReason.addEventListener('click', closeModal); // 닫기 버튼 클릭 시
if (cancelButton) cancelButton.addEventListener('click', closeModal);

// 유효성 검사
$('#checkRejectReason').click(function() {
	let isVal = true;
	
	// 반려사유 검사
	if ($('#rejectReason').val().trim() === '') {
        $('.rejectReason-error').show();
        $('#rejectReason').addClass("textarea-error");
        isVal = false;
    } else {
        $('.rejectReason-error').hide();
        $('#rejectReason').removeClass("textarea-error");
    }
	
	// 폼 제출
	if(isVal){
		$('#addRejectForm').submit();
	}
});

// 승인버튼 클릭시
$('#agreeBtn').click(function() {
	
	const stampFileVal = $('.stampFile').val();
	console.log('stampFileVal : ', stampFileVal);  // 크기 출력 로그
	
	if(!stampFileVal){	// 값이 없다면 (null, undefined, "")
		// 도장 없는 경우 모달 열기
		modalBackgroundNonStamp.classList.remove('hidden');	// 모달 배경 보이기
		modalBackgroundNonStamp.classList.add('block');		// 모달 배경 보이게 설정
	} else{ // 값이 있다면
		$('#agreeForm').submit();	// 폼제출
	}
	
});

// 승인 시 도장이 없는 경우 모달 관련 DOM 요소
const closeModalButtonNonStamp = document.getElementById('closeModalButtonNonStamp');
const modalBackgroundNonStamp = document.getElementById('modalBackgroundNonStamp');
const modalWrapperNonStamp = document.getElementById('modalWrapperNonStamp');
const checkNonStamp = document.getElementById('checkNonStamp');
// 모달 닫기
const closeModalNonStamp = () => {
	  modalBackgroundNonStamp.classList.remove('block');
	  modalBackgroundNonStamp.classList.add('hidden');  // 모달 배경 숨기기
};
if (closeModalButtonNonStamp) closeModalButtonNonStamp.addEventListener('click', closeModalNonStamp); // 닫기 버튼 클릭 시
if (checkNonStamp) checkNonStamp.addEventListener('click', closeModalNonStamp);     // 확인 버튼 클릭 시

