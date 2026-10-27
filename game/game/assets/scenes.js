/* =========================================================
   채팅 장면 목록 — 채팅 기록(log.html)과 각 장면의 이전/다음 버튼이 이 순서를 씁니다.
   새 장면을 추가하면: chat-XX.html 파일을 만들고 아래 배열에 한 줄 추가하세요.
   ch: 목록에 표시할 채널 아이콘 (party / guild / whisper / system)
   ========================================================= */
window.SCENES = [
	{ file: 'chat-01.html', title: '흑기사단 첫 레이드', place: '망자의 성채', ch: ['party', 'system'] },
	{ file: 'chat-02.html', title: '오래 계실 거죠?', place: '흑기사단 길드 광장', ch: ['whisper'] },
	{ file: 'chat-03.html', title: '내 뒤에 붙어', place: '망자의 성채 · 2페이즈', ch: ['party', 'system'] },
	{ file: 'chat-04.html', title: '이번 주엔 오른쪽', place: '새벽 레이드 · 세 번째 보스', ch: ['party', 'whisper', 'system'] },
	{ file: 'chat-05.html', title: '이미 내 팀임', place: '흑기사단 길드 채팅', ch: ['guild'] },
	{ file: 'chat-06.html', title: '옆에 있고 싶은 건 다른 거지', place: '낙사 구간 우회로', ch: ['whisper'] },
	{ file: 'chat-07.html', title: '에이 설마', place: '동굴 지름길', ch: ['whisper', 'system'] },
	{ file: 'chat-08.html', title: '오빠는 기백이야', place: '흑기사단 길드 광장', ch: ['whisper'] },
	{ file: 'chat-09.html', title: '내 힐러 건들면', place: '흑기사단 길드 채팅', ch: ['guild'] },
	{ file: 'chat-10.html', title: '잘못 눌렀어', place: '한밤의 길드 광장', ch: ['whisper', 'system'] },
	{ file: 'chat-11.html', title: '성녀의 눈물', place: '거래 게시판 앞', ch: ['whisper', 'system'] },
	{ file: 'chat-12.html', title: '탈퇴 대기', place: '흑기사단 길드 채팅', ch: ['guild', 'system'] },
	{ file: 'chat-13.html', title: '말 조심해라', place: '흑기사단 길드 채팅', ch: ['guild'] },
	{ file: 'chat-14.html', title: '루비짱 님이 접속했습니다', place: '마을 광장 분수대', ch: ['guild', 'whisper', 'system'] },
	{ file: 'chat-15.html', title: '어느 쪽이 편해?', place: '복귀 후 첫 던전', ch: ['party', 'system'] },
	{ file: 'chat-16.html', title: '제가 잘못 봤어요', place: '킹우요 시점 · 공략 실패', ch: ['party', 'system'] },
	{ file: 'chat-17.html', title: '즐겜', place: '흑기사단 길드 채팅', ch: ['guild'] },
	{ file: 'chat-18.html', title: '둘이 진짜 사귀냐', place: '길드 광장 · 레이드 직전', ch: ['guild', 'party', 'system'] },
];

window.CH_LABEL = {
	say: '일반',
	party: '파티',
	guild: '길드',
	whisper: '귓속말',
	system: '시스템',
};
