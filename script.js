// [1] CSS 스타일 강제 주입 (HTML 태그 없이 자바스크립트로 처리)
const styleElement = document.createElement('style');
styleElement.innerHTML = `
  body {
    -webkit-user-select: none !important; /* Safari */
    -moz-user-select: none !important;    /* Firefox */
    -ms-user-select: none !important;     /* IE/Edge */
    user-select: none !important;         /* Standard */
    -webkit-touch-callout: none !important; /* iOS 장시간 터치 시 메뉴 방지 */
  }
`;
document.head.appendChild(styleElement);

// [2] 우클릭 방지 기능
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
}, false);

// [3] 드래그 및 선택 방지
document.addEventListener('selectstart', function(e) {
  e.preventDefault();
}, false);

// [4] 키보드 단축키 (복사, 소스보기, 개발자도구) 방지
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 85 || e.keyCode === 83) || e.keyCode === 123) {
    e.preventDefault();
    return false;
  }
});
