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
	

	Alpine.data('contacts1', () => ({
	    init() {
	        this.fetchWeather(); // 날씨 데이터 가져오기
	    },
	    
	    fetchWeather() {
	        // 5일치 예보 데이터를 가져오는 API
	        $.ajax({
	            url: 'https://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=c17fba3e8451a1665c094b90fc0dd175&units=metric',
	            type: 'GET',
	            dataType: 'json',
	            success: (data) => {
	                // 현재 날씨 데이터 가져오기
	                const currentTemp = Math.round(data.list[0].main.temp); // 첫 번째 데이터는 현재 시간 기준
	                const currentIconCode = data.list[0].weather[0].icon;
	                const currentIconURL = `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`;
	                
	                // 현재 날씨 출력
	                $('#currentTemperature').text(`${currentTemp}°C`); // 온도 업데이트
	                $('#currentIcon').attr('src', currentIconURL); // 아이콘 업데이트
	                
	                // 요일별 온도 출력 (오늘과 지나간 날 제외)
	                const weeklyData = data.list.filter((item, index) => index % 8 === 0); // 매일 한 번씩 데이터 가져오기
	                let weeklyHTML = '';
	                const today = new Date(); // 오늘 날짜
	                const todayDate = today.getDate(); // 오늘 날짜 (일자 기준)
	                const todayMonth = today.getMonth(); // 오늘의 월

	                let displayedDays = 0; // 출력된 날짜 수

	                weeklyData.forEach((day) => {
	                    const dayDate = new Date(day.dt_txt); // 해당 날짜
	                    const dayDay = dayDate.getDate(); // 날짜의 일자
	                    const dayMonth = dayDate.getMonth(); // 날짜의 월

	                    // 오늘과 같은 날짜 또는 지나간 날짜를 제외하고 5일치 출력
	                    if ((dayMonth === todayMonth && dayDay > todayDate) || dayMonth > todayMonth) {
	                        if (displayedDays < 5) {
	                            const dayTemp = Math.round(day.main.temp);
	                            const dayName = this.getDayName(dayDate.getDay()); // 요일 이름
	                            weeklyHTML += `
	                                <div class="mt-3 font-semibold text-white">
	                                    ${dayName} ${dayTemp}°C
	                                </div>`;
	                            displayedDays++;
	                        }
	                    }
	                });

	                // 요일별 데이터 업데이트
	                $('#weeklyWeather').html(weeklyHTML);
	            },
	            error: (err) => {
	                console.error('Weather data fetch error:', err);
	            }
	        });
	    },

	    getDayName(dayIndex) {
	        // 요일 이름 배열
	        const days = ['일', '월', '화', '수', '목', '금', '토'];
	        return days[dayIndex];
	    }
	}));
	
	// 현재 시간 출력
	Alpine.data('contacts2', () => ({
        currentTime: '', // 현재 시간을 저장할 데이터

        init() {
            // 컴포넌트 초기화 시 실시간 시간 업데이트 시작
            this.updateTime(); // 최초 실행 시 한 번 현재 시간 설정
            setInterval(() => this.updateTime(), 1000); // 1초마다 업데이트
        },

        updateTime() { // 현재 시간 업데이트
            const now = new Date(); // 현재 날짜 및 시간 가져오기
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();

            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
			// 한 자리 숫자일 때 '0'을 추가

            this.currentTime = `${hours}:${minutes}:${seconds}`; // 시간 데이터 업데이트
        }
    }));
		
	// 연차 통계 차트
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
	                    data: totalWorkTimeList,  // 서버에서 받은 연차 데이터 사용
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



