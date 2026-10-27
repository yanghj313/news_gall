/* =========================================================
   채팅 자동재생 엔진 (바닐라 JS)

   ▷ 각 chat-XX.html 안의 <template id="script"> 에 대사를 한 줄씩 적으면 순서대로 재생됩니다.

   <p data-ch="party"   data-who="킹우요">루비는 내 왼쪽 뒤</p>
   <p data-ch="guild"   data-who="흑룡기사">너 레이드 안 옴?</p>
   <p data-ch="whisper" data-who="킹우요">나한테 하트 줬어?</p>   ← 귓속말 (body 의 data-me / data-partner 기준으로 To 표시)
   <p data-ch="system">레이드를 시작합니다.</p>
   <p data-ch="alert">뼈다귀왕 님이 사망했습니다.</p>          ← 빨간 시스템
   <p data-ch="divider">— 다음 판 —</p>                       ← 가운데 구분선
   <p data-ch="say" data-who="루비짱">...</p>                  ← 일반 채팅

   선택 속성
   data-fx="shake | flash | hearts | petals | dead:이름 | alive:이름 | alive:all | hp:이름:30"
            (여러 개는 공백으로 구분)
   data-wait="1500"   ← 이 줄이 나오기 전 대기시간(ms) 직접 지정
   data-ts="02:15"    ← 이 줄부터 시간 표시를 바꿈

   body 속성
   data-me="루비짱"            ← 화면 주인(내 캐릭터)
   data-partner="킹우요"       ← 귓속말 상대
   data-start="02:13"          ← 첫 줄 시각
   data-party="킹우요:탱커,루비짱:힐러"   ← 있으면 왼쪽에 파티창 표시
   ========================================================= */
(function () {
	'use strict';

	var body = document.body;
	var ME = body.dataset.me || '루비짱';
	var PARTNER = body.dataset.partner || '킹우요';
	var LABEL = window.CH_LABEL || { say: '일반', party: '파티', guild: '길드', whisper: '귓속말', system: '시스템' };

	var tpl = document.getElementById('script');
	var log = document.querySelector('.chat-log');
	var typing = document.querySelector('.typing');
	var scene = document.querySelector('.scene');
	var fxLayer = document.querySelector('.fx-layer');
	if (!tpl || !log) return;

	var lines = Array.prototype.slice.call(tpl.content.querySelectorAll('p'));

	/* ---------- 상태 ---------- */
	var idx = 0;
	var timer = null;
	var playing = false;
	var speed = 1;
	var clock = toSec(body.dataset.start || '02:13');
	var stickBottom = true;

	/* ---------- 시간 ---------- */
	function toSec(t) {
		var p = String(t).split(':');
		return (+p[0] || 0) * 3600 + (+p[1] || 0) * 60;
	}
	function fmt(s) {
		s = ((s % 86400) + 86400) % 86400;
		var h = Math.floor(s / 3600),
			m = Math.floor((s % 3600) / 60);
		return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
	}

	/* ---------- 파티창 ---------- */
	var partyEl = document.querySelector('.party ul');
	var members = {};
	if (body.dataset.party && partyEl) {
		body.dataset.party.split(',').forEach(function (pair) {
			var p = pair.split(':');
			var name = p[0].trim();
			var li = document.createElement('li');
			if (name === ME) li.className = 'is-me';
			li.innerHTML =
				'<div class="pm-name"><span></span><em></em></div>' +
				'<div class="gauge hp"><i></i></div><div class="gauge mp"><i style="--v:80%"></i></div>';
			li.querySelector('span').textContent = name;
			li.querySelector('em').textContent = (p[1] || '').trim();
			partyEl.appendChild(li);
			members[name] = li;
		});
	} else if (scene) {
		scene.classList.add('no-party');
		var aside = document.querySelector('.party');
		if (aside) aside.remove();
	}

	function setHp(name, v) {
		var targets = name === 'all' ? Object.keys(members) : [name];
		targets.forEach(function (n) {
			var li = members[n];
			if (!li) return;
			li.querySelector('.hp i').style.setProperty('--v', v + '%');
			li.classList.toggle('is-dead', v <= 0);
		});
	}

	/* ---------- 효과 ---------- */
	function runFx(str, instant) {
		if (!str) return;
		str.split(/\s+/).forEach(function (fx) {
			var p = fx.split(':');
			switch (p[0]) {
				case 'dead':
					setHp(p[1], 0);
					break;
				case 'alive':
					setHp(p[1], 100);
					break;
				case 'hp':
					setHp(p[1], +p[2]);
					break;
				case 'shake':
					if (instant || !scene) break;
					scene.classList.remove('is-shake');
					void scene.offsetWidth;
					scene.classList.add('is-shake');
					break;
				case 'flash':
					if (!instant) spawn('fx-flash', 1, 800);
					break;
				case 'hearts':
					if (!instant) spawn('fx-heart', 12, 2800, '♥');
					break;
				case 'petals':
					if (!instant) spawn('fx-petal', 26, 3600);
					break;
			}
		});
	}
	function spawn(cls, n, life, text) {
		if (!fxLayer) return;
		for (var i = 0; i < n; i++) {
			var el = document.createElement('span');
			el.className = cls;
			if (text) el.textContent = text;
			if (cls !== 'fx-flash') {
				el.style.left = Math.random() * 100 + '%';
				el.style.animationDelay = Math.random() * 0.8 + 's';
				el.style.setProperty('--dx', (Math.random() * 120 - 60).toFixed(0) + 'px');
			}
			fxLayer.appendChild(el);
			setTimeout(el.remove.bind(el), life + 900);
		}
	}

	/* ---------- 한 줄 그리기 ---------- */
	function render(p, instant) {
		var ch = p.dataset.ch || 'say';
		var who = p.dataset.who || '';
		var text = p.innerHTML.trim();
		var row = document.createElement('div');

		if (p.dataset.ts) clock = toSec(p.dataset.ts);

		if (ch === 'divider') {
			row.className = 'line ch-divider';
			row.innerHTML = '<span>' + text + '</span>';
		} else {
			row.className = 'line ch-' + ch;
			var html = '<span class="ts">[' + fmt(clock) + ']</span>';
			if (ch === 'system' || ch === 'alert') {
				html += '<span class="text">' + text + '</span>';
			} else {
				var tag = LABEL[ch] || '';
				var name = who;
				if (ch === 'whisper') {
					// 내가 보낸 귓속말은 "To 상대" 로 표시
					var to = p.dataset.to || (who === ME ? PARTNER : ME);
					name = who === ME ? 'To ' + to : who;
				}
				html +=
					'<b class="tag">[' + tag + ']</b>' +
					'<b class="who"></b><span class="sep">:</span>' +
					'<span class="text">' + text + '</span>';
				row.innerHTML = html;
				row.querySelector('.who').textContent = name;
				html = null;
			}
			if (html) row.innerHTML = html;
		}

		log.appendChild(row);
		runFx(p.dataset.fx, instant);
		// 다음 줄 시각: 글자 수에 따라 몇 초씩 흐르게
		clock += 4 + Math.min(40, Math.round(p.textContent.length * 0.6));
		if (stickBottom) log.scrollTop = log.scrollHeight;
	}

	function waitFor(p) {
		if (p.dataset.wait) return +p.dataset.wait / speed;
		var ch = p.dataset.ch;
		var len = p.textContent.length;
		var base = ch === 'system' || ch === 'alert' ? 900 : ch === 'divider' ? 1300 : 650 + len * 70;
		return Math.min(base, 3200) / speed;
	}

	function showTyping(p) {
		if (!typing) return;
		var ch = p.dataset.ch;
		if (!p.dataset.who || ch === 'system' || ch === 'alert' || ch === 'divider') {
			typing.classList.remove('is-on');
			return;
		}
		typing.innerHTML = '';
		typing.appendChild(document.createTextNode(p.dataset.who + ' 님이 입력 중'));
		typing.insertAdjacentHTML('beforeend', '<i></i><i></i><i></i>');
		typing.classList.add('is-on');
	}

	/* ---------- 재생 ---------- */
	function step() {
		if (idx >= lines.length) return finish();
		var p = lines[idx];
		showTyping(p);
		timer = setTimeout(function () {
			render(p);
			idx++;
			if (playing) step();
		}, waitFor(p));
	}
	function play() {
		if (idx >= lines.length) return;
		playing = true;
		updateUI();
		step();
	}
	function pause() {
		playing = false;
		clearTimeout(timer);
		if (typing) typing.classList.remove('is-on');
		updateUI();
	}
	function finish() {
		playing = false;
		if (typing) typing.classList.remove('is-on');
		if (!log.querySelector('.is-end')) {
			var end = document.createElement('div');
			end.className = 'line is-end';
			end.textContent = '— END —';
			log.appendChild(end);
			log.scrollTop = log.scrollHeight;
		}
		var next = document.querySelector('.scene-nav .next');
		if (next && !next.classList.contains('is-disabled')) next.classList.add('is-glow');
		updateUI();
	}
	function showAll() {
		clearTimeout(timer);
		while (idx < lines.length) {
			render(lines[idx], true);
			idx++;
		}
		finish();
	}
	function replay() {
		clearTimeout(timer);
		log.innerHTML = '';
		idx = 0;
		clock = toSec(body.dataset.start || '02:13');
		setHp('all', 100);
		var next = document.querySelector('.scene-nav .next');
		if (next) next.classList.remove('is-glow');
		play();
	}

	/* ---------- 버튼 ---------- */
	var btnPlay = document.querySelector('[data-act="toggle"]');
	var btnSpeed = document.querySelector('[data-act="speed"]');

	function updateUI() {
		if (btnPlay) {
			btnPlay.textContent = playing ? '❚❚ 일시정지' : idx >= lines.length ? '■ 재생 끝' : '▶ 재생';
			btnPlay.classList.toggle('is-disabled', idx >= lines.length);
		}
		if (btnSpeed) btnSpeed.textContent = '속도 ×' + speed;
	}

	document.addEventListener('click', function (e) {
		var b = e.target.closest('[data-act]');
		if (!b) return;
		var act = b.dataset.act;
		if (act === 'toggle') playing ? pause() : play();
		if (act === 'replay') replay();
		if (act === 'all') showAll();
		if (act === 'speed') {
			speed = speed === 1 ? 2 : speed === 2 ? 3 : 1;
			updateUI();
		}
	});

	// 스페이스바: 재생/정지
	document.addEventListener('keydown', function (e) {
		if (e.code === 'Space' && !/INPUT|TEXTAREA/.test(e.target.tagName)) {
			e.preventDefault();
			playing ? pause() : play();
		}
	});

	// 사용자가 위로 스크롤하면 자동 스크롤 잠시 멈춤
	log.addEventListener('scroll', function () {
		stickBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 40;
	});

	/* ---------- 채널 탭 ---------- */
	var tabs = document.querySelector('.chat-tabs');
	if (tabs) {
		var used = {};
		lines.forEach(function (p) {
			var c = p.dataset.ch;
			if (c === 'alert') c = 'system';
			used[c] = true;
		});
		var html = '<button type="button" class="is-on" data-filter="all">전체</button>';
		['party', 'guild', 'whisper', 'system'].forEach(function (c) {
			if (used[c]) html += '<button type="button" data-filter="' + c + '">' + LABEL[c] + '</button>';
		});
		tabs.innerHTML = html;
		tabs.addEventListener('click', function (e) {
			var b = e.target.closest('button');
			if (!b) return;
			tabs.querySelectorAll('button').forEach(function (x) {
				x.classList.toggle('is-on', x === b);
			});
			log.dataset.filter = b.dataset.filter;
			log.scrollTop = log.scrollHeight;
		});
	}

	/* ---------- 이전/다음 장면 ---------- */
	var list = window.SCENES || [];
	var here = location.pathname.split('/').pop() || '';
	var at = -1;
	for (var i = 0; i < list.length; i++) if (list[i].file === here) at = i;

	var noEl = document.querySelector('.scene-head .no');
	if (noEl && at > -1) noEl.textContent = 'CHAPTER ' + String(at + 1).padStart(2, '0') + ' / ' + list.length;

	function navLink(sel, item, prefix) {
		var a = document.querySelector(sel);
		if (!a) return;
		if (item) {
			a.href = item.file;
			a.textContent = prefix === '<' ? '◀ ' + item.title : item.title + ' ▶';
			a.title = item.title;
		} else {
			a.classList.add('is-disabled');
			a.removeAttribute('href');
		}
	}
	navLink('.scene-nav .prev', list[at - 1], '<');
	navLink('.scene-nav .next', list[at + 1], '>');

	/* ---------- 시작 ---------- */
	updateUI();
	setTimeout(play, 700);
})();
