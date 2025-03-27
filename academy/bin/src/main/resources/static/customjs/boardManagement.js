// 카테고리 삭제 버튼을 누를 때
function removeBoardCategory(boardCategoryRowId) {
	var code = document.querySelector(`#${boardCategoryRowId} input[type="hidden"]`).value;
	console.log("삭제 버튼이 클릭된 카테고리의 번호:", code);
    // DB에 있는 해당 카테고리 데이터 삭제.
    $.ajax({
        url: `http://${locations}:${ports}/academy/restapi/removeBoardCategory`,
        contentType: 'application/json', 
        type: 'POST',
        data: code,
        success: function () {},
        error: function () {
            alert('댓글 삭제 중 오류가 발생했습니다.');
        }
    });
    
 	// 프론트에서 삭제한 카테고리 HTML제거.
    var boardCategoryElement = document.getElementById(boardCategoryRowId);
    if (boardCategoryElement) {
        boardCategoryElement.remove();
    }
}

// 카테고리 등록 버튼을 누를 때
$(document).on('click', '#boardCategoryAddBtn', function () {
	
	if ($('#boardCategory').val() == null || $('#boardCategory').val() == '') {
		modalBackgroundNoComment.classList.remove('hidden');  // 모달 배경 보이기
		modalBackgroundNoComment.classList.add('block');     // 모달 배경 보이게 설정
	} else {
		// 카테고리 개수 카운트.
    	var boardCategoryRowCount = $('div[name="boardCategoryRow"]').length;
        console.log(boardCategoryRowCount);
        
        $.ajax({
            url: `http://${locations}:${ports}/academy/restapi/addBoardCategory`,
            type: 'POST',
			contentType: "application/json",  // JSON으로 전송
			data: $("#boardCategory").val(),
            success: function (data) {
				console.log("Success:", data);
                $('#boardCategoryDiv').append(`
					<div id="boardCategoryRow${boardCategoryRowCount}" name="boardCategoryRow">
			        <input type="hidden" value="${data.code}">
			            <div class="flex justify-between p-5">
			                <p class="ml-2 text-lg font-medium">${data.name}</p>
			                <button
			                    type="button"
			                    class="btn btn-outline-danger ml-2"
			                    id="boardCategoryDeleteRow${boardCategoryRowCount}"
			                    onclick="removeBoardCategory('boardCategoryRow${boardCategoryRowCount}')"
			                >
			                    <!-- 휴지통 아이콘 -->
			                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			                        <path opacity="0.5" d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12405C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001Z" fill="currentColor"/>
			                        <path d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z" fill="currentColor"/>
			                    </svg>
			                </button>
			            </div>
			            <!-- 구분선 -->
			            <div class="h-px border-b border-[#e0e6ed]"></div>
			        </div>
                `);
				$('#boardCategory').val('');
            },
            error: function () {
                alert('카테고리 등록 중 오류가 발생했습니다.');
            }
        });
	}
});

const modalBackgroundNoBoardCategory = document.getElementById('modalBackgroundNoBoardCategory');

const closeModalNoBoardCategory = () => {
	modalBackgroundNoBoardCategory.classList.remove('block');
	modalBackgroundNoBoardCategory.classList.add('hidden');  // 모달 배경 숨기기
};
