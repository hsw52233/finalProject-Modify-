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
	
	// 버튼 클릭 시 addBoard.html로 이동하는 함수
    Alpine.data('navigate', () => ({
       redirectToAddBoard() {
            window.location.href = 'addBoard.html';  // 'addBoard.html'로 이동
        }
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
	
	var originalBoardNo = 0;
	
	// 테이블 출력
	Alpine.data('multicolumn', () => ({
	    datatable: null,
	    init() {
	        // AJAX 요청
	        $.ajax({
	            url: `http://${locations}:${ports}/academy/restapi/boardList/` + categoryCode,
	            type: 'GET',
	            dataType: 'json',
	            success: (data) => {
					this.datatable = new simpleDatatables.DataTable('#myTable', {
					    data: {
					        headings: ['번호', '제목', '작성자', '부서','조회수', '작성일', '고정유무'],
					        data: data.map(item => [
								item[0], // 게시판번호
					            // [item[0], item[9]],// 게시판번호, 고정유무
					            [item[3], item[8]],// 제목, 파일유무
					            [item[1], item[2]], // 작성자
								item[7], // 부서
					            item[4], // 작성일
					            item[5], // 조회수
								item[9] // 고정유무
					        ])
					    },
					    searchable: true,
					    perPage: 10,
					    perPageSelect: [10, 20, 30, 50, 100],
						
						// 이미지
						columns: [	
							/*							
							{
						        select: 0, // 고정 유무
								render: (data, cell, row) => {
									console.log("데이터받은거확인:", data); // 디버깅용 로그
									const [boardNo, pinned] = data.split(',');
									// 고정유무 값이 '1'이면 행의 배경색을 노란색으로 변경
							        if (pinned === '1') {
										row.style.backgroundColor = '#f1f1f1';
							            row.classList.add('text-danger'); // 배경색 추가
										
										// '공지' 배지 HTML을 첫 번째 열에 추가					
										const boardNoCell = row.cells[0];
										console.log("boardNoCell : ", boardNoCell); // 디버깅용 로그
										console.log("row.cells[1] : ", row.cells[1]); // 디버깅용 로그
					                    originalBoardNo = boardNoCell.innerHTML; // 기존 boardNo 값을 저장
					                    boardNoCell.innerHTML = `<span class="badge rounded-full bg-danger/20 text-danger hover:top-0">공지</span>
																<input type="hidden" name="boardNo" id="boardNo" value="${originalBoardNo}">`
										console.log("Updated boardNoCell: ", boardNoCell.innerHTML);
										// 제목 앞에 SVG 아이콘 추가
					                    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-megaphone-fill" viewBox="0 0 16 16">
					                                        <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25 25 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009l.496.008a64 64 0 0 1 1.51.048m1.39 1.081q.428.032.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a66 66 0 0 1 1.692.064q.491.026.966.06"/>
					                                      </svg>`;

					                    // 제목에 SVG 아이콘 추가
					                    row.cells[1].innerHTML = `
					                        <div class="flex items-center">
					                            ${svgIcon}
					                            <span class="ml-2">${row.cells[1].innerHTML}</span>
					                        </div>
					                    `;
									} else {
							            row.classList.remove('text-danger'); // 고정되지 않으면 배경색 제거
										
							        }
							        return boardNo; // 반환할 데이터값 (여기서는 고정유무를 그대로 반환)
									
					            },
						    },
							*/
							{
						        select: 6, // 고정 유무
								
						        render: (data, cell, row) => {
									console.log("데이터받은거확인:", data); // 디버깅용 로그
									// 고정유무 값이 '1'이면 행의 배경색을 노란색으로 변경
							        if (data === '1') {
										row.style.backgroundColor = '#f1f1f1';
							            row.classList.add('text-danger'); // 배경색 추가
										
										// '공지' 배지 HTML을 첫 번째 열에 추가										
										const boardNoCell = row.cells[0];
					                    originalBoardNo = boardNoCell.innerHTML; // 기존 boardNo 값을 저장
					                    boardNoCell.innerHTML = `<span class="badge rounded-full bg-danger/20 text-danger hover:top-0">공지</span>
																<input type="hidden" name="boardNo" id="boardNo" value="${originalBoardNo}">`
										
										// 제목 앞에 SVG 아이콘 추가
					                    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-megaphone-fill" viewBox="0 0 16 16">
					                                        <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25 25 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009l.496.008a64 64 0 0 1 1.51.048m1.39 1.081q.428.032.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a66 66 0 0 1 1.692.064q.491.026.966.06"/>
					                                      </svg>`;

					                    // 제목에 SVG 아이콘 추가
					                    row.cells[1].innerHTML = `
					                        <div class="flex items-center">
					                            ${svgIcon}
					                            <span class="ml-2">${row.cells[1].innerHTML}</span>
					                        </div>
					                    `;
									} else {
							            row.classList.remove('text-danger'); // 고정되지 않으면 배경색 제거
										
							        }
							        return 'data'; // 반환할 데이터값 (여기서는 고정유무를 그대로 반환)
							    }
						    },
							{
					            select: 2,	// 강사명 열
					            render: (data, cell, row) => {
									console.log("데이터받은거확인:", data); // 디버깅용 로그
									const [image, name] = data.split(','); 
									if(image == 'null.null') {
										return `
											<div class="flex items-center w-max">
												<img class="w-9 h-9 rounded-full ltr:mr-2 rtl:ml-2 object-cover" src="./images/defaultProfile.png" />
												<span>${name}</span>
											</div>
										`;
									} else {
										return `
											<div class="flex items-center w-max">
												<img class="w-9 h-9 rounded-full ltr:mr-2 rtl:ml-2 object-cover" src="../upload/${image}" />
												<span>${name}</span>
											</div>
										`;
									}
					            },
								sortable: false,
					        },
							{
								select: 1,
								render: (data, cell, row) => {
									console.log("데이터받은거확인:", data); // 디버깅용 로그
									const [content, count] = data.split(',');
									if(parseInt(count) >= 1) {
										return `
											<div class="flex items-center w-max">
												<span>${content}</span>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-paperclip ml-2" viewBox="0 0 16 16">
												  <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z"/>
												</svg>
											</div>
										`;
									} else {
										return `
											<div class="flex items-center w-max">
												<span>${content}</span>
											</div>
										`;
									}
								}
							}			        
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
					// 행 클릭 이벤트
					document.querySelector('#myTable tbody').addEventListener('click', (e) => {
					    const rowElement = e.target.closest('tr'); // 클릭된 행의 인덱스.
					    if (rowElement) {
							const tdElements = rowElement.querySelectorAll('td');
					        let boardNo = tdElements[0].textContent.trim(); // 기본 boardNo 값
					        const hiddenInput = tdElements[0].querySelector('input[type="hidden"]');

					        // 고정 유무가 1일 경우, 숨겨진 boardNo 값을 사용
					        if (hiddenInput) {
								boardNo = hiddenInput.value;  // hidden input에서 boardNo 값 가져오기
							}
							
							// boardNo 값이 유효한지 확인한 후 페이지 이동
					        if (boardNo) {
					            window.location.href = `/academy/boardOne?boardNo=${encodeURIComponent(boardNo)}`;
					        } else {
					            console.error('Board number not found.');
					        }
					
					    }
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