화면에서 쓰는 이미지 (img_01 원본을 화면용 webp로 줄인 것)

  logo-big.webp     타이틀 로고            ← img_01/main_big_logo.png
  logo-sm.webp      상단바 작은 로고        ← img_01/main_sm_logo.png
  main.webp         타이틀 배경            ← img_01/visual.jpeg
  ruby.webp         루비짱 전신 (투명)      ← img_01/ruby.png      : 광장 캐릭터 / 캐릭터 정보창
  wooyo.webp        킹우요 전신 (투명)      ← img_01/wooyo.png     : 광장 캐릭터 / 캐릭터 정보창
  ruby-face.webp    루비짱 얼굴 (잘라낸 것)  : 상태창 / 캐릭터 탭
  wooyo-face.webp   킹우요 얼굴 (잘라낸 것)  : 캐릭터 탭

원본을 바꾸면 이 파일들도 같은 이름으로 다시 만들어 넣으면 됩니다.
파일이 없으면 assets/ph-*.svg 임시 그림이 대신 보입니다.

추가로 넣을 수 있는 것 (선택)
  plaza.webp                     길드 광장 배경 (가로형). 없으면 CSS로 그린 광장이 나옵니다.
  scene-01.webp ~ scene-18.webp  각 채팅 장면 배경 (chat-XX.html 번호와 같음, 흐리게 깔림)
  장비 아이콘: character.html 의 CHARS 데이터 items 항목에 img: 'img/파일명.webp' 추가
