// 댓글 삭제 버튼을 누를 때
function removeComment(commentRowId) {
	var commentNo = document.querySelector(`#${commentRowId} input[type="hidden"]`).value;
	console.log("삭제 버튼이 클릭된 댓글의 번호:", commentNo);
    // DB에 있는 해당 댓글 데이터 삭제.
    $.ajax({
        url: `http://${locations}:${ports}/academy/restapi/removeComment`,
        contentType: 'application/json', 
        type: 'POST',
        data: JSON.stringify(commentNo),
        success: function () {},
        error: function () {
            alert('댓글 삭제 중 오류가 발생했습니다.');
        }
    });
    
 	// 프론트에서 삭제한 댓글 HTML제거.
    var commentElement = document.getElementById(commentRowId);
    if (commentElement) {
        commentElement.remove();
    }
}

// 댓글 등록 버튼을 누를 때
$(document).on('click', '#commentAddBtn', function () {
	
	if ($('#commentContent').val() == null || $('#commentContent').val() == '') {
		modalBackgroundNoComment.classList.remove('hidden');  // 모달 배경 보이기
		modalBackgroundNoComment.classList.add('block');     // 모달 배경 보이게 설정
	} else {
		// 댓글 개수 카운트.
    	var commentRowCount = $('div[name="commentRow"]').length;
        console.log(commentRowCount);
        
        $.ajax({
            url: `http://${locations}:${ports}/academy/restapi/addComment`,
            contentType: 'application/json', 
            type: 'POST',
            data: JSON.stringify({
                commentContent: $('#commentContent').val(),
                boardNo: $('#boardNo').val(),
            }),
            success: function (data) {
                $('#commentDiv').append(`
                	<div id="commentRow${commentRowCount}" name="commentRow">
                	<input type="hidden" value="${data.commentNo}">
                	<div class="flex justify-between" >
                    <div class="p-5">
                        <!-- 작성자정보 -->
                        <div class="flex items-center">
                            <img class="w-6 h-6 rounded-full overflow-hidden object-cover" src="/upload/${data.photoFileName}.${data.photoFileExt}">
                            <p class="ml-2">${data.employeeName}</p>
                            <p class="ml-2 text-xs" style="color:#a9a9a9">(${data.employeeDepartmentName})</p>
                            <p class="ml-2 text-xs" style="color:#a9a9a9">${data.updateDate}</p>
                        </div>
                        <!-- 댓글내용 -->
                        <div class="mt-3">
                            <span>${data.commentContent}</span>
                        </div>
                    </div>
                    <div class="p-5">
	                    <button
		           		type="button"
		           		class = "btn btn-outline-danger ml-2"
		           		id = "commentDeleteRow${commentRowCount}"
		           		onclick="removeComment('commentRow${commentRowCount}')"
		           		>
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
                    </div>
                    <!-- 구분선 -->
                    <div class="h-px border-b border-[#e0e6ed]"></div>
                    </div>
                    
                `);
                $('#commentContent').val('');
            },
            error: function () {
                alert('댓글 등록 중 오류가 발생했습니다.');
            }
        });
	}
});

// 사원삭제 모달 관련 DOM 요소
const openModalButtonNoComment = document.getElementById('openModalButtonNoComment');
const closeModalButtonNoComment = document.getElementById('closeModalButtonNoComment');
const modalBackgroundNoComment = document.getElementById('modalBackgroundNoComment');
const modalWrapperNoComment = document.getElementById('modalWrapperNoComment');
const cancelButtonNoComment = document.getElementById('cancelButtonNoComment');

// 사원삭제 모달 닫기
const closeModalNoComment = () => {
	modalBackgroundNoComment.classList.remove('block');
	modalBackgroundNoComment.classList.add('hidden');  // 모달 배경 숨기기
};

if (closeModalButtonNoComment) closeModalButtonNoComment.addEventListener('click', closeModalNoComment); // 닫기 버튼 클릭 시
if (cancelButtonNoComment) cancelButtonNoComment.addEventListener('click', closeModalNoComment);     // 취소 버튼 클릭 시

// 사원삭제 모달 관련 DOM 요소
const openModalButtonBoardDelete = document.getElementById('openModalButtonBoardDelete');
const closeModalButtonBoardDelete = document.getElementById('closeModalButtonBoardDelete');
const modalBackgroundBoardDelete = document.getElementById('modalBackgroundBoardDelete');
const modalWrapperBoardDelete = document.getElementById('modalWrapperBoardDelete');
const cancelButtonBoardDelete = document.getElementById('cancelButtonBoardDelete');

// 사원삭제 모달 열기
if (openModalButtonBoardDelete) {
		openModalButtonBoardDelete.addEventListener('click', () => {
		modalBackgroundBoardDelete.classList.remove('hidden');  // 모달 배경 보이기
		modalBackgroundBoardDelete.classList.add('block');     // 모달 배경 보이게 설정
	});
	
}

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

var quill = new Quill('#ql-editor', {
    theme: 'snow',
    readOnly: true,
    modules: { toolbar: false }, 
});
var toolbar = quill.container.previousSibling;
toolbar.querySelector('.ql-picker').setAttribute('title', 'Font Size');
toolbar.querySelector('button.ql-bold').setAttribute('title', 'Bold');
toolbar.querySelector('button.ql-italic').setAttribute('title', 'Italic');
toolbar.querySelector('button.ql-link').setAttribute('title', 'Link');
toolbar.querySelector('button.ql-underline').setAttribute('title', 'Underline');
toolbar.querySelector('button.ql-clean').setAttribute('title', 'Clear Formatting');
toolbar.querySelector('[value=ordered]').setAttribute('title', 'Ordered List');
toolbar.querySelector('[value=bullet]').setAttribute('title', 'Bullet List');