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

// 강의날짜 선택
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


// 담당자수정 모달 관련 DOM 요소
const openModalButtonModifyPeople = document.getElementById('openModalButtonModifyPeople');
const closeModalButtonModifyPeople = document.getElementById('closeModalButtonModifyPeople');
const modalBackgroundModifyPeople = document.getElementById('modalBackgroundModifyPeople');
const modalWrapperModifyPeople = document.getElementById('modalWrapperModifyPeople');
const applyModalButtonModifyPeople = document.getElementById('applyModalButtonModifyPeople');

// 강의실 수정모달에서 담당자수정 모달 열기
openModalButtonModifyPeople.addEventListener('click', () => {
  modalBackgroundModifyPeople.classList.remove('hidden');  // 모달 배경 보이기
  modalBackgroundModifyPeople.classList.add('block');     // 모달 배경 보이게 설정
});

// 담당자수정 모달 닫기
const closeModalModifyPeople = () => {
  modalBackgroundModifyPeople.classList.remove('block');
  modalBackgroundModifyPeople.classList.add('hidden');  // 모달 배경 숨기기
};
if (closeModalButtonModifyPeople) closeModalButtonModifyPeople.addEventListener('click', closeModalModifyPeople); // 닫기 버튼 클릭 시

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

// 트리에 사원목록 출력.
$.ajax({
    url: `http://${locations}:${ports}/academy/restapi/employeeListNodeManagement`,
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
			$('#modifyEmployeeButton').click(function() {
			    if (selectedNode && selectedNode.text) { // selectedNode가 정의되고 text가 존재하는지 확인.
			        var employee = selectedNode.text;
			        
			        $('#employeeNo').val(employee); 
			    } else {
			        // alert('트리 항목을 선택하세요!');
			    }
				closeModalModifyPeople();
				
			});
		},
    error: (xhr, status, error) => {
        console.error('Error:', error);
    }
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
        url: `http://${locations}:${ports}/academy/restapi/getBeginLectureTimeFromLectureModify`,
		contentType: 'application/json', 
        type: 'POST',
        data: JSON.stringify({
			lectureApprovalNo: lectureNo,
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

// 시작시간 변경 시, 종료시간 초기화.
$('#beginTimeId0').change(function () {
	if ($('#endTimeId0').val() != '') {
		$('#endTimeId0').prop('selectedIndex', 0);
	}
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
        url: `http://${locations}:${ports}/academy/restapi/getEndLectureTimeFromLectureModify`,
		contentType: 'application/json', 
        type: 'POST',
        data: JSON.stringify({
			lectureApprovalNo: lectureNo,
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

// 강의시간에서 시작시간을 선택했을 때 종료시간을 선택할 때 시작시간 이전의 시간은 선택되지 안
function disableSelectedOption() {
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
			console.log('비활성화 Index : ' + i)
            endTimeId.options[i].disabled = true;
        }
    }

    // 이전 시간 저장 변수
    //var previousValue = parseInt(selectedValue1); // 시작 시간
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
			console.log('optionText : ' + optionText)
			console.log('previousValue : ' + (previousValue + 1))
			
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
                <td></td>
                <td colspan="4">
                    <div class="flex justify-between">
						<select id="${weekdayId}" class="form-select weekday-select form-input disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed mr-3" name="timeList">
	                        <option value="" disabled selected>요일</option>
	                    </select>
                        <select id="${beginTimeId}" class=" mr-3 form-input disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed" name="timeList" onchange="disableSelectedOption()">
                            <option value="" disabled selected>시작시간</option>
                        </select>
                        <div>~</div>
                        <select id="${endTimeId}" class=" ml-3 form-input disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed" name="timeList" disabled>
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
                url: `http://${locations}:${ports}/academy/restapi/getBeginLectureTimeFromLectureModify`,
				contentType: 'application/json', 
                type: 'POST',
                data: JSON.stringify({
					lectureApprovalNo: lectureNo,
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
	            url: `http://${locations}:${ports}/academy/restapi/getEndLectureTimeFromLectureModify`,
				contentType: 'application/json', 
	            type: 'POST',
	            data: JSON.stringify({
					lectureApprovalNo: lectureNo,
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
		
		// 시작시간을 수정 시, 종료시간에 선택했던 값은 초기화처리.
		$(`#${beginTimeId}`).change(function () {
			$(`#${endTimeId}`).prop('selectedIndex', 0);
		});
    }
	console.log('timeResult : ' + timeResult);
});

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
