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

	// chat section
	Alpine.data('chat', () => ({
		isShowUserChat: false, // 사용자 채팅 화면 표시 여부
		isShowChatMenu: false, // 채팅 메뉴 표시 여부    
		textMessage: '', // 사용자가 입력한 메시지 내용
		selectedUser: '', // 현재 선택된 사용자
		selectedUserImage: '',
		currentUserName: '', // 로그인한 사용자의 이름
		currentUserId: '',
		messages: [], // 채팅 메시지 목록
		searchUsers: [],
		searchUser: '',
		unreadCounts: {},
		totalUnreadCount: 0,


		init() { // 채팅 기능 초기화


			this.getCurrentUser(); // 현재 로그인한 사용자 가져오기   
			// 일정 간격으로 메시지 갱신(1초)
			setInterval(() => {
				if (this.selectedUser) {
					this.getMessages();
				}
			}, 1000);

			setInterval(() => {
				this.updateUnreadCounts();
			}, 1000);
		},



		getCurrentUser() { // 로그인한 사용자의 정보 가져오기 (이름) -> GET요청을 보내 현재 로그인한 사용자의 이름을 가져옴
			$.ajax({
				url: `http://${locations}:${ports}/academy/chat/fromUserId`,
				type: 'GET',
				success: (data) => {
					this.currentUserName = data[1];
					this.currentUserId = data[0];
					this.getEmployeeList();
				},
				error: (xhr, status, error) => {
					console.error('Error getting current user:', error);
				}
			});
		},

		getEmployeeList() {
			$.ajax({
				url: `http://${locations}:${ports}/academy/restapi/employeeList`,
				type: 'GET',
				dataType: 'json',
				success: (data) => {
					this.searchUsers = data
						.filter(item => parseInt(item[1]) !== parseInt(this.currentUserId))
						.map(item => ({
							userId: item[1],
							name: item[0],
							path: item[5] === 'null.null' ? 'defaultProfile.png' : item[5]
						}));
					this.updateUnreadCounts();

				},
				error: (xhr, status, error) => {
					console.error('Error fetching employee list:', error);
				}
			});
		},


		
		
		updateUnreadCounts() {
		    this.totalUnreadCount = 0;
		    const promises = this.searchUsers.map(user =>
		        new Promise(resolve => {
		            this.getUnreadMessageCount(user.userId, count => {
		                this.unreadCounts[user.userId] = count;
		                this.totalUnreadCount += count;
		                resolve();
		            });
		        })
		    );

		    Promise.all(promises).then(() => {
		        this.unreadCounts = { ...this.unreadCounts };
		        this.sortUsers();
		        window.dispatchEvent(new CustomEvent('unreadCountUpdated', { detail: this.totalUnreadCount }));
		    });
		},


		sortUsers() {
		    this.searchUsers.sort((a, b) => {
		        const unreadCountA = this.unreadCounts[a.userId] || 0;
		        const unreadCountB = this.unreadCounts[b.userId] || 0;
		        
		        if (unreadCountA > 0 && unreadCountB > 0) {
		            // 둘 다 읽지 않은 메시지가 있는 경우, userId로 정렬
		            return parseInt(a.userId) - parseInt(b.userId);
		        } else if (unreadCountA > 0) {
		            return -1; // a를 위로
		        } else if (unreadCountB > 0) {
		            return 1; // b를 위로
		        }
		        // 둘 다 읽지 않은 메시지가 없는 경우, 원래 순서 유지
		        return 0;
		    });
		},
		searchUsermethod() {


			const searchTerm = this.searchUser.toLowerCase();
			const filteredUsers = this.searchUsers.filter(user =>
				user.name.toLowerCase().includes(searchTerm)
			);

			// 스크롤을 맨 위로 이동
			this.$nextTick(() => {
				const element = document.querySelector('.chat-users');
				if (element) {
					element.scrollTop = 0;
				}
			});

			return filteredUsers;
		},


		selectUser(user) {
			console.log('Selected user:', user);
			this.selectedUser = user;
			this.selectedUserImage = user.path === 'defaultProfile.png' 
			        ? 'assets/images/defaultProfile.png' 
			        : `./upload/${user.path}`;
			this.isShowUserChat = true;
			this.scrollToBottom();
			this.isShowChatMenu = false;
			this.getMessages();

			$.ajax({
				url: `http://${locations}:${ports}/academy/chat/updateUseYn`,
				type: 'POST',
				data: {
					fromUserName: user.userId,
					toUserName: this.currentUserId
				},
				success: () => {
					console.log('use_yn updated successfully');
					this.updateUnreadCounts(); // 읽음 표시 후 카운트 업데이트
				},
				error: (xhr, status, error) => {
					console.error('Error updating use_yn:', error);
				}
			});
		},



		getUnreadMessageCount(userId, callback) { // 특정 사용자가 보낸 읽지 않은 메시지 수를 가져오는 함수
			$.ajax({
				url: `http://${locations}:${ports}/academy/chat/unreadCount`,
				type: 'GET',
				data: {
					fromUserName: userId, // 보낸 사람
					toUserName: this.currentUserId // 받은 사람 (현재 로그인한 사용자)
				},
				success: (unreadCount) => {
					callback(parseInt(unreadCount, 10));
					if (count > 0) {
						// 읽지 않은 메시지가 있는 경우, 해당 사용자를 배열에서 제거하고 맨 앞에 추가
						const index = this.searchUsers.findIndex(u => u.userId === userId);
						if (index > -1) {
							const [movedUser] = this.searchUsers.splice(index, 1);
							this.searchUsers.unshift(movedUser);
						}
					}
				},
				error: (xhr, status, error) => {
					console.error('Error getting unread message count:', error);
					callback(0);
				}
			});
		},

		sendMessage() { // 메시지 보내기
			if (this.textMessage.trim()) {
				$.ajax({
					url: `http://${locations}:${ports}/academy/chat/send`,
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						fromUserName: this.currentUserId,
						toUserName: this.selectedUser.userId,
						content: this.textMessage
					}),
					success: () => {
						this.textMessage = '';
						this.getMessages();
						this.scrollToBottom();
						this.updateUnreadCount(this.selectedUser.userId); // 메시지 전송 후 읽지 않은 메시지 수 업데이트
					},
					error: (xhr, status, error) => {
						console.error('Error sending message:', error);
					}
				});
			}
		},

		getMessages() { // 채팅 메시지 가져오기
			console.log('Sending request:', this.currentUserId, this.selectedUser.userId);
			$.ajax({
				url: `http://${locations}:${ports}/academy/chat/messages`,
				type: 'GET',
				data: {
					fromUserName: this.currentUserId,
					toUserName: this.selectedUser.userId
				},
				success: (messages) => {
					console.log('Received messages:', messages);
					this.messages = messages;

					// 메시지를 읽음 처리
					this.markMessagesAsRead();
					

				},
				error: (xhr, status, error) => {
					console.error('Error getting messages:', xhr.responseText);
				}
			});
		},

		markMessagesAsRead() {
			$.ajax({
				url: `http://${locations}:${ports}/academy/chat/updateUseYn`,
				type: 'POST',
				data: {
					fromUserName: this.selectedUser.userId,
					toUserName: this.currentUserId
				},
				success: () => {
					console.log('Messages marked as read');
					// 읽음 처리 후 안 읽은 메시지 수 업데이트
					this.updateUnreadCount(this.selectedUser.userId);
					this.totalUnreadCount -= this.unreadCounts[this.selectedUser.userId];
					this.unreadCounts[this.selectedUser.userId] = 0;
				},
				error: (xhr, status, error) => {
					console.error('Error marking messages as read:', error);
				}
			});
		},

		formatDateTime(dateString) {
			const date = new Date(dateString);
			const formattedDate = date.toLocaleDateString();
			const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			return `${formattedDate} ${formattedTime}`;
		},


		// 스크롤 바 기능
		scrollToBottom() {
			this.$nextTick(() => {
				setTimeout(() => {
					const chatBox = document.querySelector('.chat-conversation-box');
					if (chatBox) {
						const scrollContainer = chatBox.closest('.perfect-scrollbar');
						if (scrollContainer) {
							scrollContainer.scrollTop = scrollContainer.scrollHeight;
						} else {
							// perfect-scrollbar가 없는 경우 chat-conversation-box 자체를 스크롤
							chatBox.scrollTop = chatBox.scrollHeight;
						}
					} else {
						console.warn('Chat box not found, scrollToBottom failed');
					}
				}, 100);
			});
		},
	}));

});
