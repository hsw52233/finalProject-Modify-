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
	// 캘린더
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
		        url: `http://${locations}:${ports}/academy/restapi/reservationList`,
		        type: 'GET',
		        dataType: 'json',
		        success: (data) => {
		            this.events = data.map(event => ({
		                id: event.reservationNo,
		                title: event.reservationTitle,
						start: `${event.reservationDate}T${event.beginTimeCode}:00`, // 시작 시간 변환
						end: `${event.reservationDate}T${event.endTimeCode}:00`, // 종료 시간 변환
					    backgroundColor: 'rgba(33, 150, 243, 0.5)',
					    borderColor: 'rgba(33, 150, 243, 0.8)',
					    textColor: '#fff', 
		                extendedProps: {
							reservationPerson: event.reservationPerson, // 예약자
		                    meetingroomName: event.meetingroomName || '회의실 없음', // 회의실 명
							beginTimeCode : event.beginTimeCode,
							endTimeCode : event.endTimeCode,
		                    employees: event.reservationEmployees.map(emp => emp.employeeName).join(', ') || '참여자 없음', // 회의 참여자
		                    description: event.reservationContent || '상세 내용 없음',
		                }
		            }));

		            var calendarEl = document.getElementById('ReservationCalendar');
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
						eventDisplay: 'block',
		                editable: false,
		                dayMaxEvents: true,
		                selectable: true,
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
						            <strong>예약자:</strong> ${event.extendedProps.reservationPerson || '예약자 없음'}<br>
						            <strong>시간:</strong> ${event.extendedProps.beginTimeCode} ~ ${event.extendedProps.endTimeCode }<br>
						            <strong>회의실:</strong> ${event.extendedProps.meetingroomName || '회의실 없음'}<br>
						            <strong>참여자:</strong> ${event.extendedProps.employees || '참여자 없음'}<br>
						            <strong>상세 내용:</strong> ${event.extendedProps.description || '상세 내용 없음'}
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
						
						// 수정페이지 링크
						eventClick: function(info) {
							const reservationNo = info.event.id;
							// 수정 접근권한 확인
							$.ajax({
								url: `http://${locations}:${ports}/academy/restapi/checkReservationPerson`,
						        type: 'GET',
						        data: {reservationNo},
								success: function(response) {
						            if (response.hasPermission) {
						                // 수정 페이지로 이동
						                window.location.href = `http://${locations}:${ports}/academy/modifyReservation?reservationNo=${reservationNo}`;
						            } else {
										
						                alert("수정 권한이 없습니다.");
						            }
						        },
						        error: function() {
									console.log(response.hasPermission)
						            alert("권한 확인 중 오류가 발생했습니다.");
						        }
							})
							openDeleteModal(reservationNo);
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