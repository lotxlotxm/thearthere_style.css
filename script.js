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






<!--------검색바 필터----------->

<script>
(function() {
    let searchTimer; // GA4 전송을 위한 타이머 변수
    function startSearchSystem() {
        // 검색창 타입별 설정
        const searchConfigs = {
            "여기에검색바": "Search for cities or art museums...",
            "아티스트검색바": "Search by artist, artwork, or art museum name...",
            "컬렉션검색바": "Search by artist, artwork..."
        };
        const inject = () => {
            const allElements = document.querySelectorAll('.notion-text, .notion-callout__content, span, div');
            
            allElements.forEach(el => {
                if (el.innerText && !el.querySelector('.my-specific-search')) {
                    const text = el.innerText.trim();
                    
                    if (searchConfigs[text]) {
                        const placeholderText = searchConfigs[text];
                        
                        el.innerHTML = `
                            
    <div class="search-wrapper" style="margin: 30px 0 10px 0; position: relative; width: 100%; z-index: 999; background: transparent !important;">
                                <input type="text" class="my-specific-search" placeholder="${placeholderText}" 
                                       style="
                                           width: 100%; 
                                           padding: 10px 40px 12px 0px; 
                                           border: none; 
                                           border-bottom: 2px solid #37352f; 
                                           border-radius: 0; 
                                           outline: none; 
                                           background: transparent !important; 
                                           color: #37352f !important; 
                                           box-sizing: border-box;
                                           font-size: 18px;
                                           font-weight: 400;
                                           font-family: inherit;
                                       ">
                                <span style="
                                    position: absolute; 
                                    right: 5px; 
                                    top: 50%; 
                                    transform: translateY(-50%); 
                                    pointer-events: none;
                                    font-size: 22px;
                                    opacity: 0.8;
                                    color: #000;
                                ">🔍</span>
                            </div>
                        `;
                        
                        const input = el.querySelector('.my-specific-search');
                        input.addEventListener('input', handleIndividualSearch);
                    }
                }
            });
        };
        function handleIndividualSearch(e) {
            const filter = e.target.value.toLowerCase().trim();
            const parentBlock = e.target.closest('.notion-text, .notion-callout');

            // --- GA4 검색어 전송 로직 (추가된 부분) ---
            clearTimeout(searchTimer);
            if (filter.length > 0) {
                searchTimer = setTimeout(() => {
                    if (typeof gtag === 'function') {
                        gtag('event', 'view_search_results', {
                            search_term: filter
                        });
                        console.log('GA4 검색어 전송 완료:', filter); // 확인용 로그 (나중에 삭제 가능)
                    }
                }, 800); // 0.8초간 입력이 없으면 전송
            }
            // -----------------------------
            let nextEl = parentBlock ? parentBlock.nextElementSibling : null;
            while (nextEl && !nextEl.classList.contains('notion-collection')) {
                nextEl = nextEl.nextElementSibling;
            }

            if (nextEl) {
                const items = nextEl.querySelectorAll('.notion-collection-list__item, .notion-list-item, .notion-collection-item, .notion-collection-card');
                items.forEach(item => {
                    const text = item.innerText.toLowerCase();
                    if (text.includes(filter)) {
                        item.style.setProperty('display', '', 'important');
                        item.style.setProperty('opacity', '1', 'important');
                        item.style.setProperty('visibility', 'visible', 'important');
                        item.style.setProperty('height', 'auto', 'important');
                    } else {
                        item.style.setProperty('display', 'none', 'important');
                        item.style.setProperty('opacity', '0', 'important');
                        item.style.setProperty('visibility', 'hidden', 'important');
                        item.style.setProperty('height', '0', 'important');
                    }
                });
            }
        }

        const observer = new MutationObserver(inject);
        observer.observe(document.body, { childList: true, subtree: true });
        inject();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startSearchSystem);
    } else {
        startSearchSystem();
    }
})();</script>
