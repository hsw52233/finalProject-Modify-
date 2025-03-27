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
	
	// 테이블 출력
	Alpine.data('multicolumn', () => ({
	    datatable: null,
	    init() {
	        // AJAX 요청
	        $.ajax({
	            url: `http://${locations}:${ports}/academy/restapi/employeeList`,
	            type: 'GET',
	            dataType: 'json',
	            success: (data) => {
					this.datatable = new simpleDatatables.DataTable('#myTable', {
					    data: {
					        headings: ['이름', '사원번호', '전화번호', '소속팀', '직급'],
					        data: data.map(item => [
								[item[0], item[5]],	// 이미지파일 + 사원명
					            item[1], // 사원번호
					            item[2], // 전화번호
					            item[3], // 소속팀
					            item[4] // 직급
					        ])
					    },
					    searchable: true,
					    perPage: 10,
					    perPageSelect: [10, 20, 30, 50, 100],
						
					    columns: [
					        {
					            select: 0,
					            render: (data, cell, row) => {
									const [name, image] = data.split(','); 
									if(image == 'null.null') {
										return `
											<div class="flex items-center w-max">
												<img class="w-9 h-9 rounded-full ltr:mr-2 rtl:ml-2 object-cover" src="./images/defaultProfile.png" />
												<span>${name}</span>
											</div>
										`;
									} else {
										return `
											<div class="flex items-center w-max">
												<img class="w-9 h-9 rounded-full ltr:mr-2 rtl:ml-2 object-cover" src="./upload/${image}" />
												&nbsp;&nbsp;&nbsp;<span>${name}</span>
											</div>
										`;
									}
					            },
								sortable: true,
					        },
					    ],
					
	                    firstLast: true,
	                    firstText:
	                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>',
	                    lastText:
	                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>',
	                    prevText:
	                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>',
	                    nextText:
	                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>',
	                    labels: {
	                        perPage: '{select}',
	                    },
	                    layout: {
	                        top: '{search}',
	                        bottom: '{info}{select}{pager}',
	                    },
						
	                });
					
					// 행 클릭 이벤트
					document.querySelector('#myTable tbody').addEventListener('click', (e) => {
					    const rowElement = e.target.closest('tr'); // 클릭된 행의 인덱스.
					    if (rowElement) {
							const tdElements = rowElement.querySelectorAll('td');
							const employeeNo = tdElements[1].textContent; // 두번째 열 데이터 추출.
							window.location.href = `/academy/employeeOne?employeeNo=${employeeNo}`;
					    }
					});
	            },
	            error: (xhr, status, error) => {
	                console.error('Error:', error);
	            }
	        });
	    },
			
	    formatDate(date) {
	        if (date) {
	            const dt = new Date(date);
	            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
	            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
	            return dt.getFullYear() + '.' + month + '.' + day;
	        }
	        return '';
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
if (openModalButton) {
		openModalButton.addEventListener('click', () => {
	  	modalBackground.classList.remove('hidden');  // 모달 배경 보이기
	  	modalBackground.classList.add('block');     // 모달 배경 보이게 설정
	});
}


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

if (closeModalButton) closeModalButton.addEventListener('click', closeModal); // 닫기 버튼 클릭 시
if (cancelButton) cancelButton.addEventListener('click', closeModal);     // 취소 버튼 클릭 시

// 부서 선택
document.addEventListener("DOMContentLoaded", function(e) {
    // default
    var els = document.querySelectorAll(".employeeDepartment");
    els.forEach(function(select) {
        NiceSelect.bind(select);
    });
});

// 직급 선택
document.addEventListener("DOMContentLoaded", function(e) {
    // default
    var els = document.querySelectorAll(".employeePosition");
    els.forEach(function(select) {
        NiceSelect.bind(select);
    });
});
		

// 유효성 검사 
$('#employeeAddBtn').click(function() {
    let isVal = true;
 	// 이름 검사
    if ($('#employeeName').val().trim() === '') {
        $('.employeeName-error').show();
        $('#employeeName').addClass("errorInput");
        isVal = false;
    } else {
        $('.employeeName-error').hide();
        $('#employeeName').removeClass("errorInput");
    }
    
 	// 전화번호 검사
    if ($('#employeePhone').val().trim() === '') {
        $('.employeePhone-error').show();
        $('#employeePhone').addClass("errorInput");
        isVal = false;
    } else {
        $('.employeePhone-error').hide();
        $('#employeePhone').removeClass("errorInput");
    }

    // 이메일 검사
    if ($('#employeeMail').val().trim() === '') {
        $('#employeeMail').addClass("errorInput");
        $('.employeeMail-error').show();
        isVal = false;
    } else {
        $('.employeeMail-error').hide();
        $('#employeeMail').removeClass("errorInput");
    }
    
 	// 생년월일 검사
    if ($('#employeeBirth').val().trim() === '') {
        $('#employeeBirth').addClass("errorInput");
        $('.employeeBirth-error').show();
        isVal = false;
    } else {
        $('.employeeBirth-error').hide();
        $('#employeeBirth').removeClass("errorInput");
    }
 
 	// 주소 검사
    if ($('#employeeAddress').val().trim() === '' || $('#employeeAddressDetail').val().trim() === '' || $('#employeePostalCode').val().trim() === '') {
        $('#employeeAddress').addClass("errorInput");
        $('#employeeAddressDetail').addClass("errorInput");
        $('#employeePostalCode').addClass("errorInput");
        $('.employeeAddress-error').show();
        isVal = false;
    } else {
    	$('.employeeAddress-error').hide();
        $('#employeeAddressDetail').removeClass("errorInput");
        $('#employeePostalCode').removeClass("errorInput");
        $('#employeeAddress').removeClass("errorInput");
    }
 	
 	// 입사일 검사
    if ($('#employeeDate').val().trim() === '') {
        $('#employeeDate').addClass("errorInput");
        $('.employeeDate-error').show();
        isVal = false;
    } else {
        $('.employeeDate-error').hide();
        $('#employeeDate').removeClass("errorInput");
    }
 
 	// 프로필사진 검사
    if ($('#employeePhoto').val().trim() === '') {
        $('#employeePhotoFileNameDisplay').addClass("errorInput");
        $('.employeePhoto-error').show();
        isVal = false;
    } else {
        $('.employeePhoto-error').hide();
        $('#employeePhotoFileNameDisplay').removeClass("errorInput");
    }
 	
	// 부서 검사
    const $employeeDepartment = $('#employeeDepartment'); // 선택박스 참조
    const $niceSelectDepartment = $employeeDepartment.next('.nice-select'); // nice-select 참조
 	
 	// 부서 검사
    if ($('#employeeDepartment').val() === null) {
        $niceSelectDepartment.addClass("errorInput"); // 에러 클래스 추가
        $('.employeeDepartment-error').show();
        isVal = false;
    } else {
       $niceSelectDepartment.removeClass("errorInput"); // 에러 클래스 제거
       $('.employeeDepartment-error').hide();
    }
 
	const $employeePosition = $('#employeePosition'); // 선택박스 참조
	const $niceSelectPosition = $employeePosition.next('.nice-select'); // nice-select 참조
		
 	// 직급 검사
    if ($('#employeePosition').val() === null) {
        $('.employeePosition-error').show();
        $niceSelectPosition.addClass("errorInput"); // 에러 클래스 추가
        isVal = false;
    } else {
        $('.employeePosition-error').hide();
        $niceSelectPosition.removeClass("errorInput"); // 에러 클래스 제거
    }
 	
    // 폼 제출
    if (isVal) {
        console.log("submit 성공");
        $('#employeeAddForm').submit();
    }
});

