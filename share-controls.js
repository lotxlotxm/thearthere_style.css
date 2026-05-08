(function() {
  function initButtons() {
    const container = document.getElementById('super-custom-controls');
    if (!container) return;

    // [1] 모바일/아이패드 렌더링 갱신 시 버튼이 소멸하는 것을 원천 차단하기 위해 body 최하단으로 강제 복구 배치
    if (document.body && container.parentElement !== document.body) {
      document.body.appendChild(container);
    }

    const topBtn = document.getElementById('top-btn-action');
    const shareBtn = document.getElementById('share-btn-action');

    // [2] 모바일 및 터치 디바이스(아이패드 등) 터치 즉시 반응 유틸리티
    function bindFastClick(element, action) {
      if (!element) return;
      
      let moved = false;
      element.addEventListener('touchstart', function() {
        moved = false;
      }, { passive: true });

      element.addEventListener('touchmove', function() {
        moved = true;
      }, { passive: true });

      element.addEventListener('touchend', function(e) {
        if (!moved) {
          e.preventDefault();
          action();
        }
      });

      // 마우스 클릭도 정상 지원 (PC 대응)
      element.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.screenX === 0 && e.screenY === 0) return; 
        action();
      });
    }

    // TOP 버튼 작동 정의
    if (topBtn && !topBtn.dataset.bound) {
      topBtn.dataset.bound = "true";
      bindFastClick(topBtn, function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 공유하기 버튼 작동 정의
    if (shareBtn && !shareBtn.dataset.bound) {
      shareBtn.dataset.bound = "true";
      bindFastClick(shareBtn, function() {
        const url = window.location.href;
        // 아이패드는 navigator.maxTouchPoints 검사로 정확하게 태블릿 식별 보장
        const isMobileOrTablet = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
        
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
      });
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        alert("Link copied to clipboard.");
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.focus();
    input.select();
    try {
      document.execCommand('copy');
      alert("Link copied to clipboard.");
    } catch (err) {}
    document.body.removeChild(input);
  }

  // 초기 실행 리스너 등록
  if (document.readyState === 'complete') {
    initButtons();
  } else {
    window.addEventListener('load', initButtons);
    document.addEventListener('DOMContentLoaded', initButtons);
  }

  // [3] 🚨 깃허브 로드 비동기 시차 완벽 방어용 상시 복구 엔진 (핵심)
  // 모바일/아이패드에서 Super 엔진이 돔을 다시 그리면서 버튼을 임의로 소거하더라도, 무한히 감지하여 0.1초 만에 계속 재배치합니다.
  const observer = new MutationObserver(function() {
    const container = document.getElementById('super-custom-controls');
    if (container && container.parentElement !== document.body) {
      initButtons();
    }
  });

  // Body의 하위 노드 구조 변화를 추적 시작
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    window.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
