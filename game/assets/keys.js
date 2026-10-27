/* 공통 단축키: C 캐릭터 / L 채팅 기록 / M 메인 (입력창에서는 동작 안 함) */
(function () {
	var map = { KeyC: 'character.html', KeyL: 'log.html', KeyM: 'index.html' };
	document.addEventListener('keydown', function (e) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
		var to = map[e.code];
		if (to && location.pathname.split('/').pop() !== to) location.href = to;
	});
})();
