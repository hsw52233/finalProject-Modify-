// 기존에 신청한 연차개수
let beforeCount;
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
	
	document.addEventListener('DOMContentLoaded', function () {
	    const beginDateInput = document.getElementById('beginDate');
	    const endDateInput = document.getElementById('endDate');

	    // Flatpickr 초기화 - 신청종료날짜
	    const endDatePicker = flatpickr(endDateInput, {
	        dateFormat: 'Y-m-d',
	        clickOpens: false, // 초기에는 비활성화
	    });

	    // Flatpickr 초기화 - 신청시작날짜
	    flatpickr(beginDateInput, {
	        dateFormat: 'Y-m-d',
	        onChange: (selectedDates) => {
				
	            if (selectedDates.length > 0) {
	                const selectedDate = selectedDates[0];

	                // 신청종료날짜 캘린더 활성화 및 최소 날짜 설정
	                endDateInput.readonly = false;
	                endDatePicker.set('minDate', selectedDate); // 최소 날짜 설정
	                endDatePicker.set('clickOpens', true); // 달력 활성화
	            } else {
	                // 신청시작날짜 선택 해제 시 종강일 초기화 및 비활성화
	                endDatePicker.clear();
	                endDateInput.readonly = true;
	                endDatePicker.set('clickOpens', false); // 달력 비활성화
	            }
	        },
	    });

	    // 초기 상태에서 신청종료날짜 비활성화
	    endDateInput.readonly = true;
	});
	
	// 연차일수 계산
	// 1. 신청 종류 가져오기
    const attendanceType = document.querySelector('input[name="attendanceApprovalType"]:checked').value;

    // 2. 시작 날짜와 종료 날짜 가져오기
    const startDate = document.getElementById('beginDate').value;
    const endDate = document.getElementById('endDate').value;

    // 3. 날짜 범위의 주말 제외 계산 함수
    function calculateBusinessDays(start, end) {
        const startDay = new Date(start);
        const endDay = new Date(end);
        let totalDays = 0;	// 평일 개수를 저장할 변수

        for (let d = startDay; d <= endDay; d.setDate(d.getDate() + 1)) {
            const day = d.getDay();
            if (day !== 0 && day !== 6) { // 0: Sunday, 6: Saturday
                totalDays++;
            }
        }

        return totalDays;
    }

    // 4. 주말 제외한 총 날짜 계산
    const totalDays = calculateBusinessDays(startDate, endDate);

	// 5. 신청 종류에 따른 계산
    
    if (attendanceType === 'CT003' || attendanceType === 'CT004') { // 오전 반차 또는 오후 반차
        beforeCount = totalDays * 0.5;
    } else if(attendanceType === 'CT001' || attendanceType === 'CT009'){ // 병가, 공가
		beforeCount = 0;
	} else { // 연차
        beforeCount = totalDays * 1;
    }
	console.log('기존신청연차', beforeCount);
	
});

// 첨부파일 관련
var element = document.getElementById('fileCount');
let result = 0;  // 전역 변수로 result 선언
// 유효성 문구 노출위해서 필요
let inputIds = []; // 모든 inputId를 저장
let displayIds = []; // 모든 displayId를 저장
let removeButtonIds = []; // 모든 removeButtonId를 저장
let errMsgs = [] // 모든 errMsg를 저장

// element가 존재하고 input 태그가 있는 경우
if(element){
	var inputs = element.querySelectorAll('input:not([type="hidden"])');	
	result = inputs ? inputs.length : 0;	// inputs가 null 또는 undefined일 경우 0로 설정
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
		let errMsg = 'errMsg' + result;	// 고유한 errMsg 생성
		
		inputIds.push(inputId); // 배열에 추가
		displayIds.push(displayId);	// 배열에 추가
		removeButtonIds.push(removeButtonId);	// 배열에 추가
		errMsgs.push(errMsg);
		
		let html = `
			<div id = "fileField${result}">
				<div class="flex mt-1" >
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
					   name="attendanceApprovalFiles"
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
				<div class="mt-1" >	<!-- 유효성문구 -->
					<span id = "${errMsg}" class="msg date-error error-label" style="display: none;">파일을 첨부해주세요.</span>
				</div>
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
	
	// 삭제된 필드의 ID를 배열에서 제거
	inputIds = inputIds.filter(inputId => inputId !== 'attendanceApprovalFile' + fileId);
	displayIds = displayIds.filter(displayId => displayId !== 'attendanceApprovalFileNameDisplay' + fileId);
	removeButtonIds = removeButtonIds.filter(removeButtonId => removeButtonId !== 'removeFileBtn' + fileId);	
	errMsgs = errMsgs.filter(errMsg => errMsg !== 'errMsg' + fileId);	
}

// 유효성 검사 
$('#updateBtn').click(function() {
    let isVal = true;
   
	// 신청날짜_시작날짜 검사
    if ($('#beginDate').val().trim() === '') {
        $('#beginDate').addClass("errorInput");
        $('.date-error').show();
        isVal = false;
    } else {
        $('.date-error').hide();
        $('#beginDate').removeClass("errorInput");
    }
	
	// 신청날짜_종료날짜 검사
    if ($('#endDate').val().trim() === '') {
        $('#endDate').addClass("errorInput");
        $('.date-error').show();
        isVal = false;
    } else {
        $('.date-error').hide();
        $('#endDate').removeClass("errorInput");
    }
	
	// 결재제목 검사
	if ($('#attendanceApprovalTitle').val().trim() === '') {
	    $('#attendanceApprovalTitle').addClass("errorInput");
	    $('.attendanceApprovalTitle-error').show();
	    isVal = false;
	} else {
	    $('.attendanceApprovalTitle-error').hide();
	    $('#attendanceApprovalTitle').removeClass("errorInput");
	}
	
	// 결재내용 검사
	if ($('#attendanceApprovalContent').val().trim() === '') {
        $('#attendanceApprovalContent').addClass("textarea-error");
        $('.attendanceApprovalContent-error').show();
        isVal = false;
    } else {
        $('.attendanceApprovalContent-error').hide();
        $('#attendanceApprovalContent').removeClass("textarea-error");
    }
	
	// #inputContainer에 input 요소가 하나도 없으면 추가된 항목이 없다고 판단
    if ($('#inputContainer input:not([type="hidden"])').length === 0) {
        isVal = false;
		console.log('결재선이 비어있습니다.');
		modalBackgroundApprovalValidation.classList.toggle('hidden', false);
		modalBackgroundApprovalValidation.classList.toggle('block', true);
    }
	
	// 첨부파일 검사	
	inputIds.forEach((inputId, index) => {
		let fileInput = $('#' + inputId)
		let displayInput = $('#' + displayIds[index]);
		let errMsg = $('#' + errMsgs[index]);
		
		if(fileInput.val().trim() === ''){
			displayInput.addClass("errorInput");
			errMsg.show();
			isVal = false;
		} else{
			displayInput.removeClass("errorInput");
			errMsg.hide();
		}		
	});
 	
	// 연차일수 계산
	// 1. 신청 종류 가져오기
    const attendanceType = document.querySelector('input[name="attendanceApprovalType"]:checked').value;

    // 2. 시작 날짜와 종료 날짜 가져오기
    const startDate = document.getElementById('beginDate').value;
    const endDate = document.getElementById('endDate').value;

    // 3. 날짜 범위의 주말 제외 계산 함수
    function calculateBusinessDays(start, end) {
        const startDay = new Date(start);
        const endDay = new Date(end);
        let totalDays = 0;	// 평일 개수를 저장할 변수

        for (let d = startDay; d <= endDay; d.setDate(d.getDate() + 1)) {
            const day = d.getDay();
            if (day !== 0 && day !== 6) { // 0: Sunday, 6: Saturday
                totalDays++;
            }
        }

        return totalDays;
    }

    // 4. 주말 제외한 총 날짜 계산
    const totalDays = calculateBusinessDays(startDate, endDate);

	// 5. 신청 종류에 따른 계산
    let finalCount;
    if (attendanceType === 'CT003' || attendanceType === 'CT004') { // 오전 반차 또는 오후 반차
        finalCount = totalDays * 0.5;
    } else if(attendanceType === 'CT001' || attendanceType === 'CT009'){ // 병가, 공가
		finalCount = 0;
	} else { // 연차
        finalCount = totalDays * 1;
    }

	// 연차 개수 유효성검사
	let annualLeave = parseFloat($('#annualLeave').val()) + beforeCount;
	if (annualLeave < finalCount) {	// 잔여연차 < 사용일수
		modalBackgroundAnnualOver.classList.toggle('hidden', false);
		modalBackgroundAnnualOver.classList.toggle('block', true);
		isVal = false;
    }
	console.log('annualLeave::::', annualLeave);
	
	document.getElementById('annualLeaveJS').textContent = annualLeave;
	
	
    // 폼 제출
    if (isVal) {
        console.log("submit 성공");
        $('#updateForm').submit();
    } 
});



// 밑에부터 모달관련

// 결재선추가 모달
// 모달 관련 DOM 요소
const openModalButtonAddPeople = document.getElementById('openModalButtonAddPeople');	// 결재선 추가 버튼
const closeModalButtonAddPeople = document.getElementById('closeModalButtonAddPeople');	// 모달 내 x 버튼
const modalBackgroundAddPeople = document.getElementById('modalBackgroundAddPeople');
const modalWrapperAddPeople = document.getElementById('modalWrapperAddPeople');
const applyModalButtonAddPeople = document.getElementById('applyModalButtonAddPeople');	// 모달 내 확정 버튼

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
// 확정버튼 클릭시
if (applyModalButtonAddPeople) applyModalButtonAddPeople.addEventListener('click', () => {
	// 해당 id를 가진 요소를 찾음
	var element = document.getElementById('inputContainer');
	if (element) {
        // 요소 내의 모든 input 태그들을 찾음
        var inputs = element.querySelectorAll('input:not([type="hidden"])');
        
        if (inputs.length > 0) {
            // 각 input 태그의 value 값을 출력
            inputs.forEach(function(input, index) {
                console.log(`Input ${index + 1}:`, input.value);
				console.log(inputs.length);
				let html = `
		            <div class="flex w-full mb-1">
		                <input name="approvers" class="text-center w-full" value="${input.value}" readonly></input>
		            </div>
		        `;
				
				
				$('#alreadyPeople').attr('hidden', true);	// hidden 속성 추가로 화면에서 노출안됨
				$('#newPeople').removeAttr('hidden'); // #newPeople의 hidden 속성제거
				if (inputs.length == 0) {
					$('#people1 .flex').remove();
					$('#people2 .flex').remove();
					$('#people3 .flex').remove();
				} else if (inputs.length == 1) { // 값이 1개라면
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
			
			$('#alreadyPeople').attr('hidden', true);	// hidden 속성 추가로 화면에서 노출안됨
			$('#newPeople').removeAttr('hidden'); // #newPeople의 hidden 속성제거
        }
    } else {
        console.log(`id "${elementId}"를 가진 요소를 찾을 수 없습니다.`);
    }
	closeModalAddPeople();
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

/* 트리
var util = {
            addEventListener: function(element, eventName, handler) {
                if (element.addEventListener) {
                    element.addEventListener(eventName, handler, false);
                } else {
                    element.attachEvent('on' + eventName, handler);
                }
            }
        };

var data = [
    {text: 'rootA', children: [
        {text: 'sub-A1'},
        {text: 'sub-A2'},
        {text: 'sub-A3'},
        {text: 'sub-A4'},
        {text: 'sub-A5', state: 'closed', children: [
            {text:'sub-A5A', children:[
                {text:'sub-A5A1'}
            ]},
            {text:'sub_A5B'}
        ]},
        {text: 'sub-A6'},
        {text: 'sub-A7'},
        {text: 'sub-A8'},
        {text: 'sub-A9', state: 'closed', children: [
            {text:'sub-A9A'},
            {text:'sub-A9B'}
        ]},
        {text: 'sub-A10'},
        {text: 'sub-A11'},
        {text: 'sub-A12'}
    ]},
    {text: 'rootB', state:'closed', children: [
        {text:'sub-B1'},
        {text:'sub-B2'},
        {text:'sub-B3'}
    ]}
];

var tree = new tui.Tree('#tree', {
    data: data,
    nodeDefaultState: 'opened'
}).enableFeature('Selectable', {
    selectedClassName: 'tui-tree-selected',
});

var selectedBtn = document.getElementById('selectedBtn');
var deselectedBtn = document.getElementById('deselectedBtn');
var rootNodeId = tree.getRootNodeId();
var firstChildId = tree.getChildIds(rootNodeId)[0];
var selectedValue = document.getElementById('selectedValue');

tree.on('select', function(eventData) {
    var nodeData = tree.getNodeData(eventData.nodeId);
    selectedValue.value = 'selected : ' + nodeData.text;
});

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
*/

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
if (employeeBtnAddAddOver) employeeBtnAddAddOver.addEventListener('click', closeModalAddOver);     // 취소

// 결재선 미입력 모달 관련 DOM 요소
const closeModalButtonApprovalValidation = document.getElementById('closeModalButtonApprovalValidation');
const modalBackgroundApprovalValidation = document.getElementById('modalBackgroundApprovalValidation');
const modalWrapperApprovalValidation = document.getElementById('modalWrapperApprovalValidation');
const checkApprovalValidation = document.getElementById('checkApprovalValidation');

// 결재선 미입력 경고 모달 닫기
const closeModalApprovalValidation = () => {
	  modalBackgroundApprovalValidation.classList.remove('block');
	  modalBackgroundApprovalValidation.classList.add('hidden');  // 모달 배경 숨기기
};

if (closeModalButtonApprovalValidation) closeModalButtonApprovalValidation.addEventListener('click', closeModalApprovalValidation); // [x] 버튼 클릭 시
if (checkApprovalValidation) checkApprovalValidation.addEventListener('click', closeModalApprovalValidation);     // 확인 클릭 시

// 파일첨부 추가오류 모달 관련 DOM 요소
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

// 연차개수 초과오류 모달 관련 DOM 요소
const modalBackgroundAnnualOver = document.getElementById('modalBackgroundAnnualOver');
const modalWrapperAnnualOver = document.getElementById('modalWrapperAnnualOver');
const closeModalButtonAnnualOver = document.getElementById('closeModalButtonAnnualOver');
const checkBtnAnnualOver = document.getElementById('checkBtnAnnualOver');

// 연차개수 초과 오류 모달 닫기
const closeModalAnnualOver = () => {
	  modalBackgroundAnnualOver.classList.remove('block');
	  modalBackgroundAnnualOver.classList.add('hidden');  // 모달 배경 숨기기
};

if (closeModalButtonAnnualOver) closeModalButtonAnnualOver.addEventListener('click', closeModalAnnualOver); // X 버튼 클릭 시
if (checkBtnAnnualOver) checkBtnAnnualOver.addEventListener('click', closeModalAnnualOver);     // 확인 버튼 클릭 시


