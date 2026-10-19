/**
 * TOÁN 12 PRO — APPLICATION CORE
 * Kiến trúc: app shell cố định + 5 tab (Reels · Tra cứu · Flashcard · Luyện tập · Tài khoản)
 * Phụ thuộc: data.js (CHAPTERS, FORMULAS_DATA), KaTeX, Web Audio API, localStorage
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. HẰNG SỐ & TIỆN ÍCH
     ========================================================================== */
  const KEYS = {
    MEMORIZED: 'toan12_memorized_ids',
    BOOKMARKED: 'toan12_bookmarked_ids',
    THEME: 'toan12_theme',
    SOUND: 'toan12_sound_enabled',
    STREAK: 'toan12_quiz_streak',
    BEST: 'toan12_best_streak',
    REELS_SEEN: 'toan12_reels_tip_seen',
    MUSIC: 'toan12_music',
    commentsFor: (id) => `reels_comments_${id}`
  };

  const VALID_FORMULA_IDS = new Set(FORMULAS_DATA.map((f) => f.id));
  const LETTERS = ['A', 'B', 'C', 'D'];
  const QUIZ_SECONDS = 30;
  const REFLEX_SECONDS = 10;

  const ICON = {
    bookmark:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.4s-7.7-4.7-7.7-9.8a4.4 4.4 0 0 1 7.7-3 4.4 4.4 0 0 1 7.7 3c0 5.1-7.7 9.8-7.7 9.8z"/></svg>',
    comment:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.8c0 4-3.8 7.2-8.5 7.2a10 10 0 0 1-2.6-.3L4.6 21l1.2-3.6a6.9 6.9 0 0 1-2.3-4.9c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2z"/></svg>',
    image:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3.5" width="18" height="17" rx="4"/><circle cx="8.6" cy="9.2" r="1.6"/><path d="m20.6 15.4-4.4-4.2L5.4 20.5"/></svg>',
    music:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17.5V5.2l10-1.7v12"/><circle cx="6.3" cy="17.8" r="2.7"/><circle cx="16.3" cy="15.8" r="2.7"/></svg>'
  };

  /* 5 bài nhạc nền — sinh bằng Web Audio, KHÔNG cần file mp3 nên vẫn offline,
     không bản quyền, dung lượng tăng 0 KB. Mỗi bài khác nhau thật về hợp âm,
     nhịp (step), âm sắc (osc) và độ lọc (cutoff).
     `short` là nhãn hiện dưới nút nhạc — phải ngắn để vừa thanh 44px. */
  const MUSIC_TRACKS = [
    {
      id: 'lofi',
      name: 'Lofi ôn bài',
      short: 'Lofi',
      note: 'Hợp âm ấm, chậm rãi',
      icon: '🎧',
      mode: 'chord',
      step: 3000,
      gain: 0.06,
      osc: 'triangle',
      cutoff: 700,
      voices: [
        [349.23, 440.0, 523.25, 659.25],   // F
        [329.63, 392.0, 493.88, 587.33],   // Em
        [293.66, 349.23, 440.0, 523.25],   // Dm
        [261.63, 329.63, 392.0, 493.88]    // C
      ]
    },
    {
      id: 'rain',
      name: 'Mưa qua cửa sổ',
      short: 'Mưa',
      note: 'Pad mềm + tiếng mưa',
      icon: '🌧',
      mode: 'chord',
      step: 4200,
      gain: 0.07,
      osc: 'sine',
      cutoff: 480,
      noise: { gain: 0.05, low: 1800, high: 320 },
      voices: [
        [293.66, 349.23, 440.0, 587.33],   // Dm
        [233.08, 293.66, 349.23, 466.16],  // Bb
        [174.61, 261.63, 349.23, 440.0],   // F
        [196.0, 261.63, 329.63, 392.0]     // C
      ]
    },
    {
      id: 'tap',
      name: 'Gõ nhịp bàn học',
      short: 'Nhịp',
      note: 'Nốt rải đều như bút gõ nhịp',
      icon: '🖊',
      mode: 'arp',
      step: 420,
      gain: 0.032,
      osc: 'triangle',
      cutoff: 1600,
      release: 0.5,
      pattern: [440.0, 523.25, 587.33, 523.25, 440.0, 392.0, 349.23, 392.0],
      bass: [87.31, 130.81]
    },
    {
      id: 'night',
      name: 'Đêm khuya',
      short: 'Đêm',
      note: 'Pad rất chậm, êm tai',
      icon: '🌙',
      mode: 'chord',
      step: 6000,
      gain: 0.06,
      osc: 'sine',
      cutoff: 380,
      release: 5.6,
      voices: [
        [220.0, 261.63, 329.63, 392.0],    // Am
        [174.61, 220.0, 261.63, 349.23],   // F
        [130.81, 196.0, 261.63, 329.63],   // C
        [196.0, 246.94, 293.66, 392.0]     // G
      ]
    },
    {
      id: 'chime',
      name: 'Chuông gió',
      short: 'Chuông',
      note: 'Nốt cao ngân dài, thưa',
      icon: '🎐',
      mode: 'chime',
      step: 900,
      gain: 0.045,
      osc: 'sine',
      cutoff: 2600,
      release: 2.6,
      chance: 0.42,
      pattern: [523.25, 587.33, 698.46, 783.99, 880.0, 1046.5]
    }
  ];

  const escHtml = (value) =>
    String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

  const escAttr = escHtml;

  /** Bỏ tiền tố "💡 Mẹo nhớ:" / "Khẩu quyết:" khỏi dữ liệu để không lặp tiêu đề. */
  function stripMnemonicPrefix(text) {
    if (!text) return '';
    return String(text)
      .replace(/^\s*💡\s*/u, '')
      .replace(/^(mẹo nhớ|khẩu quyết|mẹo casio|mẹo|nhớ kỹ|ghi nhớ)\s*[:\-–]\s*/iu, '')
      .trim();
  }

  const formatNumber = (num) => (num >= 1000 ? `${(num / 1000).toFixed(1)}k` : String(num));

  /** "8.9k" -> 8900 ; "128" -> 128 */
  function parseCount(text) {
    const value = String(text == null ? '' : text).trim().toLowerCase();
    if (!value) return 0;
    const num = parseFloat(value.replace(',', '.'));
    if (Number.isNaN(num)) return 0;
    return Math.round(value.endsWith('k') ? num * 1000 : num);
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  const readSet = (key) => new Set(readJSON(key, []));
  const writeSet = (key, set) => localStorage.setItem(key, JSON.stringify([...set]));

  /* ==========================================================================
     2. STATE
     ========================================================================== */
  const state = {
    activeTab: 'paneReels',
    // Tra cứu
    selectedChapter: 'all',
    statusFilter: 'all',
    searchQuery: '',
    memorizedIds: readSet(KEYS.MEMORIZED),
    bookmarkedIds: readSet(KEYS.BOOKMARKED),
    // Giao diện
    theme: localStorage.getItem(KEYS.THEME) || 'dark',
    soundEnabled: localStorage.getItem(KEYS.SOUND) !== 'false',
    // Flashcard
    fcReady: false,
    fcIndex: 0,
    fcItems: [],
    // Quiz
    quizReady: false,
    quizList: [],
    quizIndex: 0,
    quizScore: 0,
    quizAnswered: false,
    streak: parseInt(localStorage.getItem(KEYS.STREAK) || '0', 10) || 0,
    bestStreak: parseInt(localStorage.getItem(KEYS.BEST) || '0', 10) || 0
  };

  /* Nhạc nền — chỉ nhớ bài + âm lượng, KHÔNG tự phát khi mở trang
     (trình duyệt chặn autoplay khi chưa có thao tác của người dùng). */
  const savedMusic = readJSON(KEYS.MUSIC, {}) || {};
  const musicState = {
    on: false,
    trackId: MUSIC_TRACKS.some((t) => t.id === savedMusic.trackId) ? savedMusic.trackId : MUSIC_TRACKS[0].id,
    volume: typeof savedMusic.volume === 'number' ? Math.min(1, Math.max(0, savedMusic.volume)) : 0.6,
    timer: null,
    master: null,
    noise: null,
    tick: 0,
    resumeAfterHidden: false
  };
  const musicTrack = () => MUSIC_TRACKS.find((t) => t.id === musicState.trackId) || MUSIC_TRACKS[0];
  const saveMusic = () => {
    try {
      localStorage.setItem(KEYS.MUSIC, JSON.stringify({ trackId: musicState.trackId, volume: musicState.volume }));
    } catch (err) { /* chế độ riêng tư: bỏ qua */ }
  };

  const $ = (id) => document.getElementById(id);

  /* ==========================================================================
     3. ÂM THANH (Web Audio — không cần file mp3)
     ========================================================================== */
  let audioCtx = null;
  function getAudioContext() {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    if (!audioCtx) audioCtx = new Ctor();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const tone = (freq, start, dur, wave, peak) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(Math.min(peak, 0.001), now + start);
        gain.gain.linearRampToValueAtTime(peak, now + start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + start + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.02);
      };

      if (type === 'click') tone(660, 0, 0.06, 'sine', 0.06);
      else if (type === 'flip') tone(420, 0, 0.11, 'triangle', 0.09);
      else if (type === 'success') [523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.06, 0.24, 'sine', 0.09));
      else if (type === 'fail') {
        tone(300, 0, 0.16, 'sawtooth', 0.07);
        tone(200, 0.1, 0.2, 'sawtooth', 0.06);
      }
    } catch (err) {
      /* Bỏ qua: audio là tính năng phụ */
    }
  }

  /* ==========================================================================
     4. TOAST
     ========================================================================== */
  const toastBox = $('toastBox');
  let toastTimer = null;

  function showToast(message) {
    if (!toastBox) return;
    toastBox.textContent = message;
    toastBox.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastBox.classList.remove('show'), 2400);
  }

  /* ==========================================================================
     5. KATEX
     ========================================================================== */
  const mathRendered = new WeakSet();
  const supportsZoom = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('zoom', '0.5');

  /**
   * Đưa công thức về vừa bề rộng khung.
   * - Thu nhỏ (zoom) nếu chỉ cần giảm nhẹ (>= 0.8) để vẫn đọc được.
   * - Nếu vẫn quá dài: đánh dấu `.is-scrollable` để hiện chỉ báo cuộn ngang.
   * Đọc trước – ghi sau để hạn chế reflow.
   */
  function fitFormulas(root) {
    const scope = root || document;
    if (!scope.querySelectorAll) return;

    const plan = [];
    scope.querySelectorAll('.formula-box, .math-block, .story-formula').forEach((box) => {
      const display = box.querySelector('.katex-display');
      if (!display) return;
      if (!box.clientWidth) return; // tab đang ẩn: giữ nguyên trạng thái cũ
      display.style.zoom = '';
      box.classList.remove('is-scrollable');
      plan.push({ box, display });
    });

    const measured = plan.map((entry) => {
      const cs = getComputedStyle(entry.box);
      const avail = entry.box.clientWidth
        - (parseFloat(cs.paddingLeft) || 0)
        - (parseFloat(cs.paddingRight) || 0);
      const inner = entry.display.querySelector('.katex') || entry.display;
      return Object.assign(entry, { avail, natural: inner.getBoundingClientRect().width });
    });

    measured.forEach(({ box, display, avail, natural }) => {
      if (!avail || !natural || natural <= avail + 1) return;
      const scale = avail / natural;
      if (supportsZoom && scale >= 0.8) display.style.zoom = scale.toFixed(3);
      else box.classList.add('is-scrollable');
    });
  }

  /** @returns {boolean} true nếu KaTeX đã thực sự xử lý phần tử này */
  function renderMath(el, force) {
    const target = el || document.body;
    if (!force && mathRendered.has(target)) return true;
    if (!window.renderMathInElement) return false; // CDN chưa sẵn sàng — sẽ thử lại
    try {
      window.renderMathInElement(target, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false,
        ignoredClasses: ['katex', 'no-math']
      });
      mathRendered.add(target);
    } catch (err) {
      /* throwOnError:false đã lo phần lớn trường hợp */
    }
    fitFormulas(target);
    return true;
  }

  // Nếu CDN KaTeX bị chặn/offline, thử lại vài nhịp rồi thôi.
  let mathRetries = 0;
  (function ensureMathLib() {
    if (window.renderMathInElement || mathRetries >= 12) return;
    mathRetries += 1;
    setTimeout(() => {
      if (window.renderMathInElement) renderMath(document.body, true);
      else ensureMathLib();
    }, 250);
  })();

  /* ==========================================================================
     6. GIAO DIỆN: THEME & ÂM THANH
     ========================================================================== */
  const themeToggleBtn = $('themeToggleBtn');
  const soundToggleBtn = $('soundToggleBtn');
  const body = document.body;

  function applyTheme(theme) {
    state.theme = theme === 'light' ? 'light' : 'dark';
    body.dataset.theme = state.theme;
    localStorage.setItem(KEYS.THEME, state.theme);
    if (themeToggleBtn) themeToggleBtn.setAttribute('aria-checked', String(state.theme === 'dark'));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', state.theme === 'dark' ? '#0B0F19' : '#F5F7FB');
  }

  function applySound(enabled) {
    state.soundEnabled = !!enabled;
    localStorage.setItem(KEYS.SOUND, String(state.soundEnabled));
    if (soundToggleBtn) soundToggleBtn.setAttribute('aria-checked', String(state.soundEnabled));
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      playSound('click');
      showToast(state.theme === 'dark' ? 'Đã bật giao diện tối' : 'Đã bật giao diện sáng');
    });
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      applySound(!state.soundEnabled);
      playSound('click');
      showToast(state.soundEnabled ? 'Đã bật âm thanh' : 'Đã tắt âm thanh');
    });
  }

  /* ==========================================================================
     7. ĐIỀU HƯỚNG TAB
     ========================================================================== */
  const bottomNav = $('bottomNav');
  const tabPanes = Array.from(document.querySelectorAll('.tab-pane'));

  function switchTab(tabId, options) {
    const opts = options || {};
    if (!opts.silent) playSound('click');

    state.activeTab = tabId;
    body.dataset.tab = tabId;

    tabPanes.forEach((pane) => pane.classList.toggle('active', pane.id === tabId));

    if (bottomNav) {
      bottomNav.querySelectorAll('.nav-item').forEach((btn) => {
        const isActive = btn.dataset.tab === tabId;
        btn.classList.toggle('active', isActive);
        if (isActive) btn.setAttribute('aria-current', 'page');
        else btn.removeAttribute('aria-current');
      });
    }

    const pane = $(tabId);
    if (pane) {
      pane.scrollTop = 0;
      fitFormulas(pane);
    }

    if (tabId === 'paneReels') initReels();
    else if (tabId === 'paneFlashcard') initFlashcards();
    else if (tabId === 'paneQuiz') initQuiz();
    else if (tabId === 'paneAccount') updateProgress();
  }

  if (bottomNav) {
    bottomNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-item');
      if (btn && btn.dataset.tab) switchTab(btn.dataset.tab);
    });
  }

  const brandHomeBtn = $('brandHomeBtn');
  if (brandHomeBtn) brandHomeBtn.addEventListener('click', () => switchTab('paneReels'));

  /* ==========================================================================
     8. TAB TRA CỨU
     ========================================================================== */
  const formulaList = $('formulaList');
  const emptyState = $('emptyState');
  const chapterChips = $('chapterChips');
  const searchInput = $('searchInput');
  const clearSearchBtn = $('clearSearchBtn');

  function renderChapterChips() {
    if (!chapterChips) return;
    chapterChips.innerHTML = CHAPTERS.map((chap) => {
      const count = chap.id === 'all'
        ? FORMULAS_DATA.length
        : FORMULAS_DATA.filter((f) => f.chapter === chap.id).length;
      return `<button class="chip${state.selectedChapter === chap.id ? ' active' : ''}" type="button" role="tab"
                data-chapter="${chap.id}" aria-selected="${state.selectedChapter === chap.id}">
                <span aria-hidden="true">${chap.icon}</span><span>${escHtml(chap.name)}</span>
                <span class="chip__count">${count}</span>
              </button>`;
    }).join('');
  }

  if (chapterChips) {
    chapterChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state.selectedChapter = chip.dataset.chapter;
      playSound('click');
      renderChapterChips();
      renderHandbook();
    });
  }

  function getFilteredFormulas() {
    const query = state.searchQuery;
    return FORMULAS_DATA.filter((item) => {
      if (state.selectedChapter !== 'all' && item.chapter !== state.selectedChapter) return false;

      if (state.statusFilter === 'memorized' && !state.memorizedIds.has(item.id)) return false;
      if (state.statusFilter === 'unmemorized' && state.memorizedIds.has(item.id)) return false;
      if (state.statusFilter === 'bookmarked' && !state.bookmarkedIds.has(item.id)) return false;

      if (!query) return true;
      const haystack = [item.title, item.desc, item.chapterName, item.mnemonic, item.variables]
        .filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }

  function renderHandbook() {
    if (!formulaList) return;
    const items = getFilteredFormulas();
    updateProgress();

    if (!items.length) {
      formulaList.innerHTML = '';
      if (emptyState) emptyState.hidden = false;
      return;
    }
    if (emptyState) emptyState.hidden = true;

    formulaList.innerHTML = items.map((item) => {
      const memorized = state.memorizedIds.has(item.id);
      const bookmarked = state.bookmarkedIds.has(item.id);
      const mnemonic = stripMnemonicPrefix(item.mnemonic);

      return `
        <article class="formula-card" id="card-${item.id}">
          <header class="formula-card__head">
            <span class="badge badge--chapter">${escHtml(item.chapterName)}</span>
            <button class="icon-btn icon-btn--sm save-toggle${bookmarked ? ' is-active' : ''}" type="button"
                    data-action="bookmark" data-id="${item.id}" aria-pressed="${bookmarked}"
                    aria-label="Lưu công thức vào danh sách yêu thích">${ICON.bookmark}</button>
          </header>

          <h3 class="formula-card__title">${item.title}</h3>

          <div class="formula-box"><div class="math-render">$$${item.latex}$$</div></div>

          ${item.desc ? `<p class="formula-card__desc">${item.desc}</p>` : ''}
          ${item.variables ? `<p class="formula-card__vars">${item.variables}</p>` : ''}

          ${mnemonic ? `
            <div class="callout callout--info">
              <span class="callout-label">💡 Mẹo nhớ nhanh:</span>
              <p>${mnemonic}</p>
            </div>` : ''}

          <footer class="formula-card__foot">
            <button class="btn btn--sm ${memorized ? 'btn--success-ghost' : 'btn--ghost'}" type="button"
                    data-action="memorize" data-id="${item.id}">
              ${memorized ? 'Đã thuộc' : 'Chưa thuộc'}
            </button>
            <button class="btn btn--sm btn--ghost" type="button"
                    data-action="copy" data-latex="${encodeURIComponent(item.latex)}">Sao chép LaTeX</button>
          </footer>
        </article>`;
    }).join('');

    renderMath(formulaList, true);
  }

  if (formulaList) {
    formulaList.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const { action, id } = btn.dataset;

      if (action === 'memorize') {
        if (state.memorizedIds.has(id)) {
          state.memorizedIds.delete(id);
          playSound('click');
          showToast('Đã chuyển về: Chưa thuộc');
        } else {
          state.memorizedIds.add(id);
          playSound('success');
          showToast('Đã ghi nhận: Đã thuộc công thức này');
        }
        writeSet(KEYS.MEMORIZED, state.memorizedIds);
        renderHandbook();
      } else if (action === 'bookmark') {
        if (state.bookmarkedIds.has(id)) {
          state.bookmarkedIds.delete(id);
          showToast('Đã bỏ lưu');
        } else {
          state.bookmarkedIds.add(id);
          playSound('success');
          showToast('Đã lưu vào danh sách yêu thích');
        }
        writeSet(KEYS.BOOKMARKED, state.bookmarkedIds);
        renderHandbook();
      } else if (action === 'copy') {
        copyToClipboard(decodeURIComponent(btn.dataset.latex), 'Đã sao chép mã LaTeX');
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) clearSearchBtn.hidden = !state.searchQuery;
      renderHandbook();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      clearSearchBtn.hidden = true;
      searchInput.focus();
      renderHandbook();
    });
  }

  document.querySelectorAll('.filter-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.statusFilter = btn.dataset.filter;
      playSound('click');
      document.querySelectorAll('.filter-chip').forEach((b) => b.classList.toggle('active', b === btn));
      renderHandbook();
    });
  });

  const resetFilterBtn = $('resetFilterBtn');
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      state.selectedChapter = 'all';
      state.statusFilter = 'all';
      state.searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.hidden = true;
      document.querySelectorAll('.filter-chip').forEach((b) => b.classList.toggle('active', b.dataset.filter === 'all'));
      renderChapterChips();
      renderHandbook();
    });
  }

  /* ------------------------------- Clipboard ------------------------------ */
  function copyToClipboard(text, successMsg) {
    const done = () => { playSound('click'); showToast(successMsg); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) { playSound('click'); showToast(successMsg); }
      else showToast('Không sao chép được, hãy chọn thủ công');
    } catch (err) {
      showToast('Không sao chép được');
    }
  }

  /* ==========================================================================
     9. TIẾN ĐỘ / THỐNG KÊ
     ========================================================================== */
  function rankFor(percent) {
    if (percent >= 100) return 'Bậc thầy công thức';
    if (percent >= 80) return 'Đại sư';
    if (percent >= 50) return 'Cao thủ';
    if (percent >= 20) return 'Chiến binh';
    if (percent > 0) return 'Tập sự';
    return 'Tân binh';
  }

  function updateProgress() {
    const total = FORMULAS_DATA.length;
    const memorized = state.memorizedIds.size;
    const bookmarked = state.bookmarkedIds.size;
    const percent = total ? Math.round((memorized / total) * 100) : 0;

    const setText = (id, value) => { const el = $(id); if (el) el.textContent = value; };

    setText('countAll', total);
    setText('countMemorized', memorized);
    setText('countUnmemorized', Math.max(0, total - memorized));
    setText('countBookmarked', bookmarked);

    setText('accountTotal', total);
    setText('accountMemorized', memorized);
    setText('accountBookmarked', bookmarked);
    setText('accountStreak', state.bestStreak);
    setText('quizStreakCount', state.streak);
    setText('accountProgressText', `${percent}%`);
    setText('accountRank', rankFor(percent));

    const note = $('accountProgressNote');
    if (note) {
      note.textContent = percent === 0
        ? 'Bắt đầu luyện tập để mở khoá tiến độ.'
        : `Còn ${Math.max(0, total - memorized)} công thức chưa thuộc. Giữ nhịp mỗi ngày nhé!`;
    }

    const bar = $('accountProgressBar');
    if (bar) bar.style.width = `${percent}%`;

    // Chip trên header = chuỗi đang có (tụt về 0 khi trả lời sai)
    document.querySelectorAll('.js-streak').forEach((el) => { el.textContent = state.streak; });
  }

  function bumpStreak() {
    state.streak += 1;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    localStorage.setItem(KEYS.STREAK, String(state.streak));
    localStorage.setItem(KEYS.BEST, String(state.bestStreak));
    updateProgress();
  }

  function resetStreak() {
    state.streak = 0;
    localStorage.setItem(KEYS.STREAK, '0');
    updateProgress();
  }

  /* ==========================================================================
     10. TAB FLASHCARD
     ========================================================================== */
  const flashcardEl = $('flashcardElement');
  const fcChapterSelect = $('fcChapterSelect');

  if (fcChapterSelect) {
    CHAPTERS.forEach((chap) => {
      if (chap.id === 'all') return;
      const opt = document.createElement('option');
      opt.value = chap.id;
      opt.textContent = `${chap.icon} ${chap.name}`;
      fcChapterSelect.appendChild(opt);
    });

    fcChapterSelect.addEventListener('change', (e) => {
      playSound('click');
      loadFlashcards(e.target.value);
    });
  }

  function initFlashcards() {
    if (state.fcReady) return;
    state.fcReady = true;
    loadFlashcards(fcChapterSelect ? fcChapterSelect.value : 'all');
  }

  function loadFlashcards(chapterId) {
    state.fcItems = FORMULAS_DATA.filter((f) => chapterId === 'all' || f.chapter === chapterId);
    state.fcIndex = 0;
    updateFlashcard();
  }

  function updateFlashcard() {
    if (!state.fcItems.length || !flashcardEl) return;
    const item = state.fcItems[state.fcIndex];

    const setText = (id, value) => { const el = $(id); if (el) el.textContent = value; };
    setText('fcCurrentIndex', state.fcIndex + 1);
    setText('fcTotalCount', state.fcItems.length);

    const fill = $('fcProgressFill');
    if (fill) fill.style.width = `${((state.fcIndex + 1) / state.fcItems.length) * 100}%`;

    flashcardEl.classList.remove('flipped');

    setText('fcFrontChapter', item.chapterName);
    setText('fcBackChapter', item.chapterName);

    const title = $('fcFrontTitle');
    if (title) title.innerHTML = item.title;
    const desc = $('fcFrontDesc');
    if (desc) desc.innerHTML = item.desc;

    const math = $('fcBackMath');
    if (math) math.innerHTML = `$$${item.latex}$$`;

    const mnemonic = $('fcBackMnemonic');
    if (mnemonic) {
      const text = stripMnemonicPrefix(item.mnemonic);
      mnemonic.innerHTML = text
        ? `<span class="callout-label">💡 Mẹo nhớ nhanh:</span><p>${text}</p>`
        : '<span class="callout-label">💡 Gợi ý</span><p>Tự nhẩm lại các hệ số trước khi lật thẻ.</p>';
    }

    renderMath(flashcardEl, true);
  }

  let swiping = false;

  function flipFlashcard() {
    if (swiping || !flashcardEl) return;
    playSound('flip');
    flashcardEl.classList.toggle('flipped');
  }

  function nextFlashcard() {
    if (state.fcIndex < state.fcItems.length - 1) {
      playSound('click');
      state.fcIndex += 1;
      updateFlashcard();
    } else {
      showToast('Đã xem hết thẻ của chương này');
    }
  }

  function prevFlashcard() {
    if (state.fcIndex > 0) {
      playSound('click');
      state.fcIndex -= 1;
      updateFlashcard();
    }
  }

  if (flashcardEl) {
    flashcardEl.addEventListener('click', flipFlashcard);

    const KEY_SPACE = ' ';
    flashcardEl.addEventListener('keydown', (e) => {
      if (e.key === KEY_SPACE || e.key === 'Enter') {
        e.preventDefault();
        flipFlashcard();
      }
    });

    let startX = 0;
    let startY = 0;

    flashcardEl.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
    }, { passive: true });

    flashcardEl.addEventListener('touchend', (e) => {
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        swiping = true;
        if (dx < 0) nextFlashcard();
        else prevFlashcard();
        setTimeout(() => { swiping = false; }, 280);
      }
    }, { passive: true });
  }

  const fcPrevBtn = $('fcPrevBtn');
  const fcNextBtn = $('fcNextBtn');
  const fcFailBtn = $('fcFailBtn');
  const fcPassBtn = $('fcPassBtn');
  if (fcPrevBtn) fcPrevBtn.addEventListener('click', prevFlashcard);
  if (fcNextBtn) fcNextBtn.addEventListener('click', nextFlashcard);

  function markFlashcard(memorized) {
    const item = state.fcItems[state.fcIndex];
    if (!item) return;
    if (memorized) {
      state.memorizedIds.add(item.id);
      playSound('success');
      showToast('Đã đánh dấu: Đã thuộc');
    } else {
      state.memorizedIds.delete(item.id);
      playSound('fail');
      showToast('Sẽ ôn lại thẻ này');
    }
    writeSet(KEYS.MEMORIZED, state.memorizedIds);
    updateProgress();
    nextFlashcard();
  }
  if (fcPassBtn) fcPassBtn.addEventListener('click', () => markFlashcard(true));
  if (fcFailBtn) fcFailBtn.addEventListener('click', () => markFlashcard(false));

  /* ==========================================================================
     11. TAB LUYỆN TẬP
     ========================================================================== */
  const quizOptionsContainer = $('quizOptionsContainer');
  const quizQuestionText = $('quizQuestionText');
  const quizChapterTag = $('quizChapterTag');
  const quizIndexText = $('quizIndexText');
  const quizExplainBox = $('quizExplainBox');
  const explainContent = $('explainContent');
  const quizTimer = $('quizTimer');
  const quizTimerBar = $('quizTimerBar');
  let quizTimerId = null;

  function stopQuizTimer() {
    if (quizTimerId) {
      clearInterval(quizTimerId);
      quizTimerId = null;
    }
  }

  function startQuizTimer(onTimeout) {
    stopQuizTimer();
    const total = QUIZ_SECONDS * 1000;
    let left = total;

    if (quizTimer) quizTimer.classList.remove('is-urgent', 'is-done');
    if (quizTimerBar) quizTimerBar.style.width = '100%';

    quizTimerId = setInterval(() => {
      left -= 100;
      const percent = Math.max(0, (left / total) * 100);
      if (quizTimerBar) quizTimerBar.style.width = `${percent}%`;
      if (quizTimer) quizTimer.classList.toggle('is-urgent', percent <= 35);
      if (left <= 0) {
        stopQuizTimer();
        if (quizTimer) quizTimer.classList.add('is-done');
        onTimeout();
      }
    }, 100);
  }

  function initQuiz() {
    if (state.quizReady) return;
    state.quizReady = true;
    newQuizRound();
  }

  function newQuizRound() {
    state.quizList = FORMULAS_DATA.filter((f) => f.quiz && f.quiz.options && f.quiz.options.length >= 2);
    // Fisher–Yates: trộn đều hơn sort(random) và không lệ thuộc engine sort
    for (let i = state.quizList.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.quizList[i], state.quizList[j]] = [state.quizList[j], state.quizList[i]];
    }
    state.quizIndex = 0;
    state.quizScore = 0;
    const scoreEl = $('quizScoreCount');
    if (scoreEl) scoreEl.textContent = '0';
    renderQuizQuestion();
  }

  function formatQuizOption(opt) {
    if (!opt) return '';
    if (opt.includes('$')) return opt;
    const hasVietnamese = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i.test(opt);
    if (hasVietnamese && !opt.includes('\\text{')) return escHtml(opt);
    return `$${opt}$`;
  }

  function renderQuizQuestion() {
    if (!state.quizList.length) return;
    state.quizAnswered = false;
    if (quizExplainBox) quizExplainBox.hidden = true;

    const item = state.quizList[state.quizIndex];
    const quiz = item.quiz;

    if (quizChapterTag) quizChapterTag.textContent = item.chapterName;
    if (quizIndexText) quizIndexText.textContent = `Câu ${state.quizIndex + 1}/${state.quizList.length}`;

    const fill = $('quizProgressFill');
    if (fill) fill.style.width = `${((state.quizIndex + 1) / state.quizList.length) * 100}%`;

    if (quizQuestionText) {
      const q = quiz.q || '';
      // Đề bài là văn xuôi trộn công thức nội tuyến ($...$) và có thể chứa dấu <>
      // (ví dụ "|q| < 1"), nên đặt bằng textContent để trình duyệt không hiểu
      // nhầm thành thẻ HTML rồi nuốt mất chữ.
      quizQuestionText.textContent = q.includes('$') || !q.includes('\\') ? q : `$${q}$`;
    }

    if (quizOptionsContainer) {
      quizOptionsContainer.innerHTML = quiz.options.map((opt, idx) => `
        <button class="option-btn" type="button" data-index="${idx}">
          <span class="option-key">${LETTERS[idx] || idx + 1}</span>
          <span class="option-text">${formatQuizOption(opt)}</span>
        </button>`).join('');
    }

    // Phải render CẢ ĐỀ BÀI, không chỉ mỗi khối đáp án. Nếu bỏ sót bước này thì
    // đề bài hiện ra thô dạng "$y = \sqrt{2x+1}$" trong khi A/B/C/D đã đẹp.
    if (quizQuestionText) renderMath(quizQuestionText, true);
    if (quizOptionsContainer) renderMath(quizOptionsContainer, true);
    startQuizTimer(handleQuizTimeout);
  }

  function revealQuizAnswer(chosenIndex, correctIndex, explanation) {
    if (quizOptionsContainer) {
      quizOptionsContainer.querySelectorAll('.option-btn').forEach((btn) => {
        const idx = Number(btn.dataset.index);
        btn.disabled = true;
        if (idx === correctIndex) btn.classList.add('is-correct');
        else if (idx === chosenIndex) btn.classList.add('is-wrong');
        else btn.classList.add('is-dim');
      });
    }

    if (explainContent) explainContent.innerHTML = explanation || 'Xem lại công thức tương ứng trong sổ tay.';
    if (quizExplainBox) quizExplainBox.hidden = false;
    renderMath(quizExplainBox, true);
  }

  function handleQuizAnswer(button) {
    if (state.quizAnswered) return;
    state.quizAnswered = true;
    stopQuizTimer();

    const item = state.quizList[state.quizIndex];
    const chosen = Number(button.dataset.index);
    const correct = item.quiz.correct;

    if (chosen === correct) {
      playSound('success');
      state.quizScore += 10;
      bumpStreak();
      const scoreEl = $('quizScoreCount');
      if (scoreEl) scoreEl.textContent = state.quizScore;
      showToast('Chính xác! +10 điểm');
    } else {
      playSound('fail');
      resetStreak();
      showToast('Chưa đúng — xem lời giải bên dưới');
    }

    revealQuizAnswer(chosen, correct, item.quiz.explain);
  }

  function handleQuizTimeout() {
    if (state.quizAnswered) return;
    state.quizAnswered = true;
    const item = state.quizList[state.quizIndex];
    playSound('fail');
    resetStreak();
    showToast(`Hết ${QUIZ_SECONDS} giây!`);
    revealQuizAnswer(-1, item.quiz.correct, item.quiz.explain);
  }

  if (quizOptionsContainer) {
    quizOptionsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.option-btn');
      if (btn) handleQuizAnswer(btn);
    });
  }

  const quizNextBtn = $('quizNextBtn');
  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', () => {
      playSound('click');
      if (state.quizIndex < state.quizList.length - 1) {
        state.quizIndex += 1;
        renderQuizQuestion();
      } else {
        showToast(`Hoàn thành! Tổng điểm: ${state.quizScore}`);
        newQuizRound();
      }
    });
  }

  const quizRestartBtn = $('quizRestartBtn');
  if (quizRestartBtn) {
    quizRestartBtn.addEventListener('click', () => {
      playSound('click');
      newQuizRound();
      showToast('Đã tạo đề luyện tập mới');
    });
  }

  /* ==========================================================================
     12. TAB REELS
     ========================================================================== */
  const reelsFeed = $('reelsFeed');
  const reelsChapterSelect = $('reelsChapterSelect');
  const reelsHint = $('reelsHint');

  const reelsState = {
    ready: false,
    chapter: 'all',
    deck: [],
    reflexTimers: Object.create(null),
    activeFormula: null,
    activeTitle: ''
  };

  const TRAP_CARDS = [
    {
      id: 'trap-log',
      chapter: 'mu-logarit',
      chapterName: 'Mũ & Logarit',
      title: 'Hạ số mũ chẵn mà quên trị tuyệt đối',
      latex: '\\log_a(x^2) = 2\\log_a |x| \\quad (x \\neq 0)',
      trap: '$\\log_a(x^2) = 2\\log_a x$',
      fix: 'Số mũ chẵn khi hạ xuống phải kèm dấu giá trị tuyệt đối nếu chưa biết dấu của $x$.',
      mnemonic: 'Hạ mũ chẵn thì đội ngay trị tuyệt đối.'
    },
    {
      id: 'trap-monotonic',
      chapter: 'ham-so',
      chapterName: 'Khảo sát hàm số',
      title: 'Kết luận khoảng đơn điệu bằng ký hiệu hợp',
      latex: 'y = \\frac{2x-1}{x+1} \\quad ; \\quad y\' = \\frac{3}{(x+1)^2} > 0',
      trap: 'Hàm số đồng biến trên $\\mathbb{R} \\setminus \\{-1\\}$ hoặc trên $(-\\infty;-1) \\cup (-1;+\\infty)$',
      fix: 'Phải kết luận trên <b>từng khoảng</b>: đồng biến trên $(-\\infty;-1)$ và trên $(-1;+\\infty)$.',
      mnemonic: 'Khoảng đơn điệu thì nối bằng chữ "và", tuyệt đối không dùng dấu hợp.'
    },
    {
      id: 'trap-oxyz-angle',
      chapter: 'oxyz',
      chapterName: 'Tọa độ Oxyz',
      title: 'Góc giữa hai đường thẳng mà quên trị tuyệt đối',
      latex: '\\cos(d_1, d_2) = \\frac{|\\vec{u_1} \\cdot \\vec{u_2}|}{|\\vec{u_1}| \\cdot |\\vec{u_2}|} \\ge 0',
      trap: 'Bỏ dấu giá trị tuyệt đối ở tử số khi tính góc giữa hai đường thẳng.',
      fix: 'Góc giữa hai đường thẳng luôn trong $[0^\\circ; 90^\\circ]$ nên cosin luôn không âm. Góc giữa hai vectơ thì có thể tù.',
      mnemonic: 'Đường thẳng có trị tuyệt đối, vectơ thì không.'
    }
  ];

  const CASIO_CARDS = [
    {
      id: 'casio-table',
      chapterName: 'Tuyệt kỹ Casio',
      title: 'Bảng giá trị TABLE để quét cực trị và max–min',
      latex: '\\text{MENU 8 (TABLE)} \\rightarrow f(x) \\rightarrow \\text{Start } a,\\ \\text{End } b,\\ \\text{Step } \\frac{b-a}{29}',
      desc: 'Quét nhanh bảng giá trị để tìm giá trị lớn nhất, nhỏ nhất và số nghiệm phương trình.',
      mnemonic: 'Chọn Step = (Cuối − Đầu) ÷ 29 để bắt trọn điểm rơi.'
    },
    {
      id: 'casio-derivative',
      chapterName: 'Tuyệt kỹ Casio',
      title: 'Chống nguyên hàm bằng phím đạo hàm',
      latex: '\\frac{d}{dx}\\Big(F(x)\\Big)\\Big|_{x=x_0} - f(x_0) = 0',
      desc: 'Lấy đạo hàm của từng đáp án tại $x_0$ rồi trừ đi đề bài. Đáp án nào cho kết quả 0 là đáp án đúng.',
      mnemonic: 'Đạo hàm đáp án trừ đề bài, bằng 0 thì khoanh ngay.'
    }
  ];

  function initReels() {
    if (reelsState.ready) {
      // Card chưa kịp render công thức (ví dụ KaTeX vừa tải xong) sẽ được
      // IntersectionObserver xử lý khi quay lại tab.
      return;
    }
    reelsState.ready = true;

    if (reelsChapterSelect && reelsChapterSelect.options.length <= 1) {
      CHAPTERS.forEach((chap) => {
        if (chap.id === 'all') return;
        const opt = document.createElement('option');
        opt.value = chap.id;
        opt.textContent = `${chap.icon} ${chap.name}`;
        reelsChapterSelect.appendChild(opt);
      });

      reelsChapterSelect.addEventListener('change', (e) => {
        playSound('click');
        reelsState.chapter = e.target.value;
        buildReelsDeck();
      });
    }

    if (localStorage.getItem(KEYS.REELS_SEEN) === '1' && reelsHint) reelsHint.classList.add('is-hidden');

    buildReelsDeck();
    bindReelsInteractions();
  }

  function makeDeckItem(type, data) {
    return Object.assign({
      type,
      likes: 800 + Math.floor(Math.random() * 9200),
      commentsCount: 40 + Math.floor(Math.random() * 320)
    }, data);
  }

  function buildReelsDeck() {
    const source = FORMULAS_DATA.filter((f) => reelsState.chapter === 'all' || f.chapter === reelsState.chapter);
    const formulas = source.length ? source : FORMULAS_DATA;
    const deck = [];

    formulas.forEach((f, idx) => {
      deck.push(makeDeckItem('formula', {
        id: f.id,
        chapterName: f.chapterName,
        title: f.title,
        latex: f.latex,
        desc: f.desc,
        mnemonic: f.mnemonic
      }));

      // Bẫy: chỉ chèn card cùng chuyên đề với bài đang xem
      if (idx % 4 === 1) {
        const matching = TRAP_CARDS.filter((t) => t.chapter === f.chapter);
        const candidates = matching.length
          ? matching
          : (reelsState.chapter === 'all' ? TRAP_CARDS : []);
        if (candidates.length) {
          const trap = candidates[Math.floor(idx / 4) % candidates.length];
          deck.push(makeDeckItem('trap', Object.assign({}, trap, {
            id: `${trap.id}-${idx}`,
            likes: 9000 + Math.floor(Math.random() * 6000)
          })));
        }
      }

      if (idx % 4 === 2 && f.quiz && f.quiz.options && f.quiz.options.length >= 2) {
        deck.push(makeDeckItem('reflex', {
          id: `reflex-${f.id}`,
          chapterName: f.chapterName,
          title: f.title,
          question: f.quiz.q,
          options: f.quiz.options.slice(0, 4),
          correct: f.quiz.correct,
          explain: f.quiz.explain
        }));
      }

      if (idx % 4 === 3) {
        const casio = CASIO_CARDS[Math.floor(idx / 4) % CASIO_CARDS.length];
        deck.push(makeDeckItem('casio', Object.assign({}, casio, { id: `${casio.id}-${idx}` })));
      }
    });

    // Dọn interval của bộ bài cũ trước khi dựng bộ mới (tránh rò rỉ timer)
    Object.keys(reelsState.reflexTimers).forEach((key) => {
      const timer = reelsState.reflexTimers[key];
      if (typeof timer === 'number') clearInterval(timer);
    });

    reelsState.deck = deck;
    reelsState.reflexTimers = Object.create(null);
    renderReels();
  }

  function railHtml(item) {
    const isReal = VALID_FORMULA_IDS.has(item.id);
    const saved = isReal && state.bookmarkedIds.has(item.id);
    return `
      <div class="reel-rail">
        <button class="rail-btn js-save${saved ? ' is-active' : ''}" type="button" data-id="${item.id}"
                aria-pressed="${saved}" aria-label="Thích và lưu công thức">
          <span class="rail-btn__circle">${ICON.bookmark}</span>
          <span class="rail-count" data-count="${item.id}">${formatNumber(item.likes)}</span>
        </button>

        <button class="rail-btn js-comment" type="button" data-id="${item.id}"
                data-title="${escAttr(item.title)}" aria-label="Xem thảo luận">
          <span class="rail-btn__circle">${ICON.comment}</span>
          <span class="rail-count">${item.commentsCount}</span>
        </button>

        <button class="rail-btn js-share" type="button" data-id="${item.id}" aria-label="Chia sẻ công thức">
          <span class="rail-btn__circle">${ICON.image}</span>
          <span class="rail-count">Chia sẻ</span>
        </button>

        <button class="rail-btn js-music${musicState.on ? ' is-playing' : ''}" type="button" aria-label="Chọn nhạc nền">
          <span class="rail-btn__circle">${ICON.music}</span>
          <span class="rail-count">${musicState.on ? musicTrack().short : 'Nhạc'}</span>
        </button>
      </div>`;
  }

  function mnemonicCallout(text) {
    const clean = stripMnemonicPrefix(text);
    if (!clean) return '';
    return `
      <div class="callout callout--info">
        <span class="callout-label">💡 Mẹo nhớ nhanh:</span>
        <p>${clean}</p>
      </div>`;
  }

  function buildFormulaBody(item) {
    return `
      <div class="reel-head">
        <span class="badge badge--chapter">Toán 12</span>
        <span class="badge badge--tier">${escHtml(item.chapterName)}</span>
      </div>

      <h2 class="reel-title">${item.title}</h2>

      <div class="formula-box"><div class="math-render">$$${item.latex}$$</div></div>

      ${item.desc ? `<p class="reel-desc">${item.desc}</p>` : ''}
      ${mnemonicCallout(item.mnemonic)}`;
  }

  function buildTrapBody(item) {
    return `
      <div class="reel-head">
        <span class="badge badge--chapter">Toán 12</span>
        <span class="badge badge--tier badge--tier-warn">Bẫy thường gặp</span>
      </div>

      <h2 class="reel-title">${item.title}</h2>

      <div class="formula-box"><div class="math-render">$$${item.latex}$$</div></div>

      <div class="callout callout--danger">
        <span class="callout-label">✕ Cách làm sai</span>
        <p>${item.trap}</p>
      </div>

      <div class="callout callout--success">
        <span class="callout-label">✓ Cách làm đúng</span>
        <p>${item.fix}</p>
      </div>

      ${mnemonicCallout(item.mnemonic)}`;
  }

  function buildCasioBody(item) {
    return `
      <div class="reel-head">
        <span class="badge badge--chapter">Toán 12</span>
        <span class="badge badge--tier badge--tier-accent">Mẹo máy tính</span>
      </div>

      <h2 class="reel-title">${item.title}</h2>

      <div class="formula-box"><div class="math-render">$$${item.latex}$$</div></div>

      ${item.desc ? `<p class="reel-desc">${item.desc}</p>` : ''}
      ${mnemonicCallout(item.mnemonic)}`;
  }

  function buildReflexBody(item) {
    return `
      <div class="reel-head">
        <span class="badge badge--chapter">Toán 12</span>
        <span class="badge badge--tier badge--tier-accent">Thử thách ${REFLEX_SECONDS}s</span>
      </div>

      <div class="reflex">
        <div class="timer"><span class="timer__fill" data-reflex-bar="${item.id}"></span></div>
        <span class="reflex-count" data-reflex-count="${item.id}">${REFLEX_SECONDS}.0s</span>

        <p class="reflex-q">${item.question}</p>

        <div class="option-list">
          ${item.options.map((opt, idx) => `
            <button class="option-btn" type="button" data-reflex-answer="${idx}" data-correct="${item.correct}">
              <span class="option-key">${LETTERS[idx] || idx + 1}</span>
              <span class="option-text">${formatQuizOption(opt)}</span>
            </button>`).join('')}
        </div>

        <div class="callout callout--success" data-reflex-explain="${item.id}" hidden>
          <span class="callout-label">Giải thích</span>
          <p>${item.explain || 'Xem lại công thức trong sổ tay để nắm chắc dạng này.'}</p>
        </div>
      </div>`;
  }

  function renderReels() {
    if (!reelsFeed) return;

    reelsFeed.innerHTML = reelsState.deck.map((item) => {
      let body;
      if (item.type === 'trap') body = buildTrapBody(item);
      else if (item.type === 'casio') body = buildCasioBody(item);
      else if (item.type === 'reflex') body = buildReflexBody(item);
      else body = buildFormulaBody(item);

      return `<article class="reel-card" data-id="${item.id}" data-type="${item.type}">
                <div class="reel-scroll">${body}</div>
                ${railHtml(item)}
              </article>`;
    }).join('');

    // Render sẵn vài card đầu: tránh thoáng thấy LaTeX thô khi vừa mở app
    Array.from(reelsFeed.querySelectorAll('.reel-card')).slice(0, 2).forEach((card) => {
      if (!mathRendered.has(card) && renderMath(card)) mathRendered.add(card);
    });

    observeReelCards();
  }

  let reelsObserver = null;

  function observeReelCards() {
    if (!('IntersectionObserver' in window) || !reelsFeed) {
      renderMath(reelsFeed, true);
      return;
    }

    if (reelsObserver) reelsObserver.disconnect();

    reelsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;

        // Render KaTeX theo nhu cầu (tiết kiệm CPU trên mobile)
        if (!mathRendered.has(card) && renderMath(card)) mathRendered.add(card);

        if (card.dataset.type === 'reflex') startReflexTimer(card.dataset.id);
      });
    }, { root: reelsFeed, threshold: 0.55 });

    reelsFeed.querySelectorAll('.reel-card').forEach((card) => reelsObserver.observe(card));
  }

  /* ------------------------------- Reflex -------------------------------- */
  function startReflexTimer(cardId) {
    if (reelsState.reflexTimers[cardId]) return;
    const bar = reelsFeed.querySelector(`[data-reflex-bar="${cardId}"]`);
    const count = reelsFeed.querySelector(`[data-reflex-count="${cardId}"]`);
    if (!bar) return;

    let left = REFLEX_SECONDS * 10;

    reelsState.reflexTimers[cardId] = setInterval(() => {
      left -= 1;
      const seconds = Math.max(0, left / 10);
      if (count) count.textContent = `${seconds.toFixed(1)}s`;
      bar.style.width = `${(left / (REFLEX_SECONDS * 10)) * 100}%`;

      if (left <= 0) {
        clearInterval(reelsState.reflexTimers[cardId]);
        reelsState.reflexTimers[cardId] = true;
        if (count) count.textContent = 'Hết giờ';
        revealReflex(cardId, -1);
      }
    }, 100);
  }

  function revealReflex(cardId, chosenIndex) {
    const card = reelsFeed.querySelector(`.reel-card[data-id="${cardId}"]`);
    if (!card) return;

    card.querySelectorAll('[data-reflex-answer]').forEach((btn) => {
      const idx = Number(btn.dataset.reflexAnswer);
      const correct = Number(btn.dataset.correct);
      btn.disabled = true;
      if (idx === correct) btn.classList.add('is-correct');
      else if (idx === chosenIndex) btn.classList.add('is-wrong');
      else btn.classList.add('is-dim');
    });

    const explain = card.querySelector(`[data-reflex-explain="${cardId}"]`);
    if (explain) {
      explain.hidden = false;
      renderMath(explain, true);
    }
  }

  function answerReflex(button) {
    const card = button.closest('.reel-card');
    if (!card) return;
    const cardId = card.dataset.id;

    if (reelsState.reflexTimers[cardId] && reelsState.reflexTimers[cardId] !== true) {
      clearInterval(reelsState.reflexTimers[cardId]);
    }
    reelsState.reflexTimers[cardId] = true;

    const chosen = Number(button.dataset.reflexAnswer);
    const correct = Number(button.dataset.correct);

    if (chosen === correct) {
      playSound('success');
      bumpStreak();
      showToast('Chính xác!');
    } else {
      playSound('fail');
      resetStreak();
      showToast('Chưa đúng, xem giải thích nhé');
    }

    revealReflex(cardId, chosen);
  }

  /* ------------------------------ Rail actions --------------------------- */
  function toggleSave(id, button) {
    const countEl = reelsFeed.querySelector(`[data-count="${id}"]`);
    const isReal = VALID_FORMULA_IDS.has(id);

    if (!isReal) {
      playSound('success');
      showToast('Đã thích công thức này');
      return;
    }

    const current = countEl ? parseCount(countEl.textContent) : 0;

    if (state.bookmarkedIds.has(id)) {
      state.bookmarkedIds.delete(id);
      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');
      if (countEl) countEl.textContent = formatNumber(Math.max(0, current - 1));
      playSound('click');
      showToast('Đã bỏ lưu');
    } else {
      state.bookmarkedIds.add(id);
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
      playSound('success');
      showToast('Đã lưu vào sổ tay');
      if (countEl) countEl.textContent = formatNumber(current + 1);
    }
    writeSet(KEYS.BOOKMARKED, state.bookmarkedIds);
    updateProgress();
  }

  function createHeartBurst(x, y) {
    playSound('flip');
    const heart = document.createElement('span');
    heart.className = 'heart-burst';
    heart.textContent = '❤️';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 900);
  }

  function bindReelsInteractions() {
    if (!reelsFeed) return;

    let lastTap = 0;

    reelsFeed.addEventListener('click', (e) => {
      const reflexBtn = e.target.closest('[data-reflex-answer]');
      if (reflexBtn && !reflexBtn.disabled) { answerReflex(reflexBtn); return; }

      const saveBtn = e.target.closest('.js-save');
      if (saveBtn) { toggleSave(saveBtn.dataset.id, saveBtn); return; }

      const commentBtn = e.target.closest('.js-comment');
      if (commentBtn) { openComments(commentBtn.dataset.id, commentBtn.dataset.title); return; }

      const shareBtn = e.target.closest('.js-share');
      if (shareBtn) { openStory(shareBtn.dataset.id); return; }

      if (e.target.closest('.js-music')) { openMusic(); return; }

      // Double-tap để lưu (bỏ qua khi bấm vào phần tử tương tác)
      if (e.target.closest('button, a, input, select')) return;
      const now = Date.now();
      if (now - lastTap < 320) {
        createHeartBurst(e.clientX, e.clientY);
        const card = e.target.closest('.reel-card');
        if (card) {
          const saveBtnInCard = card.querySelector('.js-save');
          if (saveBtnInCard && !saveBtnInCard.classList.contains('is-active')) toggleSave(card.dataset.id, saveBtnInCard);
        }
        lastTap = 0;
        return;
      }
      lastTap = now;
    });

    reelsFeed.addEventListener('scroll', () => {
      if (!reelsHint || reelsHint.classList.contains('is-hidden')) return;
      reelsHint.classList.add('is-hidden');
      localStorage.setItem(KEYS.REELS_SEEN, '1');
    }, { passive: true, once: true });

    window.addEventListener('keydown', (e) => {
      if (state.activeTab !== 'paneReels') return;
      if (e.target.closest('input, select, textarea')) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        reelsFeed.scrollBy({ top: reelsFeed.clientHeight, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        reelsFeed.scrollBy({ top: -reelsFeed.clientHeight, behavior: 'smooth' });
      }
    });
  }

  /* -------------------------------- Nhạc nền -----------------------------
     Engine sinh nhạc bằng Web Audio. Chọn bài trong sheet "Nhạc nền",
     hoặc từ Cài đặt ở tab Tôi. */
  const musicDrawer = $('musicDrawer');
  const musicList = $('musicList');
  const musicToggleBtn = $('musicToggleBtn');
  const musicVolumeInput = $('musicVolume');
  const musicVolumeValue = $('musicVolumeValue');
  const musicSettingDesc = $('musicSettingDesc');
  const musicCloseBtn = $('musicCloseBtn');
  const musicBackdrop = $('musicBackdrop');
  const openMusicBtn = $('openMusicBtn');

  /** Một nốt: sóng -> lowpass -> vuốt lên rồi tắt dần. */
  function musicNote(ctx, dest, freq, opts) {
    const when = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = opts.cutoff;
    osc.type = opts.osc;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(opts.gain, when + opts.attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + opts.attack + opts.release);

    osc.connect(filter).connect(gain).connect(dest);
    osc.start(when);
    osc.stop(when + opts.attack + opts.release + 0.06);
  }

  /** Lớp nền "mưa": nhiễu trắng lọc qua highpass + lowpass. */
  function startNoiseBed(ctx, dest, spec) {
    const len = Math.floor(ctx.sampleRate * 2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const high = ctx.createBiquadFilter();
    high.type = 'highpass';
    high.frequency.value = spec.high;

    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.value = spec.low;

    const gain = ctx.createGain();
    gain.gain.value = spec.gain;

    src.connect(high).connect(low).connect(gain).connect(dest);
    src.start();
    return src;
  }

  /** Phả một "nhịp" của bài đang chọn. */
  function musicStep(ctx, dest) {
    const t = musicTrack();
    const attack = t.attack == null ? 0.35 : t.attack;
    const release = t.release == null ? (t.step / 1000) * 0.95 : t.release;
    const base = { cutoff: t.cutoff, osc: t.osc, gain: t.gain, attack, release };

    if (t.mode === 'chord') {
      const notes = t.voices[musicState.tick % t.voices.length];
      musicState.tick += 1;
      notes.forEach((freq) => musicNote(ctx, dest, freq, base));
      return;
    }

    if (t.mode === 'arp') {
      const i = musicState.tick;
      musicState.tick += 1;
      musicNote(ctx, dest, t.pattern[i % t.pattern.length], base);
      if (i % t.pattern.length === 0) {
        musicNote(ctx, dest, t.bass[(i / t.pattern.length) % t.bass.length], {
          cutoff: 320, osc: t.osc, gain: t.gain * 1.7, attack: 0.05, release: 2.4
        });
      }
      return;
    }

    // chime: thưa và ngẫu nhiên — có nhịp không có tiếng nào
    musicState.tick += 1;
    if (Math.random() > t.chance) return;
    musicNote(ctx, dest, t.pattern[Math.floor(Math.random() * t.pattern.length)], {
      cutoff: t.cutoff, osc: t.osc, gain: t.gain, attack: 0.02, release
    });
  }

  /** Dọn phiên đang phát: ngắt timer, lớp mưa và master (có vuốt tắt 0.25s). */
  function killMusicNodes() {
    if (musicState.timer) {
      clearInterval(musicState.timer);
      musicState.timer = null;
    }
    if (musicState.noise) {
      const bed = musicState.noise;
      musicState.noise = null;
      try { bed.stop(); } catch (err) { /* noop */ }
      try { bed.disconnect(); } catch (err) { /* noop */ }
    }
    if (musicState.master) {
      const node = musicState.master;
      musicState.master = null;
      try {
        const now = node.context.currentTime;
        node.gain.cancelScheduledValues(now);
        node.gain.setValueAtTime(node.gain.value, now);
        node.gain.linearRampToValueAtTime(0.0001, now + 0.25);
      } catch (err) { /* noop */ }
      setTimeout(() => { try { node.disconnect(); } catch (err) { /* noop */ } }, 500);
    }
  }

  function startMusic() {
    const ctx = getAudioContext();
    if (!ctx) { musicState.on = false; syncMusicUi(); return; }

    // Đổi bài giữa chừng: dọn phiên cũ trước, nếu không hai bài sẽ chồng tiếng.
    killMusicNodes();

    const t = musicTrack();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.linearRampToValueAtTime(musicState.volume, ctx.currentTime + 1.2);
    master.connect(ctx.destination);
    musicState.master = master;
    musicState.tick = 0;
    if (t.noise) musicState.noise = startNoiseBed(ctx, master, t.noise);

    musicState.on = true;
    musicStep(ctx, master);
    musicState.timer = setInterval(() => {
      if (!musicState.on) return;
      musicStep(ctx, master);
    }, t.step);

    syncMusicUi();
  }

  function stopMusic() {
    musicState.on = false;
    killMusicNodes();
    syncMusicUi();
  }

  function toggleMusic() {
    if (musicState.on) {
      stopMusic();
      showToast('Đã tạm dừng nhạc nền');
      return;
    }
    startMusic();
    if (musicState.on) showToast(`Đang phát: ${musicTrack().name}`);
  }

  function selectMusic(id) {
    if (!MUSIC_TRACKS.some((t) => t.id === id)) return;
    playSound('click');
    musicState.trackId = id;
    saveMusic();
    startMusic();
    syncMusicUi();
  }

  function setMusicVolume(value) {
    musicState.volume = Math.min(1, Math.max(0, value));
    saveMusic();
    if (musicState.master) {
      try {
        musicState.master.gain.setTargetAtTime(musicState.volume, musicState.master.context.currentTime, 0.08);
      } catch (err) { /* noop */ }
    }
    syncMusicUi();
  }

  function renderMusicList() {
    if (!musicList) return;
    musicList.innerHTML = MUSIC_TRACKS.map((t) => {
      const active = t.id === musicState.trackId;
      const playing = active && musicState.on;
      return `
        <button class="music-item${active ? ' is-active' : ''}" type="button" data-track="${t.id}"
                aria-pressed="${playing}">
          <span class="music-item__icon" aria-hidden="true">${t.icon}</span>
          <span class="music-item__text">
            <span class="music-item__name">${escHtml(t.name)}</span>
            <span class="music-item__note">${escHtml(t.note)}</span>
          </span>
          <span class="music-item__wave${playing ? ' is-on' : ''}" aria-hidden="true"><i></i><i></i><i></i></span>
        </button>`;
    }).join('');
  }

  /** Đồng bộ mọi nơi hiển thị trạng thái nhạc (không render lại danh sách,
      để kéo thanh âm lượng không bị mất tay). */
  function syncMusicUi() {
    const t = musicTrack();

    document.querySelectorAll('.js-music').forEach((btn) => {
      btn.classList.toggle('is-playing', musicState.on);
      btn.setAttribute('aria-label', musicState.on
        ? `Nhạc nền đang phát: ${t.name}. Bấm để đổi bài`
        : 'Chọn nhạc nền');
      const label = btn.querySelector('.rail-count');
      if (label) label.textContent = musicState.on ? t.short : 'Nhạc';
    });

    if (musicList) {
      musicList.querySelectorAll('.music-item').forEach((item) => {
        const active = item.dataset.track === musicState.trackId;
        const playing = active && musicState.on;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(playing));
        const wave = item.querySelector('.music-item__wave');
        if (wave) wave.classList.toggle('is-on', playing);
      });
    }

    if (musicToggleBtn) musicToggleBtn.textContent = musicState.on ? 'Tạm dừng nhạc' : 'Phát nhạc';
    if (musicVolumeValue) musicVolumeValue.textContent = `${Math.round(musicState.volume * 100)}%`;
    if (musicSettingDesc) {
      musicSettingDesc.textContent = musicState.on
        ? `Đang phát: ${t.name}`
        : `Đang chọn: ${t.name} · đang tắt`;
    }
  }

  function openMusic() {
    playSound('click');
    renderMusicList();
    syncMusicUi();
    openOverlay(musicDrawer);
  }

  if (musicVolumeInput) musicVolumeInput.value = String(Math.round(musicState.volume * 100));
  if (musicList) {
    musicList.addEventListener('click', (e) => {
      const item = e.target.closest('.music-item');
      if (item) selectMusic(item.dataset.track);
    });
  }
  if (musicToggleBtn) musicToggleBtn.addEventListener('click', () => { playSound('click'); toggleMusic(); });
  if (musicVolumeInput) musicVolumeInput.addEventListener('input', (e) => setMusicVolume(Number(e.target.value) / 100));
  if (musicCloseBtn) musicCloseBtn.addEventListener('click', () => { playSound('click'); closeOverlay(musicDrawer); });
  if (musicBackdrop) musicBackdrop.addEventListener('click', () => closeOverlay(musicDrawer));
  if (openMusicBtn) openMusicBtn.addEventListener('click', openMusic);

  // Tab bị ẩn thì ngắt nhạc cho khỏi tốn pin; quay lại thì phát tiếp.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (musicState.on) { musicState.resumeAfterHidden = true; stopMusic(); }
    } else if (musicState.resumeAfterHidden) {
      musicState.resumeAfterHidden = false;
      startMusic();
    }
  });

  /* ==========================================================================
     13. OVERLAY (SHEET / MODAL)
     ========================================================================== */
  function openOverlay(el) {
    if (!el) return;
    el.hidden = false;
    void el.offsetHeight; // ép reflow đồng bộ: không phụ thuộc requestAnimationFrame (có thể bị treo ở tab nền)
    el.classList.add('active');
  }

  function closeOverlay(el) {
    if (!el) return;
    el.classList.remove('active');
    setTimeout(() => { el.hidden = true; }, 300);
  }

  /* ==========================================================================
     14. BÌNH LUẬN
     ========================================================================== */
  const drawer = $('reelsCommentDrawer');
  const drawerStream = $('drawerCommentsStream');
  const drawerTitle = $('drawerFormulaName');
  const commentForm = $('commentSubmitForm');
  const commentInput = $('commentInputField');

  const SEED_COMMENTS = [
    { author: 'Quân 2k7', text: 'Học thuộc cái này xong gặp đề Bộ vẫn phải đọc kỹ đề đấy anh em.', time: 'Vừa xong' },
    { author: 'Hương Mai', text: 'Mẹo này tiết kiệm được kha khá thời gian ở câu vận dụng.', time: '2 phút trước' },
    { author: 'Tuấn Anh', text: 'Mình vẫn khoanh bằng máy tính cho chắc, nhưng phải hiểu bản chất đã.', time: '15 phút trước' },
    { author: 'Linh Đan', text: 'Xem lúc 2h sáng, mai kiểm tra 15 phút. Lưu lại cái đã.', time: '1 giờ trước' },
    { author: 'Đức Minh', text: 'Bẫy này năm ngoái mình mất điểm, giờ nhớ đời luôn.', time: '3 giờ trước' }
  ];

  function renderComments(id) {
    if (!drawerStream) return;
    const mine = readJSON(KEYS.commentsFor(id), []);

    const card = (c, isMine) => `
      <div class="comment${isMine ? ' comment--mine' : ''}">
        <span class="comment__avatar" aria-hidden="true">${isMine ? '🙋' : '🎓'}</span>
        <div class="comment__body">
          <div class="comment__meta">
            <span class="comment__author">${escHtml(c.author)}</span>
            <span class="comment__time">${escHtml(c.time)}</span>
          </div>
          <p class="comment__text">${escHtml(c.text)}</p>
        </div>
      </div>`;

    drawerStream.innerHTML = [
      ...mine.map((c) => card(c, true)),
      ...SEED_COMMENTS.map((c) => card(c, false))
    ].join('');
  }

  function openComments(id, title) {
    reelsState.activeFormula = id;
    reelsState.activeTitle = title || 'Công thức';
    if (drawerTitle) drawerTitle.textContent = reelsState.activeTitle;
    renderComments(id);
    openOverlay(drawer);
  }

  const drawerCloseBtn = $('drawerCloseBtn');
  const drawerBackdrop = $('drawerBackdrop');
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', () => { playSound('click'); closeOverlay(drawer); });
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', () => closeOverlay(drawer));

  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!commentInput) return;

      const text = commentInput.value.trim();
      if (!text || !reelsState.activeFormula) return;

      const list = readJSON(KEYS.commentsFor(reelsState.activeFormula), []);
      list.unshift({ author: 'Bạn', text, time: 'Vừa xong' });
      localStorage.setItem(KEYS.commentsFor(reelsState.activeFormula), JSON.stringify(list.slice(0, 50)));

      commentInput.value = '';
      commentInput.blur();
      renderComments(reelsState.activeFormula);
      playSound('click');
      showToast('Đã gửi bình luận');
    });
  }

  /* ==========================================================================
     15. CHIA SẺ STORY 9:16
     ========================================================================== */
  const storyModal = $('storyExportModal');
  const storyCanvas = $('storyCardContainer');

  function openStory(id) {
    const card = reelsFeed.querySelector(`.reel-card[data-id="${id}"]`);
    if (!card || !storyCanvas) return;

    // Bảo đảm công thức đã được KaTeX render trước khi sao chép sang card story.
    renderMath(card);

    const title = card.querySelector('.reel-title');
    const chapter = card.querySelector('.badge--chapter');
    const formulaBox = card.querySelector('.formula-box .math-render');
    const callout = card.querySelector('.callout.callout--info p');

    storyCanvas.innerHTML = `
      <div>
        <div class="story-topline">
          <span class="badge badge--chapter">${escHtml(chapter ? chapter.textContent : 'Toán 12')}</span>
          <span class="story-brand">TOÁN 12 PRO</span>
        </div>
        <h3 class="story-title" style="margin-top:14px">${escHtml(title ? title.textContent : 'Công thức Toán 12')}</h3>
        <div class="story-formula" style="margin-top:14px">${formulaBox ? formulaBox.innerHTML : ''}</div>
      </div>

      <div>
        ${callout ? `<p class="story-quote">💡 ${escHtml(callout.textContent)}</p>` : ''}
        <div class="story-foot" style="margin-top:14px">
          <span>Chuỗi tốt nhất: ${state.bestStreak}</span>
          <span>toan12pro</span>
        </div>
      </div>`;

    // Đã render KaTeX sẵn trong card nên chỉ cần copy node, không render lại.
    openOverlay(storyModal);
  }

  const storyCloseBtn = $('storyCloseBtn');
  const storyBackdrop = $('storyBackdrop');
  const storySaveBtn = $('storySaveBtn');
  if (storyCloseBtn) storyCloseBtn.addEventListener('click', () => { playSound('click'); closeOverlay(storyModal); });
  if (storyBackdrop) storyBackdrop.addEventListener('click', () => closeOverlay(storyModal));
  if (storySaveBtn) {
    storySaveBtn.addEventListener('click', () => {
      playSound('success');
      showToast('Dùng nút chụp màn hình của điện thoại để lưu ảnh này');
    });
  }

  /* ==========================================================================
     16. TÀI KHOẢN: XUẤT / XOÁ DỮ LIỆU
     ========================================================================== */
  const exportDataBtn = $('exportDataBtn');
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', () => {
      const backup = {
        app: 'TOAN12PRO',
        exportedAt: new Date().toISOString(),
        memorized: [...state.memorizedIds],
        bookmarked: [...state.bookmarkedIds],
        streak: state.streak,
        bestStreak: state.bestStreak
      };
      try {
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `toan12-tien-do-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        playSound('success');
        showToast('Đã tải tệp sao lưu');
      } catch (err) {
        showToast('Không xuất được tệp trên trình duyệt này');
      }
    });
  }

  const resetAllDataBtn = $('resetAllDataBtn');
  if (resetAllDataBtn) {
    resetAllDataBtn.addEventListener('click', () => {
      if (!window.confirm('Xóa toàn bộ tiến độ đã thuộc, danh sách đã lưu và chuỗi đúng?')) return;

      state.memorizedIds.clear();
      state.bookmarkedIds.clear();
      state.streak = 0;
      state.bestStreak = 0;
      localStorage.removeItem(KEYS.MEMORIZED);
      localStorage.removeItem(KEYS.BOOKMARKED);
      localStorage.removeItem(KEYS.STREAK);
      localStorage.removeItem(KEYS.BEST);

      playSound('click');
      renderHandbook();
      updateProgress();
      showToast('Đã xóa toàn bộ tiến độ');
    });
  }

  const copyGitCmdBtn = $('copyGitCmdBtn');
  const gitCommandBlock = $('gitCommandBlock');
  if (copyGitCmdBtn && gitCommandBlock) {
    copyGitCmdBtn.addEventListener('click', () => {
      copyToClipboard(gitCommandBlock.textContent.trim(), 'Đã sao chép các lệnh Git');
    });
  }

  /* ==========================================================================
     17. PHÍM TẮT TOÀN CỤC
     ========================================================================== */
  window.addEventListener('keydown', (e) => {
    if (e.target.closest('input, select, textarea')) return;

    if (state.activeTab === 'paneFlashcard') {
      if (e.key === 'ArrowRight') { e.preventDefault(); nextFlashcard(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prevFlashcard(); }
    }

    if (e.key === 'Escape') {
      if (drawer && !drawer.hidden) closeOverlay(drawer);
      if (storyModal && !storyModal.hidden) closeOverlay(storyModal);
    }
  });

  /* ==========================================================================
     18. FIT LẠI CÔNG THỨC KHI ĐỔI KÍCH THƯỚC / XOAY MÁY / FONT TẢI XONG
     ========================================================================== */
  let refitTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(refitTimer);
    refitTimer = setTimeout(() => {
      const pane = $(state.activeTab);
      if (pane) fitFormulas(pane);
    }, 200);
  });

  window.addEventListener('orientationchange', () => {
    const pane = $(state.activeTab);
    if (pane) fitFormulas(pane);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(() => {
        const pane = $(state.activeTab);
        if (pane) fitFormulas(pane);
      })
      .catch(() => {});
  }

  /* ==========================================================================
     19. KHỞI ĐỘNG
     ========================================================================== */
  applyTheme(state.theme);
  applySound(state.soundEnabled);
  renderChapterChips();
  renderHandbook();
  updateProgress();
  switchTab('paneReels', { silent: true });
  syncMusicUi();
});
