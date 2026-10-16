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
    }
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
    fcFrontTitle.textContent = item.title;
    fcFrontDesc.textContent = item.desc;

    // Populate Back
    fcBackChapter.textContent = item.chapterName;
    fcBackMath.innerHTML = `$$${item.latex}$$`;
    fcBackMnemonic.innerHTML = item.mnemonic ? `<strong>${item.mnemonic}</strong>` : '💡 Cố gắng luyện tập nhớ các hệ số!';

    renderAllMath(fcBackMath);
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
    explainContent.innerHTML = explanation.includes('$') ? explanation : (explanation.includes('\\') ? `$${explanation}$` : explanation);
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
  // 12. INITIAL BOOTSTRAP
  // ==========================================
  renderChapterChips();
  renderHandbookList();
  renderAllMath();
  initCyberMathCanvas();
});
