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
			    employeeNo: userNo,  // 예시로 직원 번호를 하드코딩했지만, 실제 값에 맞게 설정

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
        init() {
            // 생년월일
            const defaultDate1 = document.getElementById('employeeBirth').value || this.date1;
            flatpickr(document.getElementById('employeeBirth'), {
                dateFormat: 'Y-m-d',
                //defaultDate: defaultDate1,
            });
        },
    }));
	
	Alpine.data('calendar', () => ({
        defaultParams: {
            id: null,
            title: '',
            start: '',
            end: '',
            description: '',
            type: 'primary',
        },
        params: {
            id: null,
            title: '',
            start: '',
            end: '',
            description: '',
            type: 'primary',
        },
        isAddEventModal: false,
        minStartDate: '',
        minEndDate: '',
        calendar: null,
        now: new Date(),
        events: [],
        init() {
			// AJAX 요청
	        $.ajax({
	            url: `http://${locations}:${ports}/academy/restapi/calendarList/${employeeNo}`,
	            type: 'GET',
	            dataType: 'json',
				success: (data) => {
					this.events = data.map(event => {
							//console.log(event.calendarClassName)
					        if (event.calendarClassName === 'success') {
					            return {
									start: `${event.rrule.dtstart}T${event.rrule.byweekday[0]?.startTime}`,  // 시작 시간
									end: `${event.rrule.until}T${event.rrule.byweekday[0]?.endTime}`,  // 종료 시간
									title: event.calendarTitle,
									className: event.calendarClassName || 'default-class',
									description: event.calendarDescription || '상세내용 없음',
									rrule: {
									    freq: event.rrule.freq || 'weekly',  // 주기 설정 (기본값: weekly)
									    interval: event.rrule.interval || 1,  // 반복 간격 (기본값: 1)
									    byweekday: event.rrule.byweekday.map(dayInfo => dayInfo.day) || [],  // 요일 정보
									    dtstart: `${event.rrule.dtstart}T${event.rrule.byweekday[0]?.startTime}`, // 시작 날짜와 시간
									    until: `${event.rrule.until}T${event.rrule.byweekday[0]?.endTime}`,  // 종료 날짜와 시간
									},
									extendedProps: {
										title: event.calendarTitle,
										beginTimeCode : event.rrule.byweekday[0]?.startTime,
										endTimeCode : event.rrule.byweekday[0]?.endTime,
					                    description: event.calendarDescription || '상세내용 없음',
									},
					            };
					        } else if (event.calendarClassName === 'primary') {
					            return {
					                title: event.calendarTitle,
					                start: `${event.calendarDate}T${event.calendarStart}:00`,  // 시작 시간
					                end: `${event.calendarDate}T${event.calendarEnd}:00`,  // 종료 시간
					                className: event.calendarClassName || 'default-class',
					                description: event.calendarDescription || '상세내용 없음',
									extendedProps: {
										title: event.calendarTitle,
										beginTimeCode : event.calendarStart,
										endTimeCode : event.calendarEnd,
					                    description: event.calendarDescription || '상세내용 없음',
					                }
					            };
					        } else {
								return {
					                title: event.calendarTitle,
					                start: `${event.calendarBeginDate}T00:00:00`,  // 시작 시간
					                end: `${event.calendarEndDate}T00:00:00`,  // 종료 시간
					                className: event.calendarClassName || 'default-class',
					            };
							}
					    });
					
					
		            var calendarEl = document.getElementById('calendar');
					const handleDayCellContent = (arg) => {
					    // 숫자 부분만 추출
					    const dayNumber = arg.dayNumberText.replace("일", ""); 
					    return { html: `<span class="d-block p-2">${dayNumber}</span>` }; // 숫자만 반환
					};
		            this.calendar = new FullCalendar.Calendar(calendarEl, {
		                initialView: 'dayGridMonth',
		                headerToolbar: {
		                    left: 'prev,next today',
		                    center: 'title',
		                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
		                },
						locale: "ko",
						buttonText: {
						    today: '오늘',          // "Today" 
						    month: '월간',          // "Month" 
						    week: '주간',           // "Week" 
						    day: '일간',            // "Day"
						    list: '목록'            // "List" 
						},
		                editable: false,
		                dayMaxEvents: false,
		                selectable: false,
		                droppable: true,
						dayCellContent: handleDayCellContent,
		                eventClick: (event) => {
		                    this.editEvent(event);
		                },
		                select: (event) => {
		                    this.editDate(event);
		                },
		                events: this.events,
						// 툴팁 설정
						eventMouseEnter: function (info) {
						    const event = info.event;

						    // 툴팁 html
						    const tooltipContent = `
						        <div>
									<strong>제목:</strong> ${event.extendedProps.title || '제목 없음'}<br>
									<strong>상세내용:</strong> ${event.extendedProps.description || '상세 내용 없음'}<br>
						            <strong>시간:</strong> ${event.extendedProps.beginTimeCode || '시간정보없음'} ~ ${event.extendedProps.endTimeCode || '시간정보없음'}
						        </div>
						    `;

						    // 툴팁 요소 생성
						    const tooltip = document.createElement('div');
						    tooltip.className = 'custom-tooltip';
						    tooltip.innerHTML = tooltipContent;

						    // 툴팁 스타일
						    tooltip.style.position = 'absolute';
						    tooltip.style.zIndex = 1000;
						    tooltip.style.backgroundColor = '#f9f9f9';
						    tooltip.style.border = '1px solid #ccc';
						    tooltip.style.padding = '10px';
						    tooltip.style.borderRadius = '4px';
						    tooltip.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.1)';
						    tooltip.style.color = '#333';
						    tooltip.style.whiteSpace = 'nowrap';

						    // 툴팁 위치
						    const rect = info.el.getBoundingClientRect();
						    tooltip.style.top = `${rect.top + window.scrollY - 10}px`;
						    tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;

						    // 툴팁 추가
						    document.body.appendChild(tooltip);

						    // 이벤트에 툴팁 참조 저장
						    info.el._tooltip = tooltip;
						},

						eventMouseLeave: function (info) {
						    // 툴팁 제거
						    if (info.el._tooltip) {
						        document.body.removeChild(info.el._tooltip);
						        delete info.el._tooltip;
						    }
						},
		            });
		            this.calendar.render();
		
		            this.$watch('$store.app.sidebar', () => {
		                setTimeout(() => {
		                    this.calendar.render();
		                }, 300);
		            });
				},
				
				error: (xhr, status, error) => {
		                console.error('Error:', error);
		            }
		        });
        },
		

        getMonth(dt, add = 0) {
            let month = dt.getMonth() + 1 + add;
            return dt.getMonth() < 10 ? '0' + month : month;
        },

        editEvent(data) {
            this.params = JSON.parse(JSON.stringify(this.defaultParams));
            if (data) {
                let obj = JSON.parse(JSON.stringify(data.event));
                this.params = {
                    id: obj.id ? obj.id : null,
                    title: obj.title ? obj.title : null,
                    start: this.dateFormat(obj.start),
                    end: this.dateFormat(obj.end),
                    type: obj.classNames ? obj.classNames[0] : 'primary',
                    description: obj.extendedProps ? obj.extendedProps.description : '',
                };
                this.minStartDate = new Date();
                this.minEndDate = this.dateFormat(obj.start);
            } else {
                this.minStartDate = new Date();
                this.minEndDate = new Date();
            }

            this.isAddEventModal = true;
        },

        editDate(data) {
            let obj = {
                event: {
                    start: data.start,
                    end: data.end,
                },
            };
            this.editEvent(obj);
        },

        dateFormat(dt) {
            dt = new Date(dt);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
            const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
            dt = dt.getFullYear() + '-' + month + '-' + date + 'T' + hours + ':' + mins;
            return dt;
        },

        saveEvent() {
            if (!this.params.title) {
                return true;
            }
            if (!this.params.start) {
                return true;
            }
            if (!this.params.end) {
                return true;
            }

            if (this.params.id) {
                //update event
                let event = this.events.find((d) => d.id == this.params.id);
                event.title = this.params.title;
                event.start = this.params.start;
                event.end = this.params.end;
                event.description = this.params.description;
                event.className = this.params.type;
            } else {
                //add event
                let maxEventId = 0;
                if (this.events) {
                    maxEventId = this.events.reduce((max, character) => (character.id > max ? character.id : max), this.events[0].id);
                }

                let event = {
                    id: maxEventId + 1,
                    title: this.params.title,
                    start: this.params.start,
                    end: this.params.end,
                    description: this.params.description,
                    className: this.params.type,
                };
                this.events.push(event);
            }
            this.calendar.getEventSources()[0].refetch(); //refresh Calendar
            this.showMessage('Event has been saved successfully.');
            this.isAddEventModal = false;
        },

        startDateChange(event) {
            const dateStr = event.target.value;
            if (dateStr) {
                this.minEndDate = this.dateFormat(dateStr);
                this.params.end = '';
            }
        },

        showMessage(msg = '', type = 'success') {
            const toast = window.Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: type,
                title: msg,
                padding: '10px 20px',
            });
        },
    }));
});

// ModifyEmployee 모달 관련 DOM 요소
const openModalButtonModifyEmployee = document.getElementById('openModalButtonModifyEmployee');
const closeModalButtonModifyEmployee = document.getElementById('closeModalButtonModifyEmployee');
const modalBackgroundModifyEmployee = document.getElementById('modalBackgroundModifyEmployee');
const modalWrapperModifyEmployee = document.getElementById('modalWrapperModifyEmployee');
const cancelButtonModifyEmployee = document.getElementById('cancelButtonModifyEmployee');

// ModifyEmployee 모달 열기
if (openModalButtonModifyEmployee) {
		openModalButtonModifyEmployee.addEventListener('click', () => {
		modalBackgroundModifyEmployee.classList.remove('hidden');  // 모달 배경 보이기
		modalBackgroundModifyEmployee.classList.add('block');     // 모달 배경 보이게 설정
	});
}


// ModifyEmployee 모달 닫기
const closeModalModifyEmployee = () => {
  modalBackgroundModifyEmployee.classList.remove('block');
  modalBackgroundModifyEmployee.classList.add('hidden');  // 모달 배경 숨기기
  // 모달 내부의 모든 입력 필드를 초기화
  const formModifyEmployee = document.getElementById('employeeFormModifyEmployee');
  formModifyEmployee.reset(); // 모든 입력 필드와 라디오 버튼 초기화
  $('input').removeClass('errorInput');
  // 모든 에러 라벨 숨기기
  $('.error-label').hide();
};

if (closeModalButtonModifyEmployee) closeModalButtonModifyEmployee.addEventListener('click', closeModalModifyEmployee); // 닫기 버튼 클릭 시
if (cancelButtonModifyEmployee) cancelButtonModifyEmployee.addEventListener('click', closeModalModifyEmployee);     // 취소 버튼 클릭 시


// Department 모달 관련 DOM 요소
const openModalButtonDepartment = document.getElementById('openModalButtonDepartment');
const closeModalButtonDepartment = document.getElementById('closeModalButtonDepartment');
const modalBackgroundDepartment = document.getElementById('modalBackgroundDepartment');
const modalWrapperDepartment = document.getElementById('modalWrapperDepartment');
const cancelButtonDepartment = document.getElementById('cancelButtonDepartment');

// Department 모달 열기
if (openModalButtonDepartment) {
		openModalButtonDepartment.addEventListener('click', () => {	
  		modalBackgroundDepartment.classList.remove('hidden');  // 모달 배경 보이기
  		modalBackgroundDepartment.classList.add('block');     // 모달 배경 보이게 설정
	});
}

// Department 모달 닫기
const closeModalDepartment = () => {
	// 부서 검사
	const $employeeDepartment = $('#employeeDepartment'); // 선택박스 참조
	const $niceSelectDepartment = $employeeDepartment.next('.nice-select'); // nice-select 참조
	const $employeePosition = $('#employeePosition'); // 선택박스 참조
	const $niceSelectPosition = $employeePosition.next('.nice-select'); // nice-select 참조
	
  	modalBackgroundDepartment.classList.remove('block');
  	modalBackgroundDepartment.classList.add('hidden');  // 모달 배경 숨기기
  	// 모달 내부의 모든 입력 필드를 초기화
  	const formDepartment = document.getElementById('employeeFormDepartment');
  	formDepartment.reset(); // 모든 입력 필드와 라디오 버튼 초기화
  	$niceSelectDepartment.removeClass('errorInput');
  	$niceSelectPosition.removeClass('errorInput');
  	// 모든 에러 라벨 숨기기
  	$('.error-label').hide();
};

if (closeModalButtonDepartment) closeModalButtonDepartment.addEventListener('click', closeModalDepartment); // 닫기 버튼 클릭 시
if (cancelButtonDepartment) cancelButtonDepartment.addEventListener('click', closeModalDepartment);     // 취소 버튼 클릭 시

// Pw 모달 관련 DOM 요소
const openModalButtonPw = document.getElementById('openModalButtonPw');
const closeModalButtonPw = document.getElementById('closeModalButtonPw');
const modalBackgroundPw = document.getElementById('modalBackgroundPw');
const modalWrapperPw = document.getElementById('modalWrapperPw');
const cancelButtonPw = document.getElementById('cancelButtonPw');

// Pw 모달 열기
if (openModalButtonPw) {
		openModalButtonPw.addEventListener('click', () => {
 		 modalBackgroundPw.classList.remove('hidden');  // 모달 배경 보이기
 		 modalBackgroundPw.classList.add('block');     // 모달 배경 보이게 설정
	});
}

// Pw 모달 닫기
const closeModalPw = () => {
  modalBackgroundPw.classList.remove('block');
  modalBackgroundPw.classList.add('hidden');  // 모달 배경 숨기기
  // 모달 내부의 모든 입력 필드를 초기화
  const formPw = document.getElementById('employeeFormPw');
  formPw.reset(); // 모든 입력 필드와 라디오 버튼 초기화
  $('input').removeClass('errorInput');
  // 모든 에러 라벨 숨기기
  $('.error-label').hide();
};

if (closeModalButtonPw) closeModalButtonPw.addEventListener('click', closeModalPw); // 닫기 버튼 클릭 시
if (cancelButtonPw) cancelButtonPw.addEventListener('click', closeModalPw);     // 취소 버튼 클릭 시

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

// 부서/직책 모달 유효성 검사 
$('#employeeBtnDepartment').click(function() {
    let isVal = true;
	
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
        $('#employeeFormDepartment').submit();
    }
});

// 비밀번호 변경 모달 유효성 검사 
$('#employeeBtnPw').click(function() {
    let isVal = true;
	
	// 현재 비밀번호 검사
    if ($('#employeeNowPw').val().trim() === '') {
        $('#employeeNowPw').addClass("errorInput");
        $('.employeeNowPw-error').show();
        isVal = false;
    } else {
        $('.employeeNowPw-error').hide();
        $('#employeeNowPw').removeClass("errorInput");
    }
    
 	// 새 비밀번호 검사
    if ($('#employeeChangePw').val().trim() === '') {
        $('#employeeChangePw').addClass("errorInput");
        $('.employeeChangePw-error').show();
        isVal = false;
    } else {
        $('.employeeChangePw-error').hide();
        $('#employeeChangePw').removeClass("errorInput");
    }
	
	// 새 비밀번호확인 검사
    if ($('#employeeChangePwCheck').val().trim() === '') {
        $('#employeeChangePwCheck').addClass("errorInput");
        $('.employeeChangePwCheck-error').show();
        isVal = false;
    } else {
        $('.employeeChangePwCheck-error').hide();
        $('#employeeChangePwCheck').removeClass("errorInput");
    }
 	
    // 폼 제출
    if (isVal) {
        console.log("submit 성공");
        $('#employeeFormPw').submit();
    }
});

// 개인정보 수정 유효성 검사 
$('#employeeModifyBtn').click(function() {
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
 	
    // 폼 제출
    if (isVal) {
        console.log("submit 성공");
        $('#employeeModifyForm').submit();
    }
});

// 비밀번호가 성공적으로 변경되었을 때
if (resultPw === 1) {
	// PwError2 모달 관련 DOM 요소
	const modalBackgroundPwError1 = document.getElementById('modalBackgroundPwError1');
	//const modalWrapperPwError2 = document.getElementById('modalWrapperPwError1');
	const employeeBtnPwError1 = document.getElementById('employeeBtnPwError1');
	const closeModalButtonPwError1 = document.getElementById('closeModalButtonPwError1');

	// PwError2 모달 열기
	  modalBackgroundPwError1.classList.remove('hidden');  // 모달 배경 보이기
	  modalBackgroundPwError1.classList.add('block');     // 모달 배경 보이게 설정

	// PwError2 모달 닫기
	const closeModalPwError1 = () => {
	  modalBackgroundPwError1.classList.remove('block');
	  modalBackgroundPwError1.classList.add('hidden');  // 모달 배경 숨기기
	};

	employeeBtnPwError1.addEventListener('click', closeModalPwError1); // 닫기 버튼 클릭 시
	closeModalButtonPwError1.addEventListener('click', closeModalPwError1);     // 취소 버튼 클릭 시
}

// 비밀번호 변경 시 새 비밀번호와 새 비밀번호 확인에 입력한 값이 일치하지 않을때
if (resultPw === 2) {
	// PwError2 모달 관련 DOM 요소
	const modalBackgroundPwError2 = document.getElementById('modalBackgroundPwError2');
	//const modalWrapperPwError2 = document.getElementById('modalWrapperPwError2');
	const employeeBtnPwError2 = document.getElementById('employeeBtnPwError2');
	const closeModalButtonPwError2 = document.getElementById('closeModalButtonPwError2');

	// PwError2 모달 열기
	  modalBackgroundPwError2.classList.remove('hidden');  // 모달 배경 보이기
	  modalBackgroundPwError2.classList.add('block');     // 모달 배경 보이게 설정

	// PwError2 모달 닫기
	const closeModalPwError2 = () => {
	  modalBackgroundPwError2.classList.remove('block');
	  modalBackgroundPwError2.classList.add('hidden');  // 모달 배경 숨기기
	};

	employeeBtnPwError2.addEventListener('click', closeModalPwError2); // 닫기 버튼 클릭 시
	closeModalButtonPwError2.addEventListener('click', closeModalPwError2);     // 취소 버튼 클릭 시
}

// 기존 비밀번호에 입력한 값이 일치하지 않을때
if (resultPw === 3) {
	// PwError2 모달 관련 DOM 요소
	const modalBackgroundPwError3 = document.getElementById('modalBackgroundPwError3');
	//const modalWrapperPwError3 = document.getElementById('modalWrapperPwError3');
	const employeeBtnPwError3 = document.getElementById('employeeBtnPwError3');
	const closeModalButtonPwError3 = document.getElementById('closeModalButtonPwError3');

	// PwError2 모달 열기
	  modalBackgroundPwError3.classList.remove('hidden');  // 모달 배경 보이기
	  modalBackgroundPwError3.classList.add('block');     // 모달 배경 보이게 설정

	// PwError2 모달 닫기
	const closeModalPwError3 = () => {
	  modalBackgroundPwError3.classList.remove('block');
	  modalBackgroundPwError3.classList.add('hidden');  // 모달 배경 숨기기
	};

	employeeBtnPwError3.addEventListener('click', closeModalPwError3); // 닫기 버튼 클릭 시
	closeModalButtonPwError3.addEventListener('click', closeModalPwError3);     // 취소 버튼 클릭 시
}


// 사원삭제 모달 관련 DOM 요소
const openModalButtonEmployeeDelete = document.getElementById('openModalButtonEmployeeDelete');
const closeModalButtonEmployeeDelete = document.getElementById('closeModalButtonEmployeeDelete');
const modalBackgroundEmployeeDelete = document.getElementById('modalBackgroundEmployeeDelete');
const modalWrapperEmployeeDelete = document.getElementById('modalWrapperEmployeeDelete');
const cancelButtonEmployeeDelete = document.getElementById('cancelButtonEmployeeDelete');

// 사원삭제 모달 열기
if (openModalButtonEmployeeDelete) {
		openModalButtonEmployeeDelete.addEventListener('click', () => {
	 	modalBackgroundEmployeeDelete.classList.remove('hidden');  // 모달 배경 보이기
	  	modalBackgroundEmployeeDelete.classList.add('block');     // 모달 배경 보이게 설정
	});
	
}

// 사원삭제 모달 닫기
const closeModalEmployeeDelete = () => {
  modalBackgroundEmployeeDelete.classList.remove('block');
  modalBackgroundEmployeeDelete.classList.add('hidden');  // 모달 배경 숨기기
  // 모달 내부의 모든 입력 필드를 초기화
  const formEmployeeDelete = document.getElementById('employeeFormEmployeeDelete');
  formEmployeeDelete.reset(); // 모든 입력 필드와 라디오 버튼 초기화
  $('input').removeClass('errorInput');
  // 모든 에러 라벨 숨기기
  $('.error-label').hide();
};

if (closeModalButtonEmployeeDelete) closeModalButtonEmployeeDelete.addEventListener('click', closeModalEmployeeDelete); // 닫기 버튼 클릭 시
if (cancelButtonEmployeeDelete) cancelButtonEmployeeDelete.addEventListener('click', closeModalEmployeeDelete);     // 취소 버튼 클릭 시