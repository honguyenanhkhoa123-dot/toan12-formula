/**
 * TOÁN 12 PRO - APPLICATION CORE LOGIC
 * Manages State, LocalStorage, Flashcards, Quiz Engine, Search, KaTeX & Audio Synthesis
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. STATE & STORAGE MANAGEMENT
  // ==========================================================================
  const STORAGE_KEYS = {
    MEMORIZED: 'toan12_memorized_ids',
    BOOKMARKED: 'toan12_bookmarked_ids',
    THEME: 'toan12_theme',
    SOUND: 'toan12_sound_enabled',
    STREAK: 'toan12_quiz_streak'
  };

  const state = {
    activeTab: 'paneHandbook',
    selectedChapter: 'all',
    statusFilter: 'all',
    searchQuery: '',
    memorizedIds: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMORIZED) || '[]')),
    bookmarkedIds: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKED) || '[]')),
    theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'dark',
    soundEnabled: localStorage.getItem(STORAGE_KEYS.SOUND) !== 'false',
    // Flashcard State
    fcIndex: 0,
    fcFlipped: false,
    fcItems: [],
    // Quiz State
    quizList: [],
    quizIndex: 0,
    quizScore: 0,
    quizStreak: parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) || '0', 10),
    quizAnswered: false
  };

  // ==========================================================================
  // 2. WEB AUDIO SYNTHESIS (TACTILE HAPTIC AUDIO FEEDBACK)
  // ==========================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'flip') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        // Happy major chord
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + idx * 0.06);
          g.gain.setValueAtTime(0.12, now + idx * 0.06);
          g.gain.linearRampToValueAtTime(0.01, now + idx * 0.06 + 0.25);
          o.start(now + idx * 0.06);
          o.stop(now + idx * 0.06 + 0.25);
        });
      } else if (type === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  // ==========================================================================
  // 3. UI RENDERING & THEME
  // ==========================================================================
  const body = document.body;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const toastBox = document.getElementById('toastBox');

  // Initialize Theme
  body.setAttribute('data-theme', state.theme);
  themeToggleBtn.querySelector('.theme-icon').textContent = state.theme === 'dark' ? '🌙' : '☀️';

  themeToggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', state.theme);
    localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
    themeToggleBtn.querySelector('.theme-icon').textContent = state.theme === 'dark' ? '🌙' : '☀️';
    playSound('click');
    showToast(`Đã chuyển sang giao diện ${state.theme === 'dark' ? 'Tối' : 'Sáng'}`);
  });

  // Initialize Sound
  soundToggleBtn.querySelector('.sound-icon').textContent = state.soundEnabled ? '🔊' : '🔇';
  soundToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem(STORAGE_KEYS.SOUND, state.soundEnabled);
    soundToggleBtn.querySelector('.sound-icon').textContent = state.soundEnabled ? '🔊' : '🔇';
    playSound('click');
    showToast(state.soundEnabled ? 'Đã bật âm thanh hiệu ứng' : 'Đã tắt âm thanh hiệu ứng');
  });

  function showToast(msg) {
    if (!toastBox) return;
    toastBox.textContent = msg;
    toastBox.classList.add('show');
    clearTimeout(toastBox._timer);
    toastBox._timer = setTimeout(() => {
      toastBox.classList.remove('show');
    }, 2400);
  }

  // ==========================================================================
  // 4. KATEX MATH RENDERING HELPER
  // ==========================================================================
  function renderAllMath(element) {
    const target = element || document.body;
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(target, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn('KaTeX render error:', err);
      }
    } else {
      setTimeout(() => renderAllMath(target), 300);
    }
  }

  // ==========================================================================
  // 5. NAVIGATION & TABS
  // ==========================================================================
  const bottomNav = document.getElementById('bottomNav');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const searchFilterWrapper = document.querySelector('.search-filter-wrapper');

  bottomNav.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');
      switchTab(targetTabId);
    });
  });

  function switchTab(targetTabId) {
    playSound('click');
    state.activeTab = targetTabId;

    // Update bottom nav active state
    bottomNav.querySelectorAll('.nav-item').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === targetTabId);
    });

    // Update panes
    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === targetTabId);
    });

    // Only show search filter bar in Handbook tab
    if (searchFilterWrapper) {
      searchFilterWrapper.style.display = (targetTabId === 'paneHandbook') ? 'flex' : 'none';
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize specific tab views
    if (targetTabId === 'paneFlashcard') {
      initFlashcards();
    } else if (targetTabId === 'paneQuiz') {
      initQuiz();
    } else if (targetTabId === 'paneReels') {
      initReelsFeed();
    }
  }

  // Header Reels Hot Button
  const headerReelsBtn = document.getElementById('headerReelsBtn');
  if (headerReelsBtn) {
    headerReelsBtn.addEventListener('click', () => {
      switchTab('paneReels');
    });
  }

  // ==========================================================================
  // 6. CHAPTER CHIPS & FILTERING
  // ==========================================================================
  const chapterChipsContainer = document.getElementById('chapterChips');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const statusBtns = document.querySelectorAll('.status-btn');

  function renderChapterChips() {
    chapterChipsContainer.innerHTML = '';
    CHAPTERS.forEach(chap => {
      const count = chap.id === 'all' 
        ? FORMULAS_DATA.length 
        : FORMULAS_DATA.filter(f => f.chapter === chap.id).length;
      
      const chip = document.createElement('button');
      chip.className = `chip-btn ${state.selectedChapter === chap.id ? 'active' : ''}`;
      chip.innerHTML = `<span>${chap.icon}</span> <span>${chap.name} (${count})</span>`;
      chip.addEventListener('click', () => {
        playSound('click');
        state.selectedChapter = chap.id;
        document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderHandbookList();
      });
      chapterChipsContainer.appendChild(chip);
    });
  }

  // Search input handler
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderHandbookList();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    renderHandbookList();
  });

  // Status Filter Buttons
  statusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      statusBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.statusFilter = btn.getAttribute('data-filter');
      renderHandbookList();
    });
  });

  document.getElementById('resetFilterBtn').addEventListener('click', () => {
    state.selectedChapter = 'all';
    state.statusFilter = 'all';
    state.searchQuery = '';
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    document.querySelectorAll('.chip-btn').forEach(c => c.classList.toggle('active', c.textContent.includes('Tất cả')));
    statusBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
    renderHandbookList();
  });

  // ==========================================================================
  // 7. HANDBOOK LIST RENDERING & ACTIONS
  // ==========================================================================
  const formulaList = document.getElementById('formulaList');
  const emptyState = document.getElementById('emptyState');

  function getFilteredFormulas() {
    return FORMULAS_DATA.filter(item => {
      // 1. Chapter filter
      if (state.selectedChapter !== 'all' && item.chapter !== state.selectedChapter) {
        return false;
      }
      // 2. Status filter
      const isMemorized = state.memorizedIds.has(item.id);
      const isBookmarked = state.bookmarkedIds.has(item.id);

      if (state.statusFilter === 'memorized' && !isMemorized) return false;
      if (state.statusFilter === 'unmemorized' && isMemorized) return false;
      if (state.statusFilter === 'bookmarked' && !isBookmarked) return false;

      // 3. Search query
      if (state.searchQuery) {
        const query = state.searchQuery;
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.desc.toLowerCase().includes(query);
        const matchChap = item.chapterName.toLowerCase().includes(query);
        const matchMnemonic = (item.mnemonic || '').toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchChap && !matchMnemonic) {
          return false;
        }
      }

      return true;
    });
  }

  function renderHandbookList() {
    const filtered = getFilteredFormulas();
    updateCounts();

    if (filtered.length === 0) {
      formulaList.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    formulaList.innerHTML = '';

    filtered.forEach(item => {
      const isMemorized = state.memorizedIds.has(item.id);
      const isBookmarked = state.bookmarkedIds.has(item.id);

      const card = document.createElement('article');
      card.className = 'formula-card';
      card.id = `card-${item.id}`;

      card.innerHTML = `
        <div class="card-header-row">
          <span class="chapter-badge">${item.chapterName}</span>
          <div class="card-actions-quick">
            <button class="action-icon-btn ${isBookmarked ? 'bookmarked' : ''}" data-action="bookmark" data-id="${item.id}" aria-label="Đánh dấu yêu thích" title="Lưu yêu thích">
              ${isBookmarked ? '⭐' : '☆'}
            </button>
          </div>
        </div>

        <h3 class="formula-title">${item.title}</h3>

        <div class="math-container">
          $$${item.latex}$$
        </div>

        <p class="formula-desc">${item.desc}</p>

        ${item.variables ? `<p class="formula-variables">📝 ${item.variables}</p>` : ''}

        ${item.mnemonic ? `<div class="mnemonic-box"><strong>${item.mnemonic}</strong></div>` : ''}

        <div class="card-footer-row">
          <button class="memorize-btn ${isMemorized ? 'is-memorized' : ''}" data-action="memorize" data-id="${item.id}">
            <span>${isMemorized ? '✅ Đã thuộc' : '⏳ Chưa thuộc'}</span>
          </button>
          <button class="copy-latex-btn" data-action="copy" data-latex="${encodeURIComponent(item.latex)}">
            📋 Sao chép
          </button>
        </div>
      `;

      formulaList.appendChild(card);
    });

    // Render KaTeX for math formulas inside cards
    renderAllMath(formulaList);
  }

  // Delegated events for cards (bookmark, memorize, copy)
  formulaList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');

    if (action === 'memorize') {
      const wasMemorized = state.memorizedIds.has(id);
      if (wasMemorized) {
        state.memorizedIds.delete(id);
        playSound('fail');
        showToast('Đã chuyển về trạng thái: Chưa thuộc');
      } else {
        state.memorizedIds.add(id);
        playSound('success');
        showToast('🎉 Tuyệt vời! Đã ghi nhận thuộc công thức!');
      }
      localStorage.setItem(STORAGE_KEYS.MEMORIZED, JSON.stringify([...state.memorizedIds]));
      renderHandbookList();
    } else if (action === 'bookmark') {
      const wasBookmarked = state.bookmarkedIds.has(id);
      if (wasBookmarked) {
        state.bookmarkedIds.delete(id);
        playSound('click');
        showToast('Đã bỏ yêu thích');
      } else {
        state.bookmarkedIds.add(id);
        playSound('success');
        showToast('⭐ Đã thêm vào danh sách yêu thích!');
      }
      localStorage.setItem(STORAGE_KEYS.BOOKMARKED, JSON.stringify([...state.bookmarkedIds]));
      renderHandbookList();
    } else if (action === 'copy') {
      const latex = decodeURIComponent(btn.getAttribute('data-latex'));
      copyToClipboard(latex, '📋 Đã sao chép công thức vào clipboard!');
    }
  });

  // Resilient Clipboard Copy Helper
  function copyToClipboard(text, successMsg = '📋 Đã sao chép vào clipboard!') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        playSound('click');
        showToast(successMsg);
      }).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) {
        playSound('click');
        showToast(successMsg);
      } else {
        showToast('⚠️ Vui lòng copy thủ công');
      }
    } catch (e) {
      showToast('⚠️ Không thể sao chép');
    }
  }

  // Update Counters & Progress Indicator
  function updateCounts() {
    const total = FORMULAS_DATA.length;
    const memorized = state.memorizedIds.size;
    const bookmarked = state.bookmarkedIds.size;
    const unmemorized = total - memorized;
    const percent = Math.round((memorized / (total || 1)) * 100);

    // Update filter badges
    const countAllEl = document.getElementById('countAll');
    if (countAllEl) countAllEl.textContent = total;
    const countMemorizedEl = document.getElementById('countMemorized');
    if (countMemorizedEl) countMemorizedEl.textContent = memorized;
    const countUnmemorizedEl = document.getElementById('countUnmemorized');
    if (countUnmemorizedEl) countUnmemorizedEl.textContent = unmemorized;
    const countBookmarkedEl = document.getElementById('countBookmarked');
    if (countBookmarkedEl) countBookmarkedEl.textContent = bookmarked;

    // Update header progress pill
    const globalProgressText = document.getElementById('globalProgressText');
    if (globalProgressText) globalProgressText.textContent = `${percent}%`;

    // Update Cyber HUD Hero Metrics
    const hudTotalFormulas = document.getElementById('hudTotalFormulas');
    if (hudTotalFormulas) hudTotalFormulas.textContent = `${total}+`;

    const hudMemorizedRatio = document.getElementById('hudMemorizedRatio');
    if (hudMemorizedRatio) hudMemorizedRatio.textContent = `${percent}%`;

    const hudProgressBar = document.getElementById('hudProgressBar');
    if (hudProgressBar) hudProgressBar.style.width = `${percent}%`;

    // Dynamic Mastery Rank
    const hudMasteryRank = document.getElementById('hudMasteryRank');
    const hudRankBar = document.getElementById('hudRankBar');
    let rankTitle = 'TẬP SỰ';
    let rankWidth = '15%';

    if (percent === 100) {
      rankTitle = 'THẦN TOÁN 10';
      rankWidth = '100%';
    } else if (percent >= 80) {
      rankTitle = 'ĐẠI SƯ 9+';
      rankWidth = `${percent}%`;
    } else if (percent >= 50) {
      rankTitle = 'CAO THỦ 8+';
      rankWidth = `${percent}%`;
    } else if (percent >= 20) {
      rankTitle = 'CHIẾN BINH 7+';
      rankWidth = `${percent}%`;
    } else if (percent > 0) {
      rankTitle = 'TÂN BINH';
      rankWidth = '25%';
    }

    if (hudMasteryRank) hudMasteryRank.textContent = rankTitle;
    if (hudRankBar) hudRankBar.style.width = rankWidth;

    // Backwards compatibility for old chart
    const statCountText = document.getElementById('statCountText');
    if (statCountText) statCountText.textContent = `${memorized} / ${total}`;
    const percentText = document.getElementById('percentText');
    if (percentText) percentText.textContent = `${percent}%`;
    const circle = document.getElementById('circleProgress');
    if (circle) circle.setAttribute('stroke-dasharray', `${percent}, 100`);
  }

  // ==========================================
  // 8. FLASHCARD (SPACED REPETITION) MODULE
  // ==========================================
  const flashcardElement = document.getElementById('flashcardElement');
  const fcCurrentIndex = document.getElementById('fcCurrentIndex');
  const fcTotalCount = document.getElementById('fcTotalCount');
  const fcProgressFill = document.getElementById('fcProgressFill');
  const fcChapterSelect = document.getElementById('fcChapterSelect');

  const fcFrontChapter = document.getElementById('fcFrontChapter');
  const fcFrontTitle = document.getElementById('fcFrontTitle');
  const fcFrontDesc = document.getElementById('fcFrontDesc');

  const fcBackChapter = document.getElementById('fcBackChapter');
  const fcBackMath = document.getElementById('fcBackMath');
  const fcBackMnemonic = document.getElementById('fcBackMnemonic');

  const fcPrevBtn = document.getElementById('fcPrevBtn');
  const fcNextBtn = document.getElementById('fcNextBtn');
  const fcFailBtn = document.getElementById('fcFailBtn');
  const fcPassBtn = document.getElementById('fcPassBtn');

  // Populate Flashcard Chapter Select
  CHAPTERS.forEach(c => {
    if (c.id === 'all') return;
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.icon} ${c.name}`;
    fcChapterSelect.appendChild(opt);
  });

  fcChapterSelect.addEventListener('change', (e) => {
    playSound('click');
    initFlashcards(e.target.value);
  });

  function initFlashcards(chapId = 'all') {
    state.fcItems = FORMULAS_DATA.filter(f => chapId === 'all' || f.chapter === chapId);
    state.fcIndex = 0;
    state.fcFlipped = false;
    flashcardElement.classList.remove('flipped');
    updateFlashcardView();
  }

  function updateFlashcardView() {
    if (state.fcItems.length === 0) return;
    const item = state.fcItems[state.fcIndex];

    fcCurrentIndex.textContent = state.fcIndex + 1;
    fcTotalCount.textContent = state.fcItems.length;

    const progressPct = ((state.fcIndex + 1) / state.fcItems.length) * 100;
    fcProgressFill.style.width = `${progressPct}%`;

    // Reset flipped state
    state.fcFlipped = false;
    flashcardElement.classList.remove('flipped');

    // Populate Front
    fcFrontChapter.textContent = item.chapterName;
    fcFrontTitle.innerHTML = item.title;
    fcFrontDesc.innerHTML = item.desc;

    // Populate Back
    fcBackChapter.textContent = item.chapterName;
    fcBackMath.innerHTML = `$$${item.latex}$$`;
    fcBackMnemonic.innerHTML = item.mnemonic ? `<strong>${item.mnemonic}</strong>` : '💡 Cố gắng luyện tập nhớ các hệ số!';

    renderAllMath(flashcardElement);
  }

  let isSwiping = false;

  function flipFlashcard() {
    if (isSwiping) return;
    playSound('flip');
    state.fcFlipped = !state.fcFlipped;
    flashcardElement.classList.toggle('flipped', state.fcFlipped);
  }

  flashcardElement.addEventListener('click', flipFlashcard);

  // Keyboard navigation for Flashcards (Desktop accessibility)
  window.addEventListener('keydown', (e) => {
    if (state.activeTab !== 'paneFlashcard') return;
    if (e.code === 'Space') {
      e.preventDefault();
      flipFlashcard();
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      nextFlashcard();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      prevFlashcard();
    }
  });

  // Touch Swipe Gesture on Flashcards for Mobile (Ergonomic Touch Detection)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  flashcardElement.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  flashcardElement.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      handleSwipe();
    }
  }, { passive: true });

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    // Trigger only if horizontal swipe dominates vertical scrolling
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      isSwiping = true;
      if (diffX < 0) {
        nextFlashcard(); // swipe left -> next card
      } else {
        prevFlashcard(); // swipe right -> prev card
      }
      setTimeout(() => { isSwiping = false; }, 260);
    }
  }

  function nextFlashcard() {
    if (state.fcIndex < state.fcItems.length - 1) {
      playSound('click');
      state.fcIndex++;
      updateFlashcardView();
    } else {
      showToast('🎉 Đã xem hết toàn bộ thẻ của chương này!');
    }
  }

  function prevFlashcard() {
    if (state.fcIndex > 0) {
      playSound('click');
      state.fcIndex--;
      updateFlashcardView();
    }
  }

  fcNextBtn.addEventListener('click', nextFlashcard);
  fcPrevBtn.addEventListener('click', prevFlashcard);

  fcFailBtn.addEventListener('click', () => {
    const current = state.fcItems[state.fcIndex];
    state.memorizedIds.delete(current.id);
    localStorage.setItem(STORAGE_KEYS.MEMORIZED, JSON.stringify([...state.memorizedIds]));
    playSound('fail');
    showToast('Đã đánh dấu: Cần ôn lại thẻ này');
    updateCounts();
    nextFlashcard();
  });

  fcPassBtn.addEventListener('click', () => {
    const current = state.fcItems[state.fcIndex];
    state.memorizedIds.add(current.id);
    localStorage.setItem(STORAGE_KEYS.MEMORIZED, JSON.stringify([...state.memorizedIds]));
    playSound('success');
    showToast('✅ Tuyệt vời! Đã thuộc thẻ này');
    updateCounts();
    nextFlashcard();
  });

  // ==========================================
  // 9. QUIZ / TRẮC NGHIỆM TRÍ NHỚ MODULE
  // ==========================================
  const quizStreakCount = document.getElementById('quizStreakCount');
  const quizScoreCount = document.getElementById('quizScoreCount');
  const quizChapterTag = document.getElementById('quizChapterTag');
  const quizIndexText = document.getElementById('quizIndexText');
  const quizQuestionText = document.getElementById('quizQuestionText');
  const quizOptionsContainer = document.getElementById('quizOptionsContainer');
  const quizExplainBox = document.getElementById('quizExplainBox');
  const explainContent = document.getElementById('explainContent');
  const quizNextBtn = document.getElementById('quizNextBtn');
  const quizRestartBtn = document.getElementById('quizRestartBtn');

  function initQuiz() {
    // Shuffle formulas that have quiz questions
    state.quizList = FORMULAS_DATA.filter(f => f.quiz).sort(() => Math.random() - 0.5);
    state.quizIndex = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    quizStreakCount.textContent = state.quizStreak;
    quizScoreCount.textContent = '0';
    renderQuizCard();
  }

  function renderQuizCard() {
    if (state.quizList.length === 0) return;
    state.quizAnswered = false;
    quizExplainBox.style.display = 'none';

    const item = state.quizList[state.quizIndex];
    const quiz = item.quiz;

    quizChapterTag.textContent = item.chapterName;
    quizIndexText.textContent = `Câu ${state.quizIndex + 1} / ${state.quizList.length}`;
    quizQuestionText.innerHTML = quiz.q.includes('$') ? quiz.q : (quiz.q.includes('\\') ? `$${quiz.q}$` : quiz.q);

    quizOptionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    quiz.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `
        <span class="opt-prefix">${letters[idx]}</span>
        <span class="opt-text">${formatQuizOption(opt)}</span>
      `;

      btn.addEventListener('click', () => {
        if (state.quizAnswered) return;
        handleQuizAnswer(idx, quiz.correct, btn, quiz.explain);
      });

      quizOptionsContainer.appendChild(btn);
    });

    renderAllMath(document.getElementById('quizCard'));
  }

  function formatQuizOption(opt) {
    if (!opt) return '';
    if (opt.includes('$')) return opt;
    const hasVietnamese = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i.test(opt);
    if (hasVietnamese) {
      if (opt.includes('\\text{')) return `$${opt}$`;
      return opt;
    }
    return `$${opt}$`;
  }

  function handleQuizAnswer(selectedIdx, correctIdx, selectedBtn, explanation) {
    state.quizAnswered = true;
    const allOptBtns = quizOptionsContainer.querySelectorAll('.quiz-opt-btn');

    if (selectedIdx === correctIdx) {
      playSound('success');
      selectedBtn.classList.add('correct');
      state.quizScore += 10;
      state.quizStreak += 1;
      quizScoreCount.textContent = state.quizScore;
      quizStreakCount.textContent = state.quizStreak;
      localStorage.setItem(STORAGE_KEYS.STREAK, state.quizStreak);
      showToast('🔥 Chính xác! +10 điểm!');
    } else {
      playSound('fail');
      selectedBtn.classList.add('wrong');
      allOptBtns[correctIdx].classList.add('correct');
      state.quizStreak = 0;
      quizStreakCount.textContent = '0';
      localStorage.setItem(STORAGE_KEYS.STREAK, '0');
      showToast('Rất tiếc! Chưa chính xác');
    }

    // Show Explanation
    explainContent.innerHTML = explanation;
    quizExplainBox.style.display = 'block';
    renderAllMath(quizExplainBox);
  }

  quizNextBtn.addEventListener('click', () => {
    playSound('click');
    if (state.quizIndex < state.quizList.length - 1) {
      state.quizIndex++;
      renderQuizCard();
    } else {
      showToast(`🏆 Bạn đã hoàn thành bài thi! Tổng điểm: ${state.quizScore}`);
      initQuiz();
    }
  });

  quizRestartBtn.addEventListener('click', () => {
    playSound('click');
    initQuiz();
    showToast('Đã tạo bài luyện tập trắc nghiệm mới!');
  });

  // ==========================================
  // 10. DEPLOY GUIDE & DATA ACTIONS
  // ==========================================
  const copyGitCmdBtn = document.getElementById('copyGitCmdBtn');
  if (copyGitCmdBtn) {
    copyGitCmdBtn.addEventListener('click', () => {
      const gitCmds = `git init\ngit add .\ngit commit -m "Full Cong Thuc Toan 12 App"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/toan12-formula.git\ngit push -u origin main`;
      copyToClipboard(gitCmds, '📋 Đã sao chép các dòng lệnh Git!');
    });
  }

  const exportDataBtn = document.getElementById('exportDataBtn');
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', () => {
      const backup = {
        memorized: [...state.memorizedIds],
        bookmarked: [...state.bookmarkedIds],
        streak: state.quizStreak,
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `toan12_tien_do_${new Date().toLocaleDateString('vi-VN').replace(/\\//g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      playSound('success');
      showToast('📥 Đã tải file sao lưu tiến độ!');
    });
  }

  const resetAllDataBtn = document.getElementById('resetAllDataBtn');
  if (resetAllDataBtn) {
    resetAllDataBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn xóa toàn bộ tiến độ đã thuộc để học lại từ đầu không?')) {
        state.memorizedIds.clear();
        state.bookmarkedIds.clear();
        state.quizStreak = 0;
        localStorage.removeItem(STORAGE_KEYS.MEMORIZED);
        localStorage.removeItem(STORAGE_KEYS.BOOKMARKED);
        localStorage.removeItem(STORAGE_KEYS.STREAK);
        playSound('click');
        renderHandbookList();
        showToast('Đã làm mới toàn bộ tiến độ!');
      }
    });
  }

  // ==========================================
  // 11. CYBER MATRIX CANVAS & HERO INTERACTIONS
  // ==========================================
  const heroStartPracticeBtn = document.getElementById('heroStartPracticeBtn');
  if (heroStartPracticeBtn) {
    heroStartPracticeBtn.addEventListener('click', () => {
      playSound('click');
      switchTab('paneFlashcard');
    });
  }

  const heroFilterKeyBtn = document.getElementById('heroFilterKeyBtn');
  if (heroFilterKeyBtn) {
    heroFilterKeyBtn.addEventListener('click', () => {
      playSound('click');
      state.searchQuery = 'cực trị';
      searchInput.value = 'cực trị';
      clearSearchBtn.style.display = 'block';
      renderHandbookList();
      showToast('⚡ Đã lọc ma trận công thức trọng tâm 9+');
    });
  }

  function initCyberMathCanvas() {
    const canvas = document.getElementById('mathMatrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    const glyphs = [
      '∫', '∑', 'lim', 'π', 'Δ', '∇', '∞', "f'(x)", 'dx', 'λ', 'θ', '√x',
      'e^{iπ}', 'Oxyz', 'd(M,(P))', 'V=Bh/3', 'u⃗ × v⃗', 'log_a(b)', 'sin²x'
    ];

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width || canvas.offsetWidth || 800;
      height = canvas.height = rect.height || canvas.offsetHeight || 300;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class MathParticle {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        this.x = Math.random() * (width || 800);
        this.y = init ? Math.random() * (height || 300) : (height || 300) + 15;
        this.glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        this.size = Math.random() * 10 + 11; // 11px to 21px
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.alpha = Math.random() * 0.35 + 0.12;
        this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(168, 85, 247, ';
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -25 || this.x < -25 || this.x > width + 25) {
          this.reset(false);
        }
      }
      draw() {
        ctx.save();
        ctx.font = `600 ${this.size}px "Outfit", "Space Grotesk", sans-serif`;
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowColor = 'rgba(0, 242, 254, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fillText(this.glyph, this.x, this.y);
        ctx.restore();
      }
    }

    const count = Math.min(Math.floor((width || 800) / 28), 35);
    particles = Array.from({ length: count }, () => new MathParticle());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // ==========================================
  // 12. MATH REELS (TIKTOK / DOOMSCROLL FEED ENGINE)
  // ==========================================
  const reelsFeed = document.getElementById('reelsFeed');
  const dopamineFillBar = document.getElementById('dopamineFillBar');
  const dopamineMultiplier = document.getElementById('dopamineMultiplier');
  const feverModeBanner = document.getElementById('feverModeBanner');
  const reelsChapterSelect = document.getElementById('reelsChapterSelect');
  const reelsCommentDrawer = document.getElementById('reelsCommentDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerFormulaName = document.getElementById('drawerFormulaName');
  const drawerCommentsStream = document.getElementById('drawerCommentsStream');
  const commentSubmitForm = document.getElementById('commentSubmitForm');
  const commentInputField = document.getElementById('commentInputField');

  const storyExportModal = document.getElementById('storyExportModal');
  const storyBackdrop = document.getElementById('storyBackdrop');
  const storyCloseBtn = document.getElementById('storyCloseBtn');
  const storyCardContainer = document.getElementById('storyCardContainer');
  const storySaveBtn = document.getElementById('storySaveBtn');

  // Reels Engine State
  const reelsState = {
    initialized: false,
    currentChapter: 'all',
    deck: [],
    dopamineScore: 25,
    combo: 1,
    isFever: false,
    feverTimeout: null,
    activeFormulaForDrawer: null,
    activeFormulaForStory: null,
    lofiPlaying: false,
    lofiInterval: null,
    reflexTimers: {}
  };

  // Preloaded spicy & funny Gen Z comments
  const DEFAULT_GENZ_COMMENTS = [
    { author: "Quân 2k7 (Hà Nội)", text: "Học thuộc cái này xong đi thi gặp đề Bộ vẫn ngáo ngơ 😭", time: "Vừa xong" },
    { author: "Hương Mai (Chuyên Toán)", text: "Nhớ mẹo này tiết kiệm được 2 phút câu 38 nè các bác ơi!", time: "2 phút trước" },
    { author: "Tuấn Anh (Thủ khoa hụt)", text: "Bấm Casio 5 giây ra luôn, ai rảnh đâu mà đạo hàm tay haha", time: "15 phút trước" },
    { author: "Linh Đan", text: "Đã xem lúc 2h sáng, mai thi rồi cứu con với cụ tổ ơi 🙏", time: "1 giờ trước" },
    { author: "Đức Minh", text: "Bẫy lừa này năm ngoái anh suýt rớt tốt nghiệp, lưu gấp anh em ơi!", time: "3 giờ trước" }
  ];

  function initReelsFeed() {
    if (!reelsFeed) return;

    // Populate Chapter Filter dropdown if not done
    if (reelsChapterSelect && reelsChapterSelect.options.length <= 1) {
      CHAPTERS.forEach(c => {
        if (c.id === 'all') return;
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.icon} ${c.name}`;
        reelsChapterSelect.appendChild(opt);
      });

      reelsChapterSelect.addEventListener('change', (e) => {
        playSound('click');
        reelsState.currentChapter = e.target.value;
        buildReelsDeck();
      });
    }

    if (!reelsState.initialized) {
      reelsState.initialized = true;
      buildReelsDeck();
      setupReelsInteractions();
    }
  }

  // Build Deck with Formulas + Injected Boss Cards + Reflex Challenges + Casio Tricks
  function buildReelsDeck() {
    let sourceFormulas = FORMULAS_DATA.filter(f => reelsState.currentChapter === 'all' || f.chapter === reelsState.currentChapter);
    if (sourceFormulas.length === 0) sourceFormulas = FORMULAS_DATA;

    const deck = [];

    sourceFormulas.forEach((f, idx) => {
      // 1. Standard Formula Card
      deck.push({
        type: 'formula',
        id: f.id,
        chapterName: f.chapterName,
        title: f.title,
        latex: f.latex,
        desc: f.desc,
        mnemonic: f.mnemonic,
        tier: (idx % 3 === 0) ? 'boss' : (idx % 2 === 0 ? 'adv' : 'basic'),
        likes: 1200 + Math.floor(Math.random() * 8500),
        commentsCount: 20 + Math.floor(Math.random() * 300)
      });

      // 2. Inject BOSS TRAP CARD every 4th item
      if (idx % 4 === 1) {
        deck.push(createSpecialTrapCard(idx));
      }

      // 3. Inject 5-SECOND REFLEX CHALLENGE every 4th item
      if (idx % 4 === 2) {
        deck.push(createReflexChallengeCard(f, idx));
      }

      // 4. Inject CASIO TRICK every 4th item
      if (idx % 4 === 3) {
        deck.push(createCasioTrickCard(idx));
      }
    });

    reelsState.deck = deck;
    renderReelsFeed();
  }

  function createSpecialTrapCard(idx) {
    const traps = [
      {
        id: `trap-log-${idx}`,
        chapterName: '⚡ Mũ & Logarit',
        title: '💀 BẪY TỬ THẦN: QUÊN GIÁ TRỊ TUYỆT ĐỐI',
        latex: '\\log_a(x^2) = 2\\log_a |x| \\quad (x \\neq 0)',
        wrong: '❌ 95% SĨ TỬ VIẾT: \\log_a(x^2) = 2\\log_a x ➔ SAI BÉT VÌ THIẾU TRỊ TUYỆT ĐỐI!',
        right: '✅ ĐÚNG: Số mũ chẵn hạ xuống PHẢI CÓ GIÁ TRỊ TUYỆT ĐỐI nếu x chưa biết dấu.',
        mnemonic: '💡 Khẩu quyết: "Hạ mũ chẵn đội ngay trị tuyệt đối, quên là mất điểm đại học!"',
        likes: 8920,
        commentsCount: 420
      },
      {
        id: `trap-ham-${idx}`,
        chapterName: '📈 Khảo Sát Hàm Số',
        title: '💀 BẪY BỘ GD: KẾT LUẬN KHOẢNG ĐỒNG BIẾN',
        latex: 'y = \\frac{2x-1}{x+1} \\quad ; \\quad y\' = \\frac{3}{(x+1)^2} > 0',
        wrong: '❌ GHI: "Hàm số đồng biến trên ℝ \\ {-1}" hoặc "trên (-∞; -1) VÀ (-1; +∞)" ➔ 0 ĐIỂM!',
        right: '✅ ĐÚNG: Hàm số đồng biến trên TỪNG KHOẢNG (-∞; -1) VÀ (-1; +∞) (không dùng ký hiệu hợp hoặc \\).',
        mnemonic: '💡 Mẹo nhớ: Tuyệt đối không dùng dấu ∪ hay \\ khi kết luận khoảng đơn điệu!',
        likes: 12400,
        commentsCount: 650
      },
      {
        id: `trap-oxyz-${idx}`,
        chapterName: '🌐 Tọa Độ Oxyz',
        title: '💀 BẪY OXYZ: GÓC GIỮA 2 ĐƯỜNG THẲNG VS 2 VECTƠ',
        latex: '\\cos(d_1, d_2) = \\frac{|\\vec{u_1} \\cdot \\vec{u_2}|}{|\\vec{u_1}| \\cdot |\\vec{u_2}|} \\ge 0',
        wrong: '❌ LỖI KINH ĐIỂN: Tính góc giữa 2 đường thẳng mà quên đóng dấu giá trị tuyệt đối ở tử số!',
        right: '✅ ĐÚNG: Góc giữa 2 đường thẳng luôn từ 0° đến 90° (Cos luôn ≥ 0). Còn góc 2 vectơ thì có thể tù.',
        mnemonic: '💡 Nhớ kỹ: ĐƯỜNG THẲNG CÓ TRỊ TUYỆT ĐỐI • VECTƠ THÌ KHÔNG!',
        likes: 10500,
        commentsCount: 512
      }
    ];
    const picked = traps[idx % traps.length];
    return {
      type: 'trap',
      ...picked
    };
  }

  function createCasioTrickCard(idx) {
    const casioTricks = [
      {
        id: `casio-${idx}`,
        chapterName: '🕹️ Tuyệt Kỹ Casio 580',
        title: '⚡ CASIO TABLE: TÌM CỰC TRỊ VÀ MAX/MIN TRONG 5S',
        latex: '\\text{MENU 8 (TABLE)} \\rightarrow f(x) \\rightarrow \\text{Start: } a, \\text{ End: } b, \\text{ Step: } \\frac{b-a}{29}',
        desc: 'Quét bảng giá trị tìm giá trị lớn nhất, nhỏ nhất và số nghiệm phương trình cực nhanh.',
        mnemonic: '💡 Mẹo Casio: Bấm Step = (Cuối - Đầu) / 29 hoặc 44 để chia nhỏ bước nhảy, bắt trọn điểm rơi!',
        likes: 15600,
        commentsCount: 780
      },
      {
        id: `casio-int-${idx}`,
        chapterName: '∫ Casio Tích Phân',
        title: '⚡ CASIO ĐẠO HÀM: CHỐNG NGUYÊN HÀM BẰNG PHÍM d/dx',
        latex: '\\frac{d}{dx}\\Big(F(x)\\Big)\\Bigg|_{x = 2} - f(2) = 0 \\quad (\\text{Bấm SHIFT } \\int)',
        desc: 'Thay vì tính nguyên hàm phức tạp, lấy đạo hàm của 4 đáp án tại x = 2 rồi trừ đi đề bài. Cái nào ra 0 thì khoanh!',
        mnemonic: '💡 Khẩu quyết: "Đạo hàm đáp án trừ đề bài, bằng 0 khoanh ngay không cần nghĩ!"',
        likes: 19800,
        commentsCount: 940
      }
    ];
    const picked = casioTricks[idx % casioTricks.length];
    return {
      type: 'casio',
      ...picked
    };
  }

  function createReflexChallengeCard(f, idx) {
    let qText = f.quiz ? f.quiz.q : 'Chọn công thức chính xác:';
    let optA = (f.quiz && f.quiz.options) ? f.quiz.options[0] : 'Công thức A';
    let optB = (f.quiz && f.quiz.options) ? f.quiz.options[1] : 'Công thức B';
    let correctChoice = (f.quiz && f.quiz.correct === 1) ? 'B' : 'A';

    return {
      type: 'reflex',
      id: `reflex-${f.id}-${idx}`,
      chapterName: f.chapterName,
      title: '⚡ THỬ THÁCH PHẢN XẠ 5S (5s REFLEX)',
      question: qText,
      optA,
      optB,
      correctChoice,
      likes: 9500,
      commentsCount: 380
    };
  }

  function renderReelsFeed() {
    reelsFeed.innerHTML = '';

    reelsState.deck.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `reel-card ${item.type === 'trap' ? 'trap-boss' : (item.type === 'reflex' ? 'reflex-boss' : '')}`;
      card.dataset.index = index;
      card.dataset.id = item.id;

      if (item.type === 'trap') {
        // TRAP CARD TEMPLATE
        card.innerHTML = `
          <div>
            <div class="death-trap-header">
              <span>⚠️</span>
              <span>CẢNH BÁO BẪY 9+ THPTQG</span>
            </div>
            <div class="reel-badge-row">
              <span class="reel-chapter-tag">${item.chapterName}</span>
              <span class="reel-tier-tag boss">💀 95% SAI</span>
            </div>
            <h3 class="reel-title">${item.title}</h3>
            
            <div class="reel-formula-card neon-glow">
              <div class="reel-katex-render">$$${item.latex}$$</div>
            </div>

            <div class="trap-comparison-box">
              <div class="trap-wrong">${item.wrong}</div>
              <div class="trap-right">${item.right}</div>
            </div>
          </div>

          <div class="reel-trick-box">
            <div class="reel-trick-title">🛡️ CÁCH NÉ BẪY:</div>
            <div>${item.mnemonic}</div>
          </div>

          ${renderRightActions(item)}
        `;
      } else if (item.type === 'reflex') {
        // 5-SECOND REFLEX CHALLENGE CARD TEMPLATE
        card.innerHTML = `
          <div>
            <div class="reflex-header-bar">
              <span class="reel-chapter-tag">${item.chapterName}</span>
              <span class="reflex-countdown-badge" id="countdown-${item.id}">⏱️ 5s</span>
            </div>
            
            <div class="reflex-timer-line">
              <div class="reflex-timer-progress" id="timerBar-${item.id}" style="width: 100%;"></div>
            </div>

            <h3 class="reel-title" style="color: var(--neon-cyan);">⚡ THỬ THÁCH CHỚP NHOÁNG</h3>
            <div class="reflex-question-text">${item.question}</div>

            <div class="reflex-options-grid">
              <button class="reflex-btn" data-choice="A" data-correct="${item.correctChoice}">A: ${item.optA}</button>
              <button class="reflex-btn" data-choice="B" data-correct="${item.correctChoice}">B: ${item.optB}</button>
            </div>
          </div>

          <div class="reel-trick-box" style="border-left-color: #a855f7;">
            <div class="reel-trick-title" style="color: #a855f7;">🎯 LUẬT CHƠI:</div>
            <div>Bấm đúng trong 5 giây để nhận +50 Dopamine và x2 Combo Streak!</div>
          </div>

          ${renderRightActions(item)}
        `;
      } else {
        // STANDARD FORMULA OR CASIO CARD
        card.innerHTML = `
          <div>
            <div class="reel-badge-row">
              <span class="reel-chapter-tag">${item.chapterName}</span>
              <span class="reel-tier-tag ${item.tier}">
                ${item.type === 'casio' ? '🕹️ CASIO 5S' : (item.tier === 'boss' ? '💀 9+ BOSS' : '⚡ TRỌNG TÂM')}
              </span>
            </div>
            <h3 class="reel-title">${item.title}</h3>

            <div class="reel-formula-card neon-glow">
              <div class="reel-katex-render">$$${item.latex}$$</div>
            </div>
          </div>

          <div class="reel-trick-box">
            <div class="reel-trick-title">💡 MẸO NHỚ THẦN TỐC:</div>
            <div>${item.mnemonic || item.desc || 'Học thuộc công thức để ăn điểm trắc nghiệm!'}</div>
          </div>

          ${renderRightActions(item)}
        `;
      }

      reelsFeed.appendChild(card);
    });

    renderAllMath(reelsFeed);
    setupCardObservers();
  }

  function renderRightActions(item) {
    const isBookmarked = state.bookmarkedIds.has(item.id);
    return `
      <div class="reel-actions-rail">
        <button class="action-circle-btn like-btn ${isBookmarked ? 'liked' : ''}" data-id="${item.id}" title="Thả tim lưu vào sổ tay">
          <span>❤️</span>
        </button>
        <span class="action-label-count" id="likeCount-${item.id}">${formatNumber(item.likes)}</span>

        <button class="action-circle-btn comment-btn" data-id="${item.id}" data-title="${item.title.replace(/"/g, '&quot;')}" title="Xem bình luận hội 2k7">
          <span>💬</span>
        </button>
        <span class="action-label-count">${item.commentsCount}</span>

        <button class="action-circle-btn share-story-btn" data-id="${item.id}" title="Tạo ảnh 9:16 flex lên Story">
          <span>📸</span>
        </button>
        <span class="action-label-count">Flex</span>

        <button class="action-circle-btn music-disc ${reelsState.lofiPlaying ? 'disc-spinning' : ''}" id="musicDiscBtn" title="Bật/Tắt Lofi Beats chill">
          <span>🎵</span>
        </button>
      </div>
    `;
  }

  function formatNumber(num) {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
  }

  // Double-tap heart burst & scroll observer
  function setupReelsInteractions() {
    let lastTapTime = 0;

    // Double tap on Reels Feed
    reelsFeed.addEventListener('click', (e) => {
      // Don't trigger if clicked button or interactive elements
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;

      const currentTime = new Date().getTime();
      const tapGap = currentTime - lastTapTime;

      if (tapGap < 320 && tapGap > 0) {
        // DOUBLE TAP DETECTED!
        createHeartBurst(e.clientX, e.clientY);
        const card = e.target.closest('.reel-card');
        if (card) {
          const id = card.dataset.id;
          likeReel(id, card);
        }
      }
      lastTapTime = currentTime;
    });

    // Delegated actions (Like, Comment, Story, Music, Reflex choice)
    reelsFeed.addEventListener('click', (e) => {
      const likeBtn = e.target.closest('.like-btn');
      if (likeBtn) {
        const id = likeBtn.dataset.id;
        const card = likeBtn.closest('.reel-card');
        likeReel(id, card);
        return;
      }

      const commentBtn = e.target.closest('.comment-btn');
      if (commentBtn) {
        const id = commentBtn.dataset.id;
        const title = commentBtn.dataset.title;
        openCommentDrawer(id, title);
        return;
      }

      const shareBtn = e.target.closest('.share-story-btn');
      if (shareBtn) {
        const id = shareBtn.dataset.id;
        const card = shareBtn.closest('.reel-card');
        openStoryModal(id, card);
        return;
      }

      const musicBtn = e.target.closest('#musicDiscBtn');
      if (musicBtn) {
        toggleLofiBeats();
        return;
      }

      const reflexBtn = e.target.closest('.reflex-btn');
      if (reflexBtn) {
        handleReflexAnswer(reflexBtn);
        return;
      }
    });

    // Keyboard Arrow navigation for desktop
    window.addEventListener('keydown', (e) => {
      if (state.activeTab !== 'paneReels') return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        reelsFeed.scrollBy({ top: reelsFeed.clientHeight, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        reelsFeed.scrollBy({ top: -reelsFeed.clientHeight, behavior: 'smooth' });
      }
    });
  }

  function setupCardObservers() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          addDopamine(8); // +8 Dopamine per scroll!

          // If Reflex card, start 5s countdown
          if (card.classList.contains('reflex-boss')) {
            startReflexTimer(card.dataset.id);
          }
        }
      });
    }, { root: reelsFeed, threshold: 0.6 });

    document.querySelectorAll('.reel-card').forEach(c => observer.observe(c));
  }

  // Heart particle animation
  function createHeartBurst(x, y) {
    playSound('flip');
    const heart = document.createElement('div');
    heart.className = 'heart-burst-particle';
    heart.innerHTML = '❤️';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 850);
  }

  function likeReel(id, card) {
    playSound('success');
    const likeBtn = card ? card.querySelector('.like-btn') : document.querySelector(`.like-btn[data-id="${id}"]`);
    const countEl = card ? card.querySelector(`#likeCount-${id}`) : document.getElementById(`likeCount-${id}`);

    if (!state.bookmarkedIds.has(id)) {
      state.bookmarkedIds.add(id);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKED, JSON.stringify([...state.bookmarkedIds]));
      if (likeBtn) likeBtn.classList.add('liked');
      if (countEl) {
        const cur = parseInt(countEl.textContent.replace('k', '000'), 10) || 1200;
        countEl.textContent = formatNumber(cur + 1);
      }
      addDopamine(15);
      showToast('❤️ Đã lưu công thức vào mục Yêu thích!');
    }
  }

  // Dopamine & Fever Mode System
  function addDopamine(amount) {
    const multiplier = reelsState.isFever ? 2 : 1;
    reelsState.dopamineScore = Math.min(100, reelsState.dopamineScore + (amount * multiplier));

    if (dopamineFillBar) {
      dopamineFillBar.style.width = `${reelsState.dopamineScore}%`;
    }

    if (reelsState.dopamineScore >= 100 && !reelsState.isFever) {
      triggerFeverMode();
    }
  }

  function triggerFeverMode() {
    reelsState.isFever = true;
    playSound('success');
    if (dopamineMultiplier) dopamineMultiplier.textContent = 'x2.0 🔥';
    if (feverModeBanner) feverModeBanner.classList.add('active');

    showToast('🔥 BÙNG NỔ FEVER MODE 30S: X2 XP VÀ LƯỢT THẢ TIM!');

    clearTimeout(reelsState.feverTimeout);
    reelsState.feverTimeout = setTimeout(() => {
      reelsState.isFever = false;
      reelsState.dopamineScore = 30;
      if (dopamineMultiplier) dopamineMultiplier.textContent = 'x1.0';
      if (feverModeBanner) feverModeBanner.classList.remove('active');
      if (dopamineFillBar) dopamineFillBar.style.width = '30%';
    }, 30000);
  }

  // Reflex 5-Second Challenge Logic
  function startReflexTimer(cardId) {
    if (reelsState.reflexTimers[cardId]) return; // Already running or finished

    const countdownEl = document.getElementById(`countdown-${cardId}`);
    const timerBar = document.getElementById(`timerBar-${cardId}`);
    let timeLeft = 5.0;

    reelsState.reflexTimers[cardId] = setInterval(() => {
      timeLeft -= 0.1;
      if (countdownEl) countdownEl.textContent = `⏱️ ${Math.max(0, timeLeft).toFixed(1)}s`;
      if (timerBar) timerBar.style.width = `${Math.max(0, (timeLeft / 5) * 100)}%`;

      if (timeLeft <= 0) {
        clearInterval(reelsState.reflexTimers[cardId]);
        if (countdownEl) countdownEl.textContent = 'HẾT GIỜ! 💥';
      }
    }, 100);
  }

  function handleReflexAnswer(button) {
    const choice = button.dataset.choice;
    const correct = button.dataset.correct;
    const isCorrect = (choice === correct);

    const parentGrid = button.closest('.reflex-options-grid');
    parentGrid.querySelectorAll('.reflex-btn').forEach(btn => btn.disabled = true);

    if (isCorrect) {
      button.classList.add('correct');
      playSound('success');
      addDopamine(50);
      state.quizStreak = (state.quizStreak || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.STREAK, state.quizStreak);
      showToast(`🏆 CHÍNH XÁC! +50 Dopamine • Streak: ${state.quizStreak} 🔥`);
    } else {
      button.classList.add('wrong');
      playSound('fail');
      showToast('❌ Sai rồi! Xem lại khẩu quyết ở dưới nhé.');
    }
  }

  // Web Audio Lofi Synth Player
  function toggleLofiBeats() {
    reelsState.lofiPlaying = !reelsState.lofiPlaying;
    const discBtns = document.querySelectorAll('.music-disc');
    discBtns.forEach(b => b.classList.toggle('disc-spinning', reelsState.lofiPlaying));

    if (reelsState.lofiPlaying) {
      startLofiSynth();
      showToast('🎵 Đang phát: Lofi Study Beats 2k7 (Synthwave Chill)');
    } else {
      stopLofiSynth();
      showToast('🔇 Đã tắt nhạc nền.');
    }
  }

  let lofiOsc = null;
  let lofiGain = null;

  function startLofiSynth() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const chords = [
        [349.23, 440.00, 523.25, 659.25], // Fmaj7
        [329.63, 392.00, 493.88, 587.33], // Em7
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [261.63, 329.63, 392.00, 493.88]  // Cmaj7
      ];
      let chordIndex = 0;

      function playNextChord() {
        if (!reelsState.lofiPlaying) return;
        const notes = chords[chordIndex];
        chordIndex = (chordIndex + 1) % chords.length;

        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(650, ctx.currentTime);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const now = ctx.currentTime;
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.04, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 2.8);
        });
      }

      playNextChord();
      reelsState.lofiInterval = setInterval(playNextChord, 3000);
    } catch (e) {}
  }

  function stopLofiSynth() {
    if (reelsState.lofiInterval) {
      clearInterval(reelsState.lofiInterval);
      reelsState.lofiInterval = null;
    }
  }

  // Comment Drawer Operations
  function openCommentDrawer(id, title) {
    if (!reelsCommentDrawer) return;
    reelsState.activeFormulaForDrawer = id;
    if (drawerFormulaName) drawerFormulaName.textContent = title;

    // Load comments (defaults + saved in localStorage)
    const saved = JSON.parse(localStorage.getItem(`reels_comments_${id}`) || '[]');
    const allComments = [...saved, ...DEFAULT_GENZ_COMMENTS];

    drawerCommentsStream.innerHTML = '';
    allComments.forEach(c => {
      const item = document.createElement('div');
      item.className = 'comment-bubble-item';
      item.innerHTML = `
        <div class="comment-avatar">😎</div>
        <div class="comment-content-box">
          <div class="comment-author-row">
            <span>${c.author}</span>
            <span class="comment-time">${c.time}</span>
          </div>
          <div class="comment-text">${c.text}</div>
        </div>
      `;
      drawerCommentsStream.appendChild(item);
    });

    reelsCommentDrawer.classList.add('active');
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', () => reelsCommentDrawer.classList.remove('active'));
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', () => reelsCommentDrawer.classList.remove('active'));

  if (commentSubmitForm) {
    commentSubmitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = commentInputField.value.trim();
      if (!text || !reelsState.activeFormulaForDrawer) return;

      const newC = {
        author: 'Bạn (Sĩ tử 10đ)',
        text,
        time: 'Vừa xong'
      };

      const saved = JSON.parse(localStorage.getItem(`reels_comments_${reelsState.activeFormulaForDrawer}`) || '[]');
      saved.unshift(newC);
      localStorage.setItem(`reels_comments_${reelsState.activeFormulaForDrawer}`, JSON.stringify(saved));

      commentInputField.value = '';
      openCommentDrawer(reelsState.activeFormulaForDrawer, drawerFormulaName.textContent);
      playSound('click');
      addDopamine(20);
      showToast('💬 Đã gửi bình luận!');
    });
  }

  // Flex Story 9:16 Modal
  function openStoryModal(id, card) {
    if (!storyExportModal || !card) return;
    const title = card.querySelector('.reel-title') ? card.querySelector('.reel-title').textContent : 'Toán 12 Pro';
    const katexMath = card.querySelector('.reel-katex-render') ? card.querySelector('.reel-katex-render').innerHTML : '';
    const chapterTag = card.querySelector('.reel-chapter-tag') ? card.querySelector('.reel-chapter-tag').textContent : 'Toán 12';

    storyCardContainer.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <span style="font-size: 0.75rem; font-weight: 800; color: #00f5ff; background: rgba(0,245,255,0.15); padding: 4px 10px; border-radius: 999px;">${chapterTag}</span>
          <span style="font-family: var(--font-heading); font-size: 0.8rem; font-weight: 900; color: #ff007f;">TOÁN 12 PRO</span>
        </div>
        <h2 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 900; color: #fff; line-height: 1.35; margin-bottom: 24px;">${title}</h2>
        <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(0,245,255,0.3); border-radius: 16px; padding: 20px 14px; text-align: center; margin-bottom: 20px; box-shadow: 0 0 20px rgba(0,245,255,0.2);">
          ${katexMath}
        </div>
      </div>
      <div>
        <div style="background: rgba(255,200,59,0.12); border-left: 3px solid #ffc83b; padding: 10px; border-radius: 8px; font-size: 0.78rem; color: #f8fafc; margin-bottom: 20px;">
          🔥 "Hôm nay tao đã nuốt trọn 40 công thức Toán 12 trên Math Reels. Hẹn gặp ở cổng trường Ngoại Thương!"
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #94a3b8; font-weight: 700;">
          <span>Streak: ${state.quizStreak || 1} Ngày 🔥</span>
          <span>toan12-pro.web.app</span>
        </div>
      </div>
    `;

    renderAllMath(storyCardContainer);
    storyExportModal.classList.add('active');
  }

  if (storyCloseBtn) storyCloseBtn.addEventListener('click', () => storyExportModal.classList.remove('active'));
  if (storyBackdrop) storyBackdrop.addEventListener('click', () => storyExportModal.classList.remove('active'));

  if (storySaveBtn) {
    storySaveBtn.addEventListener('click', () => {
      playSound('success');
      showToast('📸 Đã sao chép nội dung Story! Hãy chụp màn hình để đăng Instagram/TikTok.');
      storyExportModal.classList.remove('active');
    });
  }

  // ==========================================
  // 13. INITIAL BOOTSTRAP
  // ==========================================
  renderChapterChips();
  renderHandbookList();
  renderAllMath();
  initCyberMathCanvas();
});
