(function() {
  function initButtons() {
    // 1. 이미 버튼이 화면에 안전하게 존재한다면 중복 생성 차단
    if (document.getElementById('super-custom-controls')) return;

    // 2. body 태그가 없으면 안전하게 실행 보류 (에러 방어)
    if (!document.body) return;

    // 3. 버튼 컨테이너 생성 및 HTML 주입
    const controlContainer = document.createElement('div');
    controlContainer.id = 'super-custom-controls';
    controlContainer.innerHTML = `
      <button class="control-btn share" id="share-btn-action" title="공유하기">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
          </svg>
      </button>
      <a href="#" class="control-btn top" id="top-btn-action">TOP</a>
    `;

    document.body.appendChild(controlContainer);

    const topBtn = document.getElementById('top-btn-action');
    const shareBtn = document.getElementById('share-btn-action');

    if (topBtn) {
      topBtn.onclick = function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    }

    if (shareBtn) {
      shareBtn.onclick = function() {
        const url = window.location.href;
        const isMobileOrTablet = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                                 (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);

        if (isMobileOrTablet && navigator.share) {
          navigator.share({
            title: document.title,
            url: url
          }).catch((error) => {
            if (error.name !== 'AbortError') {
              copyText(url);
            }
          });
        } else {
          copyText(url);
        }
      };
    }
  }

  // [자가 복구 및 초기 진입 장치] 
  // 0.2초마다 화면을 감시하여 버튼이 소실되었거나 본문이 새로 그려졌을 때 강제로 재생성시킵니다.
  // 이 루프는 무한히 돌지 않고, 버튼이 안전하게 화면에 안착하여 자리를 잡으면 탐색 주기를 2초로 늦춰 배터리와 사양 소모를 차단합니다.
  let watchInterval = 200;
  function startWatch() {
    setTimeout(function watch() {
      initButtons();
      
      const btnExists = document.getElementById('super-custom-controls');
      // 버튼이 정상적으로 박혀있다면 감시 주기 완화 (휴면 모드)
      watchInterval = btnExists ? 2000 : 200; 
      
      setTimeout(watch, watchInterval);
    }, watchInterval);
  }

  startWatch();
})();
