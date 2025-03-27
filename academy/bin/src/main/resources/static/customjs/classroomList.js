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
	
	

	// 테이블 출력
	Alpine.data('multicolumn', () => ({
	    datatable: null,
	    init() {
	        // AJAX 요청
	        $.ajax({
	            url: `http://${locations}:${ports}/academy/restapi/classroomList`,
	            type: 'GET',
	            dataType: 'json',
	            success: (data) => {
					this.datatable = new simpleDatatables.DataTable('#classroomTable', {
					    data: {
					        headings: ['강의실번호', '강의실명', '담당자', '수용인원수', ''],
					        data: data.map(item => [
								item[0], // 강의실 번호
					            item[1], // 강의실명
								`<div class="flex items-center"><img class="w-9 h-9 rounded-full ltr:mr-2 rtl:ml-2 object-cover" src="./upload/${item[6]}.${item[7]}" /><span>${item[5]}</span>&nbsp;<span style="color: #cccccc;">${item[2]}</span></div>`,
								`<span>${item[3]}명</span>`, // 수용 인원
								userRole === 'Administration' ? 
							    `<div class="flex gap-3">
									<button type="button" x-tooltip="Edit" onclick="openModifyModal(${item[0]})"
											class="p-2 w-12 h-12 flex justify-center items-center hover:text-primary">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
											<path d="M15.2869 3.15178L14.3601 4.07866L5.83882 12.5999L5.83881 12.5999C5.26166 13.1771 4.97308 13.4656 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.32181 19.8021L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L4.19792 21.6782L7.47918 20.5844L7.47919 20.5844C8.25353 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5344 19.0269 10.8229 18.7383 11.4001 18.1612L11.4001 18.1612L19.9213 9.63993L20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178Z" 
											stroke="currentColor" stroke-width="1.5"></path>
											<path opacity="0.5" d="M14.36 4.07812C14.36 4.07812 14.4759 6.04774 16.2138 7.78564C17.9517 9.52354 19.9213 9.6394 19.9213 9.6394M4.19789 21.6777L2.32178 19.8015" 
											stroke="currentColor" stroke-width="1.5"></path>
										</svg>
									</button>
									<button type="button" x-tooltip="Delete" onclick="openDeleteModal(${item[0]})"
											class="p-2 w-12 h-12 flex justify-center items-center text-danger">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
											<path d="M20.5001 6H3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
											<path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
											<path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
											<path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
											<path opacity="0.5" d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="currentColor" stroke-width="1.5"></path>
										</svg>
									</button>
								</div>`  // 버튼
								: ''
					        ])
					    },
					    searchable: true,
					    perPage: 10,
					    perPageSelect: [10, 20, 30, 50, 100],
						
						columns: [
					        {
					            select: 4,
								width: "15%",
								sortable: false,
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

// 강의실 등록 모달 관련 DOM 요소
const openModalButtonAddClassroom = document.getElementById('openModalButtonAddClassroom'); // 등록 모달 열기 버튼
const closeModalButtonAddClassroom = document.getElementById('closeModalButtonAddClassroom'); // 등록 모달 닫기 버튼
const cancelButtonAddClassroom = document.getElementById('cancelButtonAddClassroom'); // 등록 모달 취소 버튼
const modalBackgroundAddClassroom = document.getElementById('modalBackgroundAddClassroom');
const modalWrapperAddClassroom = document.getElementById('modalWrapperAddClassroom');

// 강의실 등록 모달 열기
openModalButtonAddClassroom.addEventListener('click', () => {
  modalBackgroundAddClassroom.classList.remove('hidden');  // 모달 배경 보이기
  modalBackgroundAddClassroom.classList.add('block');     // 모달 배경 보이게 설정
});

// 강의실 등록 모달 닫기
const closeModalAddClassroom = () => {
  modalBackgroundAddClassroom.classList.remove('block');
  modalBackgroundAddClassroom.classList.add('hidden');  // 모달 배경 숨기기
  // 모달 내부의 모든 입력 필드를 초기화
  const addForm = document.getElementById('classroomAddForm');
  addForm.reset(); // 모든 입력 필드와 라디오 버튼 초기화
  $('input').removeClass('errorInput');
  // 모든 에러 라벨 숨기기
  $('.error-label').hide();
};

closeModalButtonAddClassroom.addEventListener('click', closeModalAddClassroom); // 닫기 버튼 클릭 시
cancelButtonAddClassroom.addEventListener('click', closeModalAddClassroom); // 취소 버튼 클릭 시

// 강의실 등록 유효성검사
$('#classroomAddBtn').click(function(){
	let isVal = true;
	if($('#classroomName').val().trim() === '') {
		$('#classroomName').addClass("errorInput");
		$('.classroomName-error').show();
		isVal = false;
	} else {
		$('#classroomName').removeClass("errorInput");
		$('.classroomName-error').hide();
	}
	if($('#classroomManager').val().trim() === '') {
		$('#classroomManager').addClass("errorInput");
		$('.classroomManager-error').show();
		isVal = false;
	} else {
		$('#classroomManager').removeClass("errorInput");
		$('.classroomManager-error').hide();
	}
	if($('#classroomCapacity').val().trim() === '') {
		$("#classroomCapacity").addClass("errorInput");
		$('.classroomCapacity-error').show();
		isVal = false;
	} else {
		$('#classroomCapacity').removeClass("errorInput");
		$('.classroomCapacity-error').hide();
	}
	if (isVal) {
        console.log("submit 성공");
        $('#classroomAddForm').submit();
    }
});


// 강의실 삭제 모달
const openModalButtonDeleteClassroom = document.getElementById('openModalButtonDeleteClassroom'); // 삭제 모달 열기 버튼
const closeModalButtonDeleteClassroom = document.getElementById('closeModalButtonDeleteClassroom'); // 삭제 모달 닫기 버튼
const cancelButtonDeleteClassroom = document.getElementById('cancelButtonDeleteClassroom'); // 삭제 모달 취소 버튼
const modalBackgroundDeleteClassroom = document.getElementById('modalBackgroundDeleteClassroom');
const modalWrapperDeleteClassroom = document.getElementById('modalWrapperDeleteClassroom');
const deleteClassroomLabel = document.getElementById('deleteClassroomLabel');

// 삭제 모달 열기 함수 (강의실 번호를 받아서 데이터 세팅)
const openDeleteModal = (classroomNo) => {
    // 강의실 번호 표시
    deleteClassroomLabel.innerText = classroomNo;

    // 삭제 확인 버튼 클릭 이벤트 설정
    openModalButtonDeleteClassroom.onclick = () => {
        // 서버로 요청 전송
        window.location.href = `/academy/removeClassroom?classroomNo=${classroomNo}`;
    };

    // 모달 보이기
    modalBackgroundDeleteClassroom.classList.remove('hidden');
    modalBackgroundDeleteClassroom.classList.add('block');
};

// 모달 닫기 함수
const closeDeleteModal = () => {
    modalBackgroundDeleteClassroom.classList.remove('block');
    modalBackgroundDeleteClassroom.classList.add('hidden');
};

// 버튼 이벤트 리스너 설정
closeModalButtonDeleteClassroom.addEventListener('click', closeDeleteModal);
cancelButtonDeleteClassroom.addEventListener('click', closeDeleteModal);

// 강의실 수정 모달 관련 DOM 요소 
const openModifyModalButton = document.getElementById('openModifyModalButton');
const closeModifyModalButton = document.getElementById('closeModifyModalButton');
const modalModifyBackground = document.getElementById('modalModifyBackground');
const modalModifyWrapper = document.getElementById('modalModifyWrapper');
const cancelModifyButton = document.getElementById('cancelModifyButton');
const submitModifyButton = document.getElementById('classroomModifyBtn');

// 모달 열기
const openModifyModal = (classroomNo) => {
	console.log('classroomNo : ' + classroomNo);
  $.ajax({
    url: `http://${locations}:${ports}/academy/restapi/modifyClassroom?classroomNo=${classroomNo}`,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
		console.log('Received data:', data);
		
		$('#classroomNoModify').val(data.classroomNo);
      	$('#classroomNameModify').val(data.classroomName);
      	$('#classroomManagerModify').val(data.classroomManager);
		var manager = data.employeeName + '[' + data.classroomManager + ']'
	    $('#classroomManagerModify').val(manager);
	    $('#classroomCapacityModify').val(data.classroomCapacity);

     	modalModifyBackground.classList.remove('hidden');
      	modalModifyBackground.classList.add('block');
    },
    error: (xhr, status, error) => {
      console.error('Error fetching meeting room details:', error);
      alert('강의실 정보를 가져오는 데 실패했습니다.');
    },
  });
};

// 모달 닫기
const closeModifyModal = () => {
  modalModifyBackground.classList.remove('block');
  modalModifyBackground.classList.add('hidden');
  document.getElementById('classroomModifyForm').reset();
  $('input').removeClass('errorInput');
  $('.error-label').hide();
};

closeModifyModalButton.addEventListener('click', closeModifyModal);
cancelModifyButton.addEventListener('click', closeModifyModal);

// 수정 버튼 클릭 이벤트
submitModifyButton.addEventListener('click', function(e) {
	e.preventDefault();
	if (validateForm()) {
	  const formData = new FormData(document.getElementById('classroomModifyForm'));
      classroomNo = $('#classroomNoModify').val();
	  
	  $.ajax({
	    url: `http://${locations}:${ports}/academy/restapi/modifyClassroom?classroomNo=${classroomNo}`,
	    type: 'POST',
	    data: formData,
	    processData: false,
	    contentType: false,
	    success: function(response) {
	      alert('강의실이 성공적으로 수정되었습니다.');
	      closeModifyModal();
	      // 테이블 새로고침
	      if (window.multicolumn && window.multicolumn.datatable) {
	        window.multicolumn.init();
	      } else {
	        location.reload();
	      }
	    },
	    error: function(xhr, status, error) {
		    alert('강의실 수정에 실패했습니다.');
	    }
	  });
	}
});

// 강의실추가모달에서 사원추가버튼을 누를 떄 트리 출력
// 담당자추가 모달 관련 DOM 요소
const openModalButtonAddPeople = document.getElementById('openModalButtonAddPeople');
const closeModalButtonAddPeople = document.getElementById('closeModalButtonAddPeople');
const modalBackgroundAddPeople = document.getElementById('modalBackgroundAddPeople');
const modalWrapperAddPeople = document.getElementById('modalWrapperAddPeople');
const applyModalButtonAddPeople = document.getElementById('applyModalButtonAddPeople');

// 강의실 추가모달에서 담당자추가 모달 열기
openModalButtonAddPeople.addEventListener('click', () => {
  modalBackgroundAddPeople.classList.remove('hidden');  // 모달 배경 보이기
  modalBackgroundAddPeople.classList.add('block');     // 모달 배경 보이게 설정
});

// 담당자추가 모달 닫기
const closeModalAddPeople = () => {
  modalBackgroundAddPeople.classList.remove('block');
  modalBackgroundAddPeople.classList.add('hidden');  // 모달 배경 숨기기
};
if (closeModalButtonAddPeople) closeModalButtonAddPeople.addEventListener('click', closeModalAddPeople); // 닫기 버튼 클릭 시

// 강의실수정모달에서 사원추가버튼을 누를 떄 트리 출력
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


// 강의실 수정 유효성검사
function validateForm() {
  let isValid = true;
  
  // 이름 검사
  if ($('#classroomNameModify').val().trim() === '') {
    $('#classroomNameModify').addClass("errorInput");
    $('.modifyClassroomName-error').show();
    isValid = false;
  } else {
    $('#classroomNameModify').removeClass("errorInput");
    $('.modifyClassroomName-error').hide();
  }

  // 담당자 검사
  if ($('#classroomManagerModify').val().trim() === '') {
    $('#classroomManagerModify').addClass("errorInput");
    $('.modifyClassroomManager-error').show();
    isValid = false;
  } else {
    $('#classroomManagerModify').removeClass("errorInput");
    $('.modifyClassroomManager-error').hide();
  }

  // 수용인원 검사
  if ($('#classroomCapacityModify').val().trim() === '') {
    $('#classroomCapacityModify').addClass("errorInput");
    $('.modifyClassroomCapacity-error').show();
    isValid = false;
  } else {
    $('#classroomCapacityModify').removeClass("errorInput");
    $('.modifyClassroomCapacity-error').hide();
  }

  return isValid;
}

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
    url: `http://${locations}:${ports}/academy/restapi/employeeListNodeShowMe`,
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
			$('#addEmployeeListButton').click(function() {
			    if (selectedNode && selectedNode.text) { // selectedNode가 정의되고 text가 존재하는지 확인.
			        var employee = selectedNode.text;
			        
			        $('#classroomManager').val(employee); 
			    } else {
			        // alert('트리 항목을 선택하세요!');
			    }
				closeModalAddPeople();
				
			});
		},
    error: (xhr, status, error) => {
        console.error('Error:', error);
    }
});

// 트리에 사원목록 출력.
$.ajax({
    url: `http://${locations}:${ports}/academy/restapi/employeeListNodeShowMe`,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
			var tree = new tui.Tree('#modifytree', { // Tree 컴포넌트를 초기화하는 생성자.
			    data: data, // 데이터를 가져옴.
			    nodeDefaultState: 'opened' // 모든 노드가 기본적으로 열린 상태.
			}).enableFeature('Selectable', { // Tree 컴포넌트 추가기능 설정.
			    selectedClassName: 'tui-tree-selected', // 선택된 노드의 CSS설정.
			});

			var selectedBtn2 = document.getElementById('selectedBtn');
			var deselectedBtn2 = document.getElementById('deselectedBtn');
			var rootNodeId2 = tree.getRootNodeId();
			var firstChildId2 = tree.getChildIds(rootNodeId2)[0];
			var selectedValue2 = document.getElementById('selectedValue');
			var selectedNode2 = null; // 선택된 노드를 추적하는 변수
			
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
				selectedValue2.value = 'selected : ' + nodeData.text;
			    selectedNode2 = nodeData; // 선택된 노드 정보 저장
			    console.log('Selected:', selectedNode2.text);
			});

			// 트리에서 선택된 항목을 선택해제함.
			tree.on('deselect', function(eventData) {
			    var nodeData = tree.getNodeData(eventData.nodeId);
			    selectedValue2.value = 'deselected : ' + nodeData.text;
			});

			util.addEventListener(selectedBtn2, 'click', function() {
			    tree.select(firstChildId2);
			});

			util.addEventListener(deselectedBtn2, 'click', function() {
			    tree.deselect();
			});
			
			$('#modifyEmployeeListButton').click(function() {
			    if (selectedNode2 && selectedNode2.text) { // selectedNode가 정의되고 text가 존재하는지 확인.
			        var employee = selectedNode2.text;
			        
			        $('#classroomManagerModify').val(employee); 
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




