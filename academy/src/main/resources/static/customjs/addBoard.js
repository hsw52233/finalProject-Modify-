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
});

var quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: '내용을 입력하세요.',  // Placeholder 텍스트 설정
	bounds: '#editor',
    modules: {
        toolbar: [
            [{ 'font': [] }],  // 글자 크기
            ['bold', 'italic', 'underline', 'strike'],  // 굵게, 기울임, 밑줄, 취소선
            [{ 'header': '1' }, { 'header': '2' }, 'blockquote'],  // 헤더1, 헤더2, 블록 인용
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // 번호 매기기, 글머리 기호
            [{ 'align': [] }],  // 정렬
            ['link'],  // 링크, 이미지 삽입
            [{ 'color': [] }, { 'background': [] }],  // 글자 색상, 배경 색상
            ['clean'],  // 서식 초기화
        ]
    }
});

// Placeholder 문제 해결: 입력 시 강제 삭제
document.querySelector('.ql-editor').addEventListener('focus', function() {
    this.classList.remove('ql-blank'); // Placeholder 강제 제거
});

// 전송 버튼 클릭 이벤트
$('#submitButton').on('click', function() {
    // Quill 에디터의 내용을 HTML로 추출
    var boardContent = quill.root.innerHTML;

    // 다른 input 필드의 값들 추출
    var boardTitle = $('#boardTitle').val();
    var createEmployeeNo = parseInt($('#createEmployeeNo').val(), 10);
    var updateEmployeeNo = parseInt($('#updateEmployeeNo').val(), 10);
	var boardCategory = $('#boardCategory').val();
	var pinned = $('#pinned').is(':checked') ? "1" : "0";  // 체크 여부 확인
	
    // 동적으로 추가된 파일 입력 필드의 파일을 모두 가져오기
    var boardFiles = [];
    $('#fileDiv input[type="file"]').each(function() {
        var fileInput = $(this)[0];
        if (fileInput.files.length > 0) {
            boardFiles.push(fileInput.files[0]);
        }
    });

    // 제목, 내용 입력 여부 확인
    if (!boardContent.trim() || boardContent === '<p><br></p>' || 
		!boardTitle.trim() || !boardCategory || boardCategory.trim() === '') {
		modalBackgroundBoardDelete.classList.remove('hidden');  // 모달 배경 보이기
		modalBackgroundBoardDelete.classList.add('block');     // 모달 배경 보이게 설정
        return;
    }

    // POST 요청을 위해 FormData 객체 생성
    var formData = new FormData();
    formData.append('boardTitle', boardTitle); // 제목
    formData.append('boardContent', boardContent); // Quill 에디터 내용
    formData.append('createEmployeeNo', createEmployeeNo); // 작성자
    formData.append('updateEmployeeNo', updateEmployeeNo); // 수정자
    formData.append('boardCategory', boardCategory); // 게시판 종류
    formData.append('pinned', pinned); // 게시판 고정유무
	
    // 파일이 있다면 추가
    boardFiles.forEach(function(file) {
        formData.append('boardFiles[]', file);  // 여러 파일 처리
    });

    // jQuery AJAX 요청
    $.ajax({
        url: `http://${locations}:${ports}/academy/addBoard`,
        type: 'POST',
        data: formData,
        processData: false, // FormData 사용 시 false로 설정
        contentType: false, // FormData 사용 시 false로 설정
        success: function(response) {
            console.log('Success:', response);
            // 성공 후 페이지 이동
           window.location.href = '/academy/boardList/' + boardCategory // 게시판 목록 페이지로 이동
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert("게시글 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    });
});

let result = 0;  // 전역 변수로 result 선언
let inputIds = []; // 모든 inputId를 저장
let displayIds = []; // 모든 displayId를 저장
let removeButtonIds = []; // 모든 removeButtonId를 저장
let errMsgs = [] // 모든 errMsg를 저장

// 첨부파일 폼 추가버튼 클릭 시
$('#btnAddFile').click(function(){
	// 마지막 파일 입력필드가 비어있다면
	if ($('#fileDiv input[type="file"]').last().val() === '') {
		// 모달로 바꾸기
		 alert('첨부되지 않은 파일이 존재합니다.');
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
					   name="boardFiles"
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
	// 삭제된 필드의 ID를 배열에서 제거
	inputIds = inputIds.filter(inputId => inputId !== 'boardFile' + fileId);
	displayIds = displayIds.filter(displayId => displayId !== 'boardFileNameDisplay' + fileId);
	removeButtonIds = removeButtonIds.filter(removeButtonId => removeButtonId !== 'removeFileBtn' + fileId);	
	errMsgs = errMsgs.filter(errMsg => errMsg !== 'errMsg' + fileId);	
}


// 사원삭제 모달 관련 DOM 요소
const openModalButtonBoardDelete = document.getElementById('openModalButtonBoardDelete');
const closeModalButtonBoardDelete = document.getElementById('closeModalButtonBoardDelete');
const modalBackgroundBoardDelete = document.getElementById('modalBackgroundBoardDelete');
const modalWrapperBoardDelete = document.getElementById('modalWrapperBoardDelete');
const cancelButtonBoardDelete = document.getElementById('cancelButtonBoardDelete');

// 사원삭제 모달 닫기
const closeModalBoardDelete = () => {
	modalBackgroundBoardDelete.classList.remove('block');
	modalBackgroundBoardDelete.classList.add('hidden');  // 모달 배경 숨기기
  // 모달 내부의 모든 입력 필드를 초기화
  const formBoardDelete = document.getElementById('boardFormBoardDelete');
  formBoardDelete.reset(); // 모든 입력 필드와 라디오 버튼 초기화
  $('input').removeClass('errorInput');
  // 모든 에러 라벨 숨기기
  $('.error-label').hide();
};

if (closeModalButtonBoardDelete) closeModalButtonBoardDelete.addEventListener('click', closeModalBoardDelete); // 닫기 버튼 클릭 시
if (cancelButtonBoardDelete) cancelButtonBoardDelete.addEventListener('click', closeModalBoardDelete);     // 취소 버튼 클릭 시
