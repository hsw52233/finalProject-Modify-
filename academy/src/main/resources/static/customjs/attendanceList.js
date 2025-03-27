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
	
	// 테이블 출력
	Alpine.data('multicolumn', () => ({
	    datatable: null,
	    currentDate: new Date(), // 현재 날짜 저장 (초기값)

	    init() {
	        // 초기 데이터 로드
	        this.loadTableData(this.formatDateToMonth(this.currentDate));

	        // 이전 달 버튼 클릭 이벤트
	        document.getElementById("prevMonth").addEventListener("click", () => {
	            this.currentDate.setMonth(this.currentDate.getMonth() - 1); // 이전 달로 변경
	            this.updateMonthDisplay();
	            this.loadTableData(this.formatDateToMonth(this.currentDate));
	        });

	        // 다음 달 버튼 클릭 이벤트
	        document.getElementById("nextMonth").addEventListener("click", () => {
	            this.currentDate.setMonth(this.currentDate.getMonth() + 1); // 다음 달로 변경
	            this.updateMonthDisplay();
	            this.loadTableData(this.formatDateToMonth(this.currentDate));
	        });
	    },

	    // 'YYYY-MM' 형식으로 포맷
	    formatDateToMonth(date) {
	        const year = date.getFullYear();
	        const month = String(date.getMonth() + 1).padStart(2, '0');
	        return `${year}-${month}`;
	    },

	    // 화면 상단에 현재 월 표시
	    updateMonthDisplay() {
	        const currentMonthDisplay = document.getElementById("currentMonthDisplay");
	        currentMonthDisplay.textContent = this.formatDateToMonth(this.currentDate).replace('-', '.'); // 'YYYY.MM' 형식
	    },

	    // AJAX를 통한 테이블 데이터 로드
	    loadTableData(month) {
	        // 기존 테이블 제거
	        if (this.datatable) {
	            this.datatable.destroy();
	            document.querySelector('#myTable').innerHTML = ''; // 테이블 초기화
	        }

	        // AJAX 요청
	        $.ajax({
	            url: `http://${locations}:${ports}/academy/restapi/attendanceList`,
	            type: 'GET',
	            dataType: 'json',
	            data: { month }, // 'YYYY-MM' 형식으로 전달
	            success: (data) => {
					// 출근 시간, 퇴근 시간을 '00:00:00' 형식으로 변환하는 함수
		            const formatTime = (time) => {
		                if (!time) return '00:00:00';
		                const date = new Date(time);
		                const hours = String(date.getHours()).padStart(2, '0');
		                const minutes = String(date.getMinutes()).padStart(2, '0');
		                const seconds = String(date.getSeconds()).padStart(2, '0');
		                return `${hours}:${minutes}:${seconds}`;
		            };
					
	                // 테이블 데이터 설정
	                this.datatable = new simpleDatatables.DataTable('#myTable', {
	                    data: {
	                        headings: ['일자', '근무상태', '출근시간', '퇴근시간', '근무시간', '초과시간'],
	                        data: data.map(item => [
	                            item[0], // 일자
	                            item[1], // 근무상태
								formatTime(item[2]), // 출근시간
		                        formatTime(item[3]), // 퇴근시간
	                            item[4], // 근무시간
	                            item[5], // 초과시간								
	                        ])
	                    },
	                    searchable: false,
	                    perPage: 10,
	                    perPageSelect: [10, 20, 30, 50, 100],
	                    firstLast: false,
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
	                    const rowElement = e.target.closest('tr');
	                    if (rowElement) {
	                        const tdElements = rowElement.querySelectorAll('td');
	                        const approvalNo = tdElements[0].textContent; // approvalNo 데이터 추출
							if (!attendanceApprovalNo || attendanceApprovalNo === '항목이 없습니다.') {
					            // 항목이 없으면 클릭 동작 차단
					            console.warn('유효하지 않은 행 클릭');
					            return;
					        } 
	                        window.location.href = `/academy/attendanceApprovalOne?approvalNo=${approvalNo}`;
	                    }
	                });
	            },
	            error: (xhr, status, error) => {
	                console.error('Error:', error);
	            }
	        });
	    },

	    // 날짜 포맷 (YYYY.MM.DD)
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

	// 출근 통계 차트
	Alpine.data('analytics', () => ({
	    init() {
	        setTimeout(() => {
	            // followers
	            this.followers = new ApexCharts(this.$refs.followers, this.followersOptions);
	            this.followers.render();
	        }, 300);
	    },

	    get followersOptions() {
	        return {
	            series: [
	                {
	                    data: totalWorkTimeList,  // 서버에서 받은 출근 데이터 사용
	                },
	            ],
	            chart: {
	                height: 160,
	                type: 'area',
	                fontFamily: 'Nunito, sans-serif',
	                sparkline: {
	                    enabled: true,
	                },
	            },
	            stroke: {
	                curve: 'smooth',
	                width: 2,
	            },
	            colors: ['#4361ee'],
	            grid: {
	                padding: {
	                    top: 5,
	                },
	            },
	            yaxis: {
	                show: false,
	            },
	            tooltip: {
	                x: {
	                    show: false,
	                },
	                y: {
	                    title: {
	                        formatter: (formatter = () => {
	                            return '';
	                        }),
	                    },
	                },
	            },
	        };
	    },
	}));
});