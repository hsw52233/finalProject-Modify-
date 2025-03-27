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
	
	// 예약 날짜
	document.addEventListener('DOMContentLoaded', function () {
	    const reservationDate = document.getElementById('reservationDate');

	    // Flatpickr 초기화 - 개강일
	    flatpickr(reservationDate, {
	        dateFormat: 'Y-m-d',
	        onChange: (selectedDates) => {
	            if (selectedDates.length > 0) {
	                const selectedDate = selectedDates[0];
	                // 선택된 날짜를 처리하는 로직을 여기에 추가
	                console.log(selectedDate); // 선택된 날짜 출력
	            }
	        },
	    });
	});
	
	
	// 시작시간 및 종료시간 데이터 가져오는 공통 함수
	function loadTimeData() {
	    let meetingroomNo = $('#selectMeetingroom').val();
	    let reservationDate = $('#reservationDate').val();

	    // 유효성 검사: 회의실 번호와 예약 날짜가 모두 선택되었는지 확인
	    if (!meetingroomNo || !reservationDate) {
	        $('#beginTimeCode').empty().append('<option value="" disabled selected>시작 시간</option>').prop('disabled', true);
	        $('#endTimeCode').empty().append('<option value="" disabled selected>종료 시간</option>').prop('disabled', true);
	        return;
	    }

	    // 시작 시간 데이터 가져오기
	    $('#beginTimeCode').empty().append('<option value="" disabled selected>시작 시간</option>').prop('disabled', false);
	    $.ajax({
	        url: `http://${locations}:${ports}/academy/restapi/getReservationByBeginTime`,
	        contentType: 'application/json',
	        type: 'POST',
	        data: JSON.stringify({
	            meetingroomNo: meetingroomNo,
	            reservationDate: reservationDate
	        }),
	        success: function (data) {
	            data.forEach(time => {
	                $('#beginTimeCode').append(`<option value="${time.code}">${time.name}</option>`);
	            });
	        },
	        error: function () {
	            alert('시작 시간 데이터를 가져오는 중 오류가 발생했습니다.');
	        }
	    });

	    // 종료 시간 데이터 가져오기
	    $('#endTimeCode').empty().append('<option value="" disabled selected>종료 시간</option>').prop('disabled', false);
	    $.ajax({
	        url: `http://${locations}:${ports}/academy/restapi/getReservationByEndTime`,
	        contentType: 'application/json',
	        type: 'POST',
	        data: JSON.stringify({
	            meetingroomNo: meetingroomNo,
	            reservationDate: reservationDate
	        }),
	        success: function (data) {
	            data.forEach(time => {
	                $('#endTimeCode').append(`<option value="${time.code}">${time.name}</option>`);
	            });
	        },
	        error: function () {
	            alert('종료 시간 데이터를 가져오는 중 오류가 발생했습니다.');
	        }
	    });
	}

	// 예약 날짜 변경 시
	$('#reservationDate').change(function () {
	    loadTimeData();
	});

	// 회의실 변경 시
	$('#selectMeetingroom').change(function () {
	    // 시간 선택 초기화 및 AJAX 호출
	    $('#beginTimeCode').val('').prop('disabled', false);
	    $('#endTimeCode').val('').prop('disabled', true);

	    loadTimeData(); // 시간 데이터 다시 로드
	});
	
	// 사원검색
	function searchEmployee() {
	    let searchValue = $('#searchEmployee').val().trim();

	    if (searchValue === '') {
	        $('#searchEmployee').addClass("errorInput");
	        $('.searchEmployee-error').show();
	        $('#resultEmployee').empty(); // 기존 결과 제거
	        $('#resultEmployee').append('<option value="">검색어를 입력해주세요</option>');
	        return; // 입력이 비어있다면 검색을 하지 않음
	    } else {
	        $('#searchEmployee').removeClass("errorInput");
	        $('.searchEmployee-error').hide();
	    }

	    // Ajax 요청
	    $.ajax({
	        url: `http://${locations}:${ports}/academy/restapi/searchEmployee`, // 사원 검색 API URL
	        type: 'GET',
	        data: { searchEmployee: searchValue },
	        dataType: 'json',
	        success: function (data) {
	            // 검색 결과를 #resultEmployee에 표시
	            $('#resultEmployee').empty(); // 기존 옵션 제거
	            if (data.length > 0) {
	                data.forEach(employee => {
	                    $('#resultEmployee').append(
	                        `<option value="${employee.employeeNo}">${employee.employeeName}</option>`
	                    );
	                });
	            } else {
	                $('#resultEmployee').append('<option value="">검색된 사원이 없습니다</option>');
	            }
	        },
	        error: function (xhr, status, error) {
	            console.error('Error:', error);
	        }
	    });
	}

	// 키보드 입력 이벤트 
	$('#searchEmployee').on('keyup', function () {
	    searchEmployee(); //검색 함수 호출
	});
	
	// 검색창에서 엔터 키 처리
	/*
	$('#searchEmployee').on('keydown', function (e) {
	    if (e.key === 'Enter') {
	        e.preventDefault(); // 엔터 키로 폼이 제출되는 것을 막음
	        searchEmployee(); // 검색 함수 호출
	    }
	});
	*/

	// 클릭 이벤트
	$('#btnEmployee').on('click', function () {
	    searchEmployee(); // 검색 함수 호출
	});
	
	// 사원추가
	$('#addResultEmployee').click(function () {
	    const selectedOption = $('#resultEmployee option:selected'); // 선택된 옵션 가져오기
	    const employeeNo = selectedOption.val();
	    const employeeName = selectedOption.text();

	    if (employeeNo && employeeName) {
	        // 중복 검사
	        let exists = false;
	        $('#selectEmployeesContainer .selectedEmployee').each(function () {
	            // data()로 읽은 값과 employeeNo를 문자열로 비교
	            if ($(this).attr('data-employee-no') === String(employeeNo)) {
	                exists = true; // 이미 추가된 사원이면 추가하지 않음
	                return false; // 반복문 종료
	            }
	        });

	        if (!exists) {
				const cnt = $('#selectEmployeesContainer .selectedEmployee-box').length;
				
	            // 선택된 사원을 추가
	            const newEmployee = `
	                <div class="d-flex w-100 items-center justify-between mt-2 selectedEmployee-box">
	                    <input class="selectedEmployeeNo" type="hidden" value="${employeeNo}" name="reservationEmployees[${cnt}].employeeNo">
	                    <input 
	                        class="form-input selectedEmployee"
	                        type="text"
	                        value="${employeeName}" 
	                        data-employee-no="${employeeNo}" 
	                        name="reservationEmployees[${cnt}].employeeName"
	                        readonly>
	                    <button type="button" class="btn btn-danger ms-3 removeEmployee" style="word-break:keep-all;">삭제</button>
	                </div>
	            `;
	            $('#selectEmployeesContainer').append(newEmployee);

	            // 검색기록 초기화
	            $('#searchEmployee').val('');
	            $('#resultEmployee').empty();
	        }
	    }
		
		// 회의실 선택과 수용 인원 정보 가져오기
		let meetingroomNo = $('#selectMeetingroom option:selected');
		let meetingroomCapacity = meetingroomNo.data('capacity');
		let selectedEmployeeCount = $('#selectEmployeesContainer .selectedEmployee-box').length;
		selectedEmployeeCount++; // 예약자 포함

		console.log('회의실 수용 인원:', meetingroomCapacity);  // meetingroomCapacity 확인
		console.log('선택된 사원 수:', selectedEmployeeCount);  // selectedEmployeeCount 확인
		
		if (!meetingroomNo) {
			$('#modalBackgroundMeetingroomCheck').show();
			$('#modalWrapperMeetingroomCheck').show();
		    return;  
		}

		if (selectedEmployeeCount > meetingroomCapacity) {
	        $('#selectEmployeesContainer .selectedEmployee-box:last').remove(); // 마지막 추가된 사원 제거
	        $('.reservationEmployee-error').show(); // 실패 시 에러 메시지 표시
	    } else {
	        $('.reservationEmployee-error').hide(); // 에러 메시지 숨기기
	    }
	});

	// 삭제 버튼 기능 추가
	$(document).on('click', '.removeEmployee', function () {
	    const parentElement = $(this).closest('.selectedEmployee-box');
	    const employeeNo = parentElement.find('.selectedEmployee').data('employee-no');

	    // employeeNo 값 확인
	    if (!employeeNo) {
	        console.error('employeeNo가 유효하지 않습니다:', employeeNo);
	        return;
	    }

	    const deleteField = $('#deleteEmployee');
	    let currentValues = deleteField.val() || ''; // null 방지

	    // 값 추가 (중복 방지)
	    if (!currentValues.split(',').includes(String(employeeNo))) {
	        currentValues = currentValues ? `${currentValues},${employeeNo}` : employeeNo;
	        deleteField.val(currentValues); // 값 설정
	        console.log('삭제된 employeeNo 추가됨:', deleteField.val());
	    } else {
	        console.log('employeeNo가 이미 존재합니다:', employeeNo);
	    }

	    // DOM에서 삭제
	    parentElement.remove();

	    // 남은 사원들의 cnt 재계산 
	    $('#selectEmployeesContainer .selectedEmployee-box').each(function (index) {
	        const inputHidden = $(this).find('.selectedEmployeeNo');
	        const inputText = $(this).find('.selectedEmployee');

	        // cnt 재설정 (index 값 사용 - 삭제버튼 클릭시 재배열) / index는 JavaScript에서 HTML 요소의 순서를 자동으로 제공
	        inputHidden.attr('name', `reservationEmployees[${index}].employeeNo`);
	        inputText.attr('name', `reservationEmployees[${index}].employeeName`);
	    });
	});
});	


// 시작시간을 선택했을 때 종료시간을 선택할 때 시작시간 이전의 시간은 선택되지 X
function disableSelectedOption() {
	
	console.log('disableSelectedOption 호출됨')
    var beginTimeCode = document.getElementById('beginTimeCode');
    var selectedValue1 = beginTimeCode.value;
	
    // 두 번째 <select> 요소 가져오기
    var endTimeCode = document.getElementById('endTimeCode');
	var selectedEndValue = endTimeCode.value; 
	
    // 종료시간을 비활성화 처리
    if (selectedValue1 !== '') {
        endTimeCode.disabled = false; // 시작시간이 선택되었으면 종료시간 활성화
    } else {
        endTimeCode.disabled = true; // 시작시간이 선택되지 않으면 종료시간 비활성화
    }
	
	// 만약 시간시간을 다시 종료시간보다 뒤로 바꿧을때 종료시간 초기화
	if (selectedEndValue <= selectedValue1) {
        endTimeCode.value = ""; // 종료 시간 초기화
    }

    // 첫 번째 <select>에서 선택된 값과 일치하는 옵션 비활성화
    for (var i = 0; i < endTimeCode.options.length; i++) {
        if (endTimeCode.options[i].value <= selectedValue1) {
            endTimeCode.options[i].disabled = true;
        }
    }

    // 이전 시간 저장 변수
    var previousValue = parseInt(selectedValue1); // 시작 시간
    var selectedValue = false;
    var selectedIndex = beginTimeCode.selectedIndex; // 선택된 값의 인덱스 가져오기
    var previousValue = parseInt(beginTimeCode.options[selectedIndex].text); // 선택된 텍스트 값

    // 선택된 옵션 이후부터 루프 실행
    for (var i = selectedIndex; i < endTimeCode.options.length; i++) {
        var optionText = parseInt(endTimeCode.options[i].text); // 현재 옵션의 텍스트 값 (숫자로 변환)
		endTimeCode.options[i].disabled = false;
        if (selectedValue === true) {
            endTimeCode.options[i].disabled = true;
        } else if (optionText > previousValue + 1) {
            endTimeCode.options[i].disabled = true;
            selectedValue = true;
        }

        // 이전 값을 갱신
        previousValue = optionText;
    }
};

// 회의실 미선택 유효성
$(document).ready(function () {
    $('#beginTimeCode, #endTimeCode, #reservationTitle, #reservationDate, #reservationContent, #searchEmployee').on('click', function () {
        const meetingroom = $('#selectMeetingroom').val();

        if (!meetingroom) {
            console.log('회의실을 선택하지 않았습니다.');
            $('#modalBackgroundMeetingroomCheck').show();
            $('#modalWrapperMeetingroomCheck').show();
			$('#beginTimeCode, #endTimeCode').val('');
			$('.flatpickr-calendar').css('z-index', 0);
        }
    });

    $('#closeModalButtonMeetingroomCheck').on('click', function () {
        $('#modalBackgroundMeetingroomCheck').hide();
        $('#modalWrapperMeetingroomCheck').hide();
    });

    $('#modalBackgroundMeetingroomCheck').on('click', function () {
        $('#modalBackgroundMeetingroomCheck').hide();
        $('#modalWrapperMeetingroomCheck').hide();
    });
});

// 예약신청 유효성 검사
$('#btnAddReservation').click(function(){
	let isValid = true;  
    // 회의실 검사
    if ($('#selectMeetingroom').val().trim() === '') {
    	$('#selectMeetingroom').addClass("errorInput");
    	$('.selectMeetingroom-error').show();
    	isValid = false;
  	} else {
    	$('#selectMeetingroom').removeClass("errorInput");
    	$('.selectMeetingroom-error').hide();
    }
    // 회의제목 검사
    if ($('#reservationTitle').val().trim() === '') {
    	$('#reservationTitle').addClass("errorInput");
    	$('.reservationTitle-error').show();
    	isValid = false;
  	} else {
    	$('#reservationTitle').removeClass("errorInput");
    	$('.reservationTitle-error').hide();
    }
    // 시작시간 검사
    if ($('#beginTimeCode').val().trim() === '') {
    	$('#beginTimeCode').addClass("errorInput");
    	$('.beginTimeCode-error').show();
    	isValid = false;
  	} else {
    	$('#beginTimeCode').removeClass("errorInput");
    	$('.beginTimeCode-error').hide();
    }
    // 종료시간 검사
    if ($('#endTimeCode').val().trim() === '') {
    	$('#endTimeCode').addClass("errorInput");
    	$('.endTimeCode-error').show();
    	isValid = false;
  	} else {
    	$('#endTimeCode').removeClass("errorInput");
    	$('.endTimeCode-error').hide();
    }
    // 예약날짜 검사
    if ($('#reservationDate').val().trim() === '') {
    	$('#reservationDate').addClass("errorInput");
    	$('.reservationDate-error').show();
    	isValid = false;
  	} else {
    	$('#reservationDate').removeClass("errorInput");
    	$('.reservationDate-error').hide();
    }
	// isValid가 true일 때만 폼 제출
    if (isValid) {
        $('#addReservationForm').submit();
    } else {
        e.preventDefault(); // 폼 제출을 막음
        console.log("유효성 검사 실패");
    }
})






