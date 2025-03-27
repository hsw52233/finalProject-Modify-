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

// 결재선추가 모달 관련 DOM 요소
const openModalButtonAddPeople = document.getElementById('openModalButtonAddPeople');
const closeModalButtonAddPeople = document.getElementById('closeModalButtonAddPeople');
const modalBackgroundAddPeople = document.getElementById('modalBackgroundAddPeople');
const modalWrapperAddPeople = document.getElementById('modalWrapperAddPeople');
const applyModalButtonAddPeople = document.getElementById('applyModalButtonAddPeople');

// 결재선추가 모달 열기
openModalButtonAddPeople.addEventListener('click', () => {
  modalBackgroundAddPeople.classList.remove('hidden');  // 모달 배경 보이기
  modalBackgroundAddPeople.classList.add('block');     // 모달 배경 보이게 설정
});

// 결재선추가 모달 닫기
const closeModalAddPeople = () => {
  modalBackgroundAddPeople.classList.remove('block');
  modalBackgroundAddPeople.classList.add('hidden');  // 모달 배경 숨기기
};

if (closeModalButtonAddPeople) closeModalButtonAddPeople.addEventListener('click', closeModalAddPeople); // 닫기 버튼 클릭 시


// 확정버튼을 누를 시 
if (applyModalButtonAddPeople) applyModalButtonAddPeople.addEventListener('click', () => {

	// 해당 id를 가진 요소를 찾음
	var element = document.getElementById('inputContainer');
	if (element) {
        // 요소 내의 모든 input 태그들을 찾음
        var inputs = element.querySelectorAll('input:not([type="hidden"])');
        if (inputs.length >= 0) {
			console.log(inputs.length);
			$('#alreadyPeople').remove(); // 숨김 처리
			$('#newPeople').removeAttr('hidden');
			$('#people1 .flex').remove();
			$('#people2 .flex').remove();
			$('#people3 .flex').remove();
            // 각 input 태그의 value 값을 출력
            inputs.forEach(function(input, index) {
				let html = `
		            <div class="flex w-full mb-1">
		                <input class="text-center w-full bg-white" value="${input.value}" disabled></input>
		            </div>
		        `;
				if (inputs.length == 1) { // 값이 1개라면
					$('#people1 .flex').remove();
					$('#people1').append(html);  // HTML 추가
					$('#people2 .flex').remove();
					$('#people3 .flex').remove();
				} else if (inputs.length == 2) { // 값이 2개라면 
					if (index == 0) {
						$('#people1 .flex').remove();
						$('#people1').append(html);  // HTML 추가
					}
					if (index == 1) {
						$('#people2 .flex').remove();
						$('#people2').append(html);  // HTML 추가
					}
					if (index == 1) $('#people3 .flex').remove();
				} else if (inputs.length == 3) {
					if (index == 0) {
						$('#people1 .flex').remove();
						$('#people1').append(html);  // HTML 추가
					}
					if (index == 1) {
						$('#people2 .flex').remove();
						$('#people2').append(html);  // HTML 추가
					}
					if (index == 2) {
						$('#people3 .flex').remove();
						$('#people3').append(html);  // HTML 추가
					}
				}
				
            });
        } else {
            console.log('input 태그가 존재하지 않습니다.');
			$('#people1 .flex').remove();
			$('#people2 .flex').remove();
			$('#people3 .flex').remove();
        }
    } else {
        console.log(`id "${elementId}"를 가진 요소를 찾을 수 없습니다.`);
    }
	closeModalAddPeople();
});

// 시작시간 선택
document.addEventListener("DOMContentLoaded", function(e) {
    // default
    var els = document.querySelectorAll(".begintime");
    els.forEach(function(select) {
        NiceSelect.bind(select);
    });
});

// 종료시간 선택
document.addEventListener("DOMContentLoaded", function(e) {
    // default
    var els = document.querySelectorAll(".endTime");
    els.forEach(function(select) {
        NiceSelect.bind(select);
    });
});

// 요일 선택
document.addEventListener("DOMContentLoaded", function(e) {
    // default
    var els = document.querySelectorAll(".weekday");
    els.forEach(function(select) {
        NiceSelect.bind(select);
    });
});

// 강의날짜 미입력 모달 관련 DOM 요소
const openModalButtonNoLectureDate = document.getElementById('openModalButtonNoLectureDate');
const closeModalButtonNoLectureDate = document.getElementById('closeModalButtonNoLectureDate');
const modalBackgroundNoLectureDate = document.getElementById('modalBackgroundNoLectureDate');
const modalWrapperNoLectureDate = document.getElementById('modalWrapperNoLectureDate');
const employeeBtnNoLectureDate = document.getElementById('employeeBtnNoLectureDate');

// 강의날짜 미입력 모달 닫기
const closeModalNoLectureDate = () => {
	  modalBackgroundNoLectureDate.classList.remove('block');
	  modalBackgroundNoLectureDate.classList.add('hidden');  // 모달 배경 숨기기
	  $('select').prop('disabled', false);
};

if (closeModalButtonNoLectureDate) closeModalButtonNoLectureDate.addEventListener('click', closeModalNoLectureDate); // 닫기 버튼 클릭 시
if (employeeBtnNoLectureDate) employeeBtnNoLectureDate.addEventListener('click', closeModalNoLectureDate);     // 취소 버튼 클릭 시

// 유효성 모달 관련 DOM 요소
const openModalButtonSubmitError = document.getElementById('openModalButtonSubmitError');
const closeModalButtonSubmitError = document.getElementById('closeModalButtonSubmitError');
const modalBackgroundSubmitError = document.getElementById('modalBackgroundSubmitError');
const modalWrapperSubmitError = document.getElementById('modalWrapperSubmitError');
const employeeBtnSubmitError = document.getElementById('employeeBtnSubmitError');

// 유효성 모달 닫기
const closeModalSubmitError = () => {
	  modalBackgroundSubmitError.classList.remove('block');
	  modalBackgroundSubmitError.classList.add('hidden');  // 모달 배경 숨기기
};

if (closeModalButtonSubmitError) closeModalButtonSubmitError.addEventListener('click', closeModalSubmitError); // 닫기 버튼 클릭 시
if (employeeBtnSubmitError) employeeBtnSubmitError.addEventListener('click', closeModalSubmitError);     // 취소 버튼 클릭 시

// 추가오류 모달 관련 DOM 요소
const openModalButtonAddFileError = document.getElementById('openModalButtonAddFileError');
const closeModalButtonAddFileError = document.getElementById('closeModalButtonAddFileError');
const modalBackgroundAddFileError = document.getElementById('modalBackgroundAddFileError');
const modalWrapperAddFileError = document.getElementById('modalWrapperAddFileError');
const employeeBtnAddFileError = document.getElementById('employeeBtnAddFileError');

// 추가오류 모달 닫기
const closeModalAddFileError = () => {
	  modalBackgroundAddFileError.classList.remove('block');
	  modalBackgroundAddFileError.classList.add('hidden');  // 모달 배경 숨기기
};

if (closeModalButtonAddFileError) closeModalButtonAddFileError.addEventListener('click', closeModalAddFileError); // 닫기 버튼 클릭 시
if (employeeBtnAddFileError) employeeBtnAddFileError.addEventListener('click', closeModalAddFileError);     // 취소 버튼 클릭 시

// 이미 등록한 회원추가시 경고 모달 관련 DOM 요소
const openModalButtonAddExist = document.getElementById('openModalButtonAddExist');
const closeModalButtonAddExist = document.getElementById('closeModalButtonAddExist');
const modalBackgroundAddExist = document.getElementById('modalBackgroundAddExist');
const modalWrapperAddExist = document.getElementById('modalWrapperAddExist');
const employeeBtnAddExist = document.getElementById('employeeBtnAddExist');

// 이미 등록한 회원추가시 모달 닫기
const closeModalAddExist = () => {
	  modalBackgroundAddExist.classList.remove('block');
	  modalBackgroundAddExist.classList.add('hidden');  // 모달 배경 숨기기
};

if (closeModalButtonAddExist) closeModalButtonAddExist.addEventListener('click', closeModalAddExist); // 닫기 버튼 클릭 시
if (employeeBtnAddExist) employeeBtnAddExist.addEventListener('click', closeModalAddExist);     // 취소 버튼 클릭 시

// 추가초과 모달 관련 DOM 요소
const openModalButtonAddOver = document.getElementById('openModalButtonAddOver');
const closeModalButtonAddOver = document.getElementById('closeModalButtonAddOver');
const modalBackgroundAddOver = document.getElementById('modalBackgroundAddOver');
const modalWrapperAddAddOver = document.getElementById('modalWrapperAddOver');
const employeeBtnAddAddOver = document.getElementById('employeeBtnAddOver');

// 추가오류 모달 닫기
const closeModalAddOver = () => {
	  modalBackgroundAddOver.classList.remove('block');
	  modalBackgroundAddOver.classList.add('hidden');  // 모달 배경 숨기기
};

if (closeModalButtonAddOver) closeModalButtonAddOver.addEventListener('click', closeModalAddOver); // 닫기 버튼 클릭 시
if (employeeBtnAddAddOver) employeeBtnAddAddOver.addEventListener('click', closeModalAddOver);     // 취소 버튼 클릭 시

// 유효성 검사 
$('#addBtn').click(function() {
    let isVal = true;
    
 	// 시작날짜 검사
    if ($('#beginDate').val().trim() === '') {
        $('#beginDate').addClass("errorInput");
        $('.beginDate-error').show();
        isVal = false;
    } else {
        $('.beginDate-error').hide();
        $('#beginDate').removeClass("errorInput");
    }
	
	// 종료날짜 검사
    if ($('#endDate').val().trim() === '') {
        $('#endDate').addClass("errorInput");
        $('.endDate-error').show();
        isVal = false;
    } else {
        $('.endDate-error').hide();
        $('#endDate').removeClass("errorInput");
    }
	
	if ($('#alreadyLectureTime').length === 0) {
		$('#timeDiv tr').each(function(index) {
	        // 각 select 요소에 대한 검사
			console.log($('#timeDiv tr').length);
	        const weekday = $(this).find(`#weekdayId${index}`);
	        const beginTime = $(this).find(`#beginTimeId${index}`);
	        const endTime = $(this).find(`#endTimeId${index}`);

	        // 요일 검사
	        if (weekday.val() === '' || weekday.val() === null) {
	            weekday.addClass('errorInput');
	            $(this).find('.weekday-error').show();
	            isVal = false;
	        } else {
	            weekday.removeClass('errorInput');
	            $(this).find('.weekday-error').hide();
	        }
			console.log("요일" + weekday.val());
	        // 시작시간 검사
	        if (beginTime.val() === '' || beginTime.val() === null) {
	            beginTime.addClass('errorInput');
	            $(this).find('.beginTime-error').show();
	            isVal = false;
	        } else {
	            beginTime.removeClass('errorInput');
	            $(this).find('.beginTime-error').hide();
	        }
			console.log("시작시간" + beginTime.val());
	        // 종료시간 검사
	        if (endTime.val() === '' || endTime.val() === null) {
	            endTime.addClass('errorInput');
	            $(this).find('.endTime-error').show();
	            isVal = false;
	        } else {
	            endTime.removeClass('errorInput');
	            $(this).find('.endTime-error').hide();
	        }
			console.log("종료시간" + endTime.val());
	    });
	}
 	
	// #inputContainer에 input 요소가 하나도 없으면 추가된 항목이 없다고 판단
    if ($('#inputContainer input:not([type="hidden"])').length === 0) {
        isVal = false;
		console.log('결재선이 비어있습니다.');
    }
	
	
	$('#inputContainer input:not([type="hidden"])').each(function() {
		console.log($('#inputContainer input:not([type="hidden"])').length);
        var value = $(this).val();
        // readonly 속성이 없고 값이 비어있는 input을 유효하지 않다고 판단
        if (!$(this).prop('readonly') && value.trim() === '') {
            isVal = false;
            $(this).css('border', '1px solid red'); // 값이 비어있는 input에 빨간색 테두리 추가
        } else {
            $(this).css('border', ''); // 값이 있는 input은 테두리 제거
        }
    });
	
	// 강의명 검사
    if ($('#lectureName').val().trim() === '') {
        $('#lectureName').addClass("errorInput");
        $('.lectureName-error').show();
        isVal = false;
    } else {
        $('.lectureName-error').hide();
        $('#lectureName').removeClass("errorInput");
    }
	
	const $classroomList = $('#classroomList'); // 선택박스 참조
	const $niceSelectclassroomList = $classroomList.next('.nice-select'); // nice-select 참조
		
 	// 강의실 검사
    if ($('#classroomList').val() === null) {
        $('.classroomList-error').show();
        $niceSelectclassroomList.addClass("errorInput"); // 에러 클래스 추가
        isVal = false;
    } else {
        $('.classroomList-error').hide();
        $niceSelectclassroomList.removeClass("errorInput"); // 에러 클래스 제거
    }
	
	// 강의내용 검사
	if ($('#lectureContent').val().trim() === '') {
        $('#lectureContent').addClass("errorInput");
        $('.lectureContent-error').show();
        isVal = false;
    } else {
        $('.lectureContent-error').hide();
        $('#lectureContent').removeClass("errorInput");
    }
	
	// 결재제목 검사
	if ($('#lectureApprovalTitle').val().trim() === '') {
	    $('#lectureApprovalTitle').addClass("errorInput");
	    $('.lectureApprovalTitle-error').show();
	    isVal = false;
	} else {
	    $('.lectureApprovalTitle-error').hide();
	    $('#lectureApprovalTitle').removeClass("errorInput");
	}
	
	// 결재내용 검사
	if ($('#lectureApprovalContent').val().trim() === '') {
        $('#lectureApprovalContent').addClass("errorInput");
        $('.lectureApprovalContent-error').show();
        isVal = false;
    } else {
        $('.lectureApprovalContent-error').hide();
        $('#lectureApprovalContent').removeClass("errorInput");
    }
 	
    // 폼 제출
    if (isVal) {
        console.log("submit 성공");
		$('#endDate').prop('disabled', false);
		$('#timeDiv tr').each(function(index) {
			const weekday = $(this).find(`#weekdayId${index}`);
	        const beginTime = $(this).find(`#beginTimeId${index}`);
	        const endTime = $(this).find(`#endTimeId${index}`);
			weekday.prop('disabled', false);
			beginTime.prop('disabled', false);
			endTime.prop('disabled', false);
		});
		
        $('#addForm').submit();
    } else {
	  	modalBackgroundSubmitError.classList.remove('hidden');  // 모달 배경 보이기
	  	modalBackgroundSubmitError.classList.add('block');     // 모달 배경 보이게 설정
	}
});

// 강의시간 추가 버튼 누를시
var timeResult= 0;
$('#btnAddTime').click(function () {
    let isEmpty = false;

    // 모든 <select> 필드 검사
    $('#timeDiv select').each(function () {
        const selectedValue = $(this).val();

        if (selectedValue === '' || selectedValue === null) {
            isEmpty = true;
            return false; // 루프 중단
        }
    });
	timeResult++; // 고유 ID 증가
    if (isEmpty) {
        modalBackgroundAddFileError.classList.toggle('hidden', false);
        modalBackgroundAddFileError.classList.toggle('block', true);
		timeResult--;
    } else if (timeResult > 4) {
        modalBackgroundAddOver.classList.toggle('hidden', false);
        modalBackgroundAddOver.classList.toggle('block', true);
		timeResult--;
    } else {

        let weekdayId = 'weekdayId' + timeResult;
        let beginTimeId = 'beginTimeId' + timeResult;
        let endTimeId = 'endTimeId' + timeResult;
		
		// 이전 강의시간은 수정하지 못함.
		let backWeekdayId = 'weekdayId' + (timeResult - 1);
		let backbeginTimeId = 'beginTimeId' + (timeResult - 1);
		let backendTimeId = 'endTimeId' + (timeResult - 1);
		$(`#${backWeekdayId}`).prop('disabled', true);
		$(`#${backbeginTimeId}`).prop('disabled', true);
		$(`#${backendTimeId}`).prop('disabled', true);
		
		$('#classroomList').change(function () {
			$('#alreadyLectureTime').attr('hidden', true); // 숨김 처리
			$(`#${weekdayId}`).prop('selectedIndex', 0);
			$(`#${beginTimeId}`).prop('selectedIndex', 0);
			$(`#${endTimeId}`).prop('selectedIndex', 0);
			$('#weekdayId0').prop('selectedIndex', 0);
			$('#beginTimeId0').prop('selectedIndex', 0);
			$('#endTimeId0').prop('selectedIndex', 0);
			$('#weekdayId0').prop('disabled', false);
			$('#beginTimeId0').prop('disabled', false);
			$('#beginTimeId0 option:not(:first)').remove();
			$('#endTimeId0 option:not(:first)').remove();
								
			
			// timeResult 값만큼 반복적으로 항목 삭제
			while (timeResult > 0) {
			    let lastTimeResult = timeResult;  // 현재 timeResult 값
			    let lastRowId = 'weekday' + lastTimeResult;  // 동적으로 생성된 ID 생성

			    // 해당 ID를 가진 tr 삭제
			    $('#' + lastRowId).closest('tr').remove();

			    timeResult--;  // timeResult 감소
			}
		});
		
		$('#beginDate').change(function () {
			$(`#${weekdayId}`).prop('selectedIndex', 0);
			$(`#${beginTimeId}`).prop('selectedIndex', 0);
			$(`#${endTimeId}`).prop('selectedIndex', 0);
			$('#weekdayId0').prop('selectedIndex', 0);
			$('#beginTimeId0').prop('selectedIndex', 0);
			$('#endTimeId0').prop('selectedIndex', 0);
			$('#weekdayId0').prop('disabled', false);
			$('#beginTimeId0').prop('disabled', false);
			$('#beginTimeId0 option:not(:first)').remove();
			$('#endTimeId0 option:not(:first)').remove();
			
			// timeResult 값만큼 반복적으로 항목 삭제
			while (timeResult > 0) {
			    let lastTimeResult = timeResult;  // 현재 timeResult 값
			    let lastRowId = 'weekday' + lastTimeResult;  // 동적으로 생성된 ID 생성

			    // 해당 ID를 가진 tr 삭제
			    $('#' + lastRowId).closest('tr').remove();

			    timeResult--;  // timeResult 감소
			}
		});
		
		$('#endDate').change(function () {
			$(`#${weekdayId}`).prop('selectedIndex', 0);
			$(`#${beginTimeId}`).prop('selectedIndex', 0);
			$(`#${endTimeId}`).prop('selectedIndex', 0);
			$('#weekdayId0').prop('selectedIndex', 0);
			$('#beginTimeId0').prop('selectedIndex', 0);
			$('#endTimeId0').prop('selectedIndex', 0);
			$('#weekdayId0').prop('disabled', false);
			$('#beginTimeId0').prop('disabled', false);
			$('#beginTimeId0 option:not(:first)').remove();
			$('#endTimeId0 option:not(:first)').remove();
			
			// timeResult 값만큼 반복적으로 항목 삭제
			while (timeResult > 0) {
			    let lastTimeResult = timeResult;  // 현재 timeResult 값
			    let lastRowId = 'weekday' + lastTimeResult;  // 동적으로 생성된 ID 생성

			    // 해당 ID를 가진 tr 삭제
			    $('#' + lastRowId).closest('tr').remove();

			    timeResult--;  // timeResult 감소
			}
		});
		

        let html = `
            <tr id="weekday${timeResult}">
                <td class="bg-[#f4f4f4] lecutre-title-align"></td>
                <td>
                    <select id="${weekdayId}" class="form-select weekday-select form-input disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed" name="lectureWeekday[${timeResult}].weekdayCode">
                        <option value="" disabled selected>요일</option>
                    </select>
                </td>
                <td colspan="2">
                    <div class="flex justify-between">
                        <select id="${beginTimeId}" class=" mr-3 form-input disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed" name="lectureWeekday[${timeResult}].beginTimeCode" onchange="disableSelectedOption()">
                            <option value="" disabled selected>시작시간</option>
                        </select>
                        <div>~</div>
                        <select id="${endTimeId}" class=" ml-3 form-input disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed" name="lectureWeekday[${timeResult}].endTimeCode" disabled>
                            <option value="" disabled selected>종료시간</option>
                        </select>
                    </div>
                </td>
            </tr>
        `;

        $('#timeDiv').append(html);

        // 요일 데이터 가져오기 및 옵션 추가
        $.get(`http://${locations}:${ports}/academy/restapi/getWeekday`, function (data) {
            data.forEach(cwk => {
                $(`#${weekdayId}`).append(`<option value="${cwk.code}">${cwk.name}</option>`);
            });
        });

		$(`#${weekdayId}`).click(function () {
			// 이전 요일박스에 선택되어있는 요일은 선택할 수 없게 하기 위함.
		    for (let i = 0; i < timeResult; i++) {
		        let previousWeekdayId = `weekdayId${i}`;
		        let previousValue = $(`#${previousWeekdayId}`).val(); // 이전 요일 선택 박스의 선택된 값

		        if (previousValue) {
		            // 이전 요일 값이 선택되어 있으면, 현재 요일 박스에서 해당 값을 비활성화
		            $(`#${weekdayId} option`).each(function () {
		                if ($(this).val() === previousValue) {
		                    $(this).prop('disabled', true); // 이전에 선택된 요일을 비활성화
		                }
		            });
		        }
		    }
		});
		
		// 시작시간을 수정 시, 종료시간에 선택했던 값은 초기화처리.
		$(`#${beginTimeId}`).change(function () {
			if ($(`#${endTimeId}`).val() != '') {
				$(`#${endTimeId}`).prop('selectedIndex', 0);
			}
		});
			
        // 요일 선택 시, 시간 데이터를 가져오는 이벤트 바인딩
        $(`#${weekdayId}`).change(function () {
            const selectedWeekday = $(this).val(); // 선택된 요일 값
			const startDate = $('#beginDate').val();
			const endDate = $('#endDate').val();
			const roomId = $('#classroomList').val();
			
            if (!startDate || !endDate || !roomId) {
				$('select').css('visibility', 'hidden');
				modalBackgroundNoLectureDate.classList.toggle('hidden', false);
				modalBackgroundNoLectureDate.classList.toggle('block', true);
                return;
            }

            // 이전 시간 데이터 초기화
            $(`#${beginTimeId}`).empty().append('<option value="" disabled selected>시작시간</option>');

            // 선택된 데이터를 REST API로 전달하여 시간 데이터 요청
            $.ajax({
                url: `http://${locations}:${ports}/academy/restapi/getBeginLectureTime`,
				contentType: 'application/json', 
                type: 'POST',
                data: JSON.stringify({
                    weekdayCode: selectedWeekday,
                    beginDate: startDate,
                    endDate: endDate,
                    classroomNo: roomId
                }),
                success: function (data) {
					
                    data.forEach(ct => {
                        $(`#${beginTimeId}`).append(`<option value="${ct.code}">${ct.name}</option>`);
                    });
                },
                error: function () {
                    alert('시간 데이터를 가져오는 중 오류가 발생했습니다.');
                }
            });
        });
		
		$(`#${weekdayId}`).on('change', function () {
	        const selectedWeekday = $(`#${weekdayId}`).val(); // 선택된 요일 값
			const startDate = $('#beginDate').val();
			const endDate = $('#endDate').val();
			const roomId = $('#classroomList').val();
			
	        if (!startDate || !endDate || !roomId) {
				$('select').css('visibility', 'hidden');
				modalBackgroundNoLectureDate.classList.toggle('hidden', false);
				modalBackgroundNoLectureDate.classList.toggle('block', true);
	            return;
	        }
	
	        // 이전 시간 데이터 초기화
	        $(`#${endTimeId}`).empty().append('<option value="" disabled selected>종료시간</option>');
	
	        // 선택된 데이터를 REST API로 전달하여 시간 데이터 요청
	        $.ajax({
	            url: `http://${locations}:${ports}/academy/restapi/getEndLectureTime`,
				contentType: 'application/json', 
	            type: 'POST',
	            data: JSON.stringify({
	                weekdayCode: selectedWeekday,
	                beginDate: startDate,
	                endDate: endDate,
	                classroomNo: roomId
	            }),
	            success: function (data) {
					console.log(data);
	                data.forEach(ct => {
	                    $(`#${endTimeId}`).append(`<option value="${ct.code}">${ct.name}</option>`);
	                });
	            },
	            error: function () {
	                alert('시간 데이터를 가져오는 중 오류가 발생했습니다.');
	            }
	        });
	    });
    }
	console.log('timeResult : ' + timeResult);
});

// 요일 선택 시, 시작시간 데이터를 가져오는 이벤트 바인딩
$('#weekdayId0').on('change', function () {
    const selectedWeekday = $(this).val(); // 선택된 요일 값
	const startDate = $('#beginDate').val();
	const endDate = $('#endDate').val();
	const roomId = $('#classroomList').val();
	
    if (!startDate || !endDate || !roomId) {
		 $('select').prop('disabled', true);
		modalBackgroundNoLectureDate.classList.toggle('hidden', false);
		modalBackgroundNoLectureDate.classList.toggle('block', true);
        return;
    }

    // 이전 시간 데이터 초기화
    $('#beginTimeId0').empty().append('<option value="" disabled selected>시작시간</option>');

    // 선택된 데이터를 REST API로 전달하여 시간 데이터 요청
    $.ajax({
        url: `http://${locations}:${ports}/academy/restapi/getBeginLectureTime`,
		contentType: 'application/json', 
        type: 'POST',
        data: JSON.stringify({
            weekdayCode: selectedWeekday,
            beginDate: startDate,
            endDate: endDate,
            classroomNo: roomId
        }),
        success: function (data) {
			
            data.forEach(ct => {
                $('#beginTimeId0').append(`<option value="${ct.code}">${ct.name}</option>`);
            });
        },
        error: function () {
            alert('시간 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    });
});

// 시작시간 선택 시, 종료시간 데이터를 가져오는 이벤트 바인딩
$('#weekdayId0').on('change', function () {
    const selectedWeekday = $(this).val(); // 선택된 요일 값
	const startDate = $('#beginDate').val();
	const endDate = $('#endDate').val();
	const roomId = $('#classroomList').val();
	
    if (!startDate || !endDate || !roomId) {
		 $('select').prop('disabled', true);
		modalBackgroundNoLectureDate.classList.toggle('hidden', false);
		modalBackgroundNoLectureDate.classList.toggle('block', true);
        return;
    }

    // 이전 시간 데이터 초기화
    $('#endTimeId0').empty().append('<option value="" disabled selected>종료시간</option>');

    // 선택된 데이터를 REST API로 전달하여 시간 데이터 요청
    $.ajax({
        url: `http://${locations}:${ports}/academy/restapi/getEndLectureTime`,
		contentType: 'application/json', 
        type: 'POST',
        data: JSON.stringify({
            weekdayCode: selectedWeekday,
            beginDate: startDate,
            endDate: endDate,
            classroomNo: roomId
        }),
        success: function (data) {
			
            data.forEach(ct => {
                $('#endTimeId0').append(`<option value="${ct.code}">${ct.name}</option>`);
            });
        },
        error: function () {
            alert('시간 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    });
});

// 시작시간 변경 시, 종료시간 초기화.
$('#beginTimeId0').change(function () {
	if ($('#endTimeId0').val() != '') {
		$('#endTimeId0').prop('selectedIndex', 0);
	}
});


// 강의시간 입력 필드 삭제
$('#BtnEndTime').click(function() {
    // #timeDiv 내에 tr 요소가 하나 이상 존재하는지 확인
    if ($('#timeDiv tr').length <= 1) { // 첫 번째 tr은 기본 요소이므로 1개 이상이어야 삭제 가능
        // alert('삭제할 항목이 없습니다.');
    } else {
        // 마지막으로 추가된 tr의 ID
        let lastTimeResult = timeResult;  // 현재 timeResult 값 (마지막 추가된 항목)

        // 동적으로 생성된 필드들의 ID를 기반으로 삭제
        let lastRowId = 'weekday' + lastTimeResult;

        // 마지막 tr 삭제
        $('#' + lastRowId).closest('tr').remove();  // 해당 tr 삭제

        timeResult--;  // timeResult 감소
		
		let weekdayId = 'weekdayId' + timeResult;
        let beginTimeId = 'beginTimeId' + timeResult;
        let endTimeId = 'endTimeId' + timeResult;
		$(`#${weekdayId}`).prop('disabled', false);
		$(`#${beginTimeId}`).prop('disabled', false);
		$(`#${endTimeId}`).prop('disabled', false);
    }
});

// 트리에 팀명이 선택되는 것을 방지하기위해서 팀명 리스트로 받아오기.
const departmentName = [];
$.ajax({
    url: `http://${locations}:${ports}/academy/restapi/getDepartment`,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
		// name 필드값을 추출해서 리스트로 변환.
		$.each(data, function(index, item) {
            departmentName.push(item.name); // departmentName 배열에 name 필드값 추가
        });
	},
	error: (xhr, status, error) => {
        console.error('Error:', error);
    }
});
console.log(departmentName);

// 트리에 사원목록 출력.
$.ajax({
    url: `http://${locations}:${ports}/academy/restapi/employeeListNode`,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
			var tree = new tui.Tree('#tree', { // Tree 컴포넌트를 초기화하는 생성자.
			    data: data, // 데이터를 가져옴.
			    nodeDefaultState: 'opened' // 모든 노드가 기본적으로 열린 상태.
			}).enableFeature('Selectable', { // Tree 컴포넌트 추가기능 설정.
			    selectedClassName: 'tui-tree-selected', // 선택된 노드의 CSS설정.
			});

			var selectedBtn = document.getElementById('selectedBtn');
			var deselectedBtn = document.getElementById('deselectedBtn');
			var rootNodeId = tree.getRootNodeId();
			var firstChildId = tree.getChildIds(rootNodeId)[0];
			var selectedValue = document.getElementById('selectedValue');
			var selectedNode = null; // 선택된 노드를 추적하는 변수
			
			// 팀명 선택 방지
		    tree.on('beforeSelect', function(eventData) {
		        var nodeData = tree.getNodeData(eventData.nodeId);
				$.each(departmentName, function(i, department) {
			        if (nodeData.text.includes(department)) { // 팀명 조건 설정
						console.log(nodeData.text.includes(department))
			            console.log('팀명은 선택할 수 없습니다.');
						eventData.preventDefault(); // 기본 동작 취소 (선택 방지)
			            return false; // 선택 방지
			        }
			    });
		    });

			// 트리의 루트노드ID를 가져옴.
			tree.on('select', function(eventData) {
			    var nodeData = tree.getNodeData(eventData.nodeId);
				selectedValue.value = 'selected : ' + nodeData.text;
			    selectedNode = nodeData; // 선택된 노드 정보 저장
			    console.log('Selected:', selectedNode.text);
			});

			// 트리에서 선택된 항목을 선택해제함.
			tree.on('deselect', function(eventData) {
			    var nodeData = tree.getNodeData(eventData.nodeId);
			    selectedValue.value = 'deselected : ' + nodeData.text;
			});

			util.addEventListener(selectedBtn, 'click', function() {
			    tree.select(firstChildId);
			});

			util.addEventListener(deselectedBtn, 'click', function() {
			    tree.deselect();
			});

			// "추가" 버튼 클릭 이벤트 처리
			var element = document.getElementById('inputContainer');
			var inputs = element.querySelectorAll('input:not([type="hidden"])');
			var approvalPeopleResult = inputs.length;
			console.log('approvalPeopleResult : ' + approvalPeopleResult);
			$('#addEmployeeListButton').click(function() {
			    if (selectedNode && selectedNode.text) { // selectedNode가 정의되고 text가 존재하는지 확인.
			        var approvalPeoplesId = 'approvalPeoples' + approvalPeopleResult;
			        var approvalRemoveBtnId = 'approvalRemoveBtn' + approvalPeopleResult;
			        let html = `
			            <div class="flex w-full mb-1">
			                <input id="${approvalPeoplesId}" type="text" class="form-input ltr:rounded-r-none rtl:rounded-l-none" name="approval" value="${selectedNode.text}" readonly/>
			                <button id="${approvalRemoveBtnId}" type="button" class="btn btn-danger ltr:rounded-l-none rtl:rounded-r-none" style="width: 80px;">삭제</button>
			            </div>
			        `;
					
					
					if (approvalPeopleResult < 3) {
						// 중복 여부 확인
				        var isDuplicate = false;
				        $('#inputContainer input:not([type="hidden"])').each(function() {
				            if ($(this).val().trim() === selectedNode.text.trim()) {
				                isDuplicate = true;
				                return false; // 반복문 중단
				            }
				        });
						
						if (isDuplicate == false) {
							$('#inputContainer').append(html);  // HTML을 inputContainer에 추가
							approvalPeopleResult++; // 추가할 때마다 approvalPeopleResult 증가
						} else {
							modalBackgroundAddExist.classList.toggle('hidden', false);
							modalBackgroundAddExist.classList.toggle('block', true);
						}
					}
			        else {
						modalBackgroundAddOver.classList.toggle('hidden', false);
						modalBackgroundAddOver.classList.toggle('block', true);
					}
			        // 로그 출력
			        console.log(approvalPeopleResult);
			        
			    } else {
			        // alert('트리 항목을 선택하세요!');
			    }
			});

			// 삭제버튼 클릭 시 해당 input과 삭제 버튼을 삭제.
			$(document).on('click', '.btn-danger', function() {
			    // 클릭된 삭제 버튼의 부모 요소인 .flex를 삭제
			    $(this).closest('.flex').remove();
				approvalPeopleResult--;
				console.log(approvalPeopleResult);
			});
		},
    error: (xhr, status, error) => {
        console.error('Error:', error);
    }
});
	
// 브라우저에 맞는 맞춤형 메서드를 제공.
var util = {
    addEventListener: function(element, eventName, handler) {
        if (element.addEventListener) {
            element.addEventListener(eventName, handler, false);
        } else {
            element.attachEvent('on' + eventName, handler);
        }
    }
};

// DOM이 준비된 후에 실행
document.addEventListener('DOMContentLoaded', function() {
    // ID로 요소를 찾습니다.
    var selectedBtn = document.getElementById('selectedBtn');
    var deselectedBtn = document.getElementById('deselectedBtn');

    // 버튼이 존재하는지 확인
    if (selectedBtn && deselectedBtn) {
        // 버튼에 클릭 이벤트 리스너 추가
        util.addEventListener(selectedBtn, 'click', function() {
            tree.select(firstChildId);
        });

        util.addEventListener(deselectedBtn, 'click', function() {
            tree.deselect();
        });
    } else {
        console.log("Buttons not found!");
    }
});


var element = document.getElementById('fileCount');
let result = 0; // 기본 값 설정

// element가 존재하고 input 태그가 있는 경우만 처리
if (element) {
    var inputs = element.querySelectorAll('input:not([type="hidden"])');
    result = inputs ? inputs.length : 0; // inputs가 null 또는 undefined일 경우 0으로 설정
}

// 첨부파일 폼 추가버튼 클릭 시
$('#btnAddFile').click(function(){
	console.log('result 값 : ' + result);
	// 마지막 파일 입력필드가 비어있다면
	if ($('#fileDiv input[type="file"]').last().val() === '') {
		modalBackgroundAddFileError.classList.toggle('hidden', false);
		modalBackgroundAddFileError.classList.toggle('block', true);
	} else {	
		result++; // result 증가( 파일 입력 필드마다 고유 값이 생성됨)
		
		let inputId = 'attendanceApprovalFile' + result; // 고유한 inputId 생성
		let displayId = 'attendanceApprovalFileNameDisplay' + result; // 고유한 displayId 생성
		let removeButtonId = 'removeFileBtn' + result;	// 고유한 removeButtonId 생성 (휴지통 버튼)
		
		let html = `
			<div class="flex mt-1 w-full" id = "fileField${result}">
	       		<!-- 커스텀 버튼 -->
	           <button 
	               type="button" 
	               class="btn btn-primary ltr:rounded-r-none rtl:rounded-l-none" 
	               style="width: 150px;"
	               onclick="document.getElementById('${inputId}').click();">
	               파일 선택
	           </button>
	           <!-- 숨겨진 파일 입력 -->
	           <input 
	               id="${inputId}" 
	               name="lectureApprovalFile"
	               type="file" 
	               class="hidden"
	               multiple
	               onchange="document.getElementById('${displayId}').value = this.files[0] ? this.files[0].name : '';" />
	           <!-- 파일 이름 표시 -->
	           <input 
	               id="${displayId}" 
	               type="text" 
	               placeholder="첨부된 파일이 없습니다."
	               class="form-input ltr:rounded-l-none rtl:rounded-r-none flex-grow" 
	               readonly />
	           <!-- 휴지통 버튼 -->
	           <button
	           		type="button"
	           		class = "btn btn-outline-danger ml-2"
	           		id = "${removeButtonId}"
	           		onclick="removeFileField(${result});"
	           		<!--휴지통 아이콘추가-->
	           		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		           		<path
		           			opacity="0.5"
		           			d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12405C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001Z"
		           			fill="currentColor"
		           		/>
		           		<path
		           			d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z"
		           			fill="currentColor"
		           		/>
		           		<path
		           			fill-rule="evenodd"
		           			clip-rule="evenodd"
		           			d="M9.42543 11.4815C9.83759 11.4381 10.2051 11.7547 10.2463 12.1885L10.7463 17.4517C10.7875 17.8855 10.4868 18.2724 10.0747 18.3158C9.66253 18.3592 9.29499 18.0426 9.25378 17.6088L8.75378 12.3456C8.71256 11.9118 9.01327 11.5249 9.42543 11.4815Z"
		           			fill="currentColor"
		           		/>
		           		<path
		           			fill-rule="evenodd"
		           			clip-rule="evenodd"
		           			d="M14.5747 11.4815C14.9868 11.5249 15.2875 11.9118 15.2463 12.3456L14.7463 17.6088C14.7051 18.0426 14.3376 18.3592 13.9254 18.3158C13.5133 18.2724 13.2126 17.8855 13.2538 17.4517L13.7538 12.1885C13.795 11.7547 14.1625 11.4381 14.5747 11.4815Z"
		           			fill="currentColor"
		           		/>
		           	</svg>
	           </button>
	       </div>
		`;
		
		$('#fileDiv').append(html);	// 파일 입력 필드 추가
	}
});

// 휴지통 버튼 클릭시 호출 (파일 입력 폼과 해당 휴지통 버튼을 삭제하는 함수)
function removeFileField(fileId) {
	// 해당 파일 입력폼과 휴지통 버튼을 포함하는 div 제거
	$('#fileField'+fileId).remove();
	$('#fileFieldId'+fileId).remove();
	
}

// 기존파일 input에서 파일을 수정할 시 기존 파일이름이 있는 hidden제거.
function alreadyChangeFile() {
	document.getElementById('${displayId}').value = this.files[0] ? this.files[0].name : '';
	// 파일이 선택되면 hidden 속성을 제거
	    if (fileName) {
	        displayElement.removeAttribute('hidden');
	    } else {
	        displayElement.setAttribute('hidden', true);
	    }
}

// 강의시간에서 시작시간을 선택했을 때 종료시간을 선택할 때 시작시간 이전의 시간은 선택되지 안
function disableSelectedOption() {
	
	console.log('disableSelectedOption 호출됨')
    // 첫 번째 <select> 요소의 값 가져오기
    var getBeginTimeId  = 'beginTimeId' + timeResult;
    var beginTimeId = document.getElementById(getBeginTimeId);
    var selectedValue1 = beginTimeId.value;
	
    // 두 번째 <select> 요소 가져오기
    var getEndTimeId  = 'endTimeId' + timeResult;
    var endTimeId = document.getElementById(getEndTimeId);

    // 종료시간을 비활성화 처리
    if (selectedValue1 !== '') {
        endTimeId.disabled = false; // 시작시간이 선택되었으면 종료시간 활성화
    } else {
        endTimeId.disabled = true; // 시작시간이 선택되지 않으면 종료시간 비활성화
    }

    // 첫 번째 <select>에서 선택된 값과 일치하는 옵션 비활성화
    for (var i = 0; i < endTimeId.options.length; i++) {
        if (endTimeId.options[i].value <= selectedValue1) {
            endTimeId.options[i].disabled = true;
        }
    }

    // 이전 시간 저장 변수
    var previousValue = parseInt(selectedValue1); // 시작 시간
    var selectedValue = false;
    var selectedIndex = beginTimeId.selectedIndex; // 선택된 값의 인덱스 가져오기
    var previousValue = parseInt(beginTimeId.options[selectedIndex].text); // 선택된 텍스트 값

    // 선택된 옵션 이후부터 루프 실행
    for (var i = selectedIndex; i < endTimeId.options.length; i++) {
        var optionText = parseInt(endTimeId.options[i].text); // 현재 옵션의 텍스트 값 (숫자로 변환)
		endTimeId.options[i].disabled = false;
        if (selectedValue === true) {
            endTimeId.options[i].disabled = true;
        } else if (optionText > previousValue + 1) {
            endTimeId.options[i].disabled = true;
            selectedValue = true;
        }

        // 이전 값을 갱신
        previousValue = optionText;
    }
}

// 강의수정페이지에서 강의시간 재선택 버튼을 누르면 기존 강의시간 숨김처리 후 새로운 입력창 출력.
$('#modifyLectureTime').click(function () {
    $('#alreadyLectureTime').remove();; // 숨김 처리
    $('#newLectureTime').removeAttr('hidden');     // 숨김 해제
});

// 강의수정페이지에서 강의날짜 항목을 하나라도 변경하면 기존 강의시간 숨김처리 후 새로운 입력창 출력.
$(document).on('change', '#classroomList', function () {
	$('#alreadyLectureTime').remove();; // 숨김 처리
	$('#weekdayId0').prop('selectedIndex', 0);
	$('#beginTimeId0').prop('selectedIndex', 0);
	$('#endTimeId0').prop('selectedIndex', 0);
	$('#weekdayId0').prop('disabled', false);
	$('#beginTimeId0').prop('disabled', false);
	$('#endTimeId0').prop('disabled', true);
	$('#beginTimeId0 option:not(:first)').remove();
	$('#endTimeId0 option:not(:first)').remove();
	$('#newLectureTime').removeAttr('hidden');     // 숨김 해제
});
$(document).on('change', '#beginDate', function () {
	$('#alreadyLectureTime').remove();; // 숨김 처리
	$('#weekdayId0').prop('selectedIndex', 0);
	$('#beginTimeId0').prop('selectedIndex', 0);
	$('#endTimeId0').prop('selectedIndex', 0);
	$('#weekdayId0').prop('disabled', false);
	$('#beginTimeId0').prop('disabled', false);
	$('#endTimeId0').prop('disabled', true);
	$('#beginTimeId0 option:not(:first)').remove();
	$('#endTimeId0 option:not(:first)').remove();
	$('#newLectureTime').removeAttr('hidden');     // 숨김 해제
});
$(document).on('change', '#endDate', function () {
	$('#alreadyLectureTime').remove();; // 숨김 처리
	$('#weekdayId0').prop('selectedIndex', 0);
	$('#beginTimeId0').prop('selectedIndex', 0);
	$('#endTimeId0').prop('selectedIndex', 0);
	$('#weekdayId0').prop('disabled', false);
	$('#beginTimeId0').prop('disabled', false);
	$('#endTimeId0').prop('disabled', true);
	$('#beginTimeId0 option:not(:first)').remove();
	$('#endTimeId0 option:not(:first)').remove();
	$('#newLectureTime').removeAttr('hidden');     // 숨김 해제
});
