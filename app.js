// app.js - Engine UKK LiveCode Simulator (Vertical Multi-line & Auto-Indent)

(function () {
  "use strict";

  // State
  let currentModuleIndex = 0;
  let currentModule = null;
  let targetCode = "";
  let currentIndex = 0;
  let errorsCount = 0;
  let totalKeystrokes = 0;
  let startTime = null;
  let timerInterval = null;
  let soundEnabled = true;
  let currentMode = "ghost-full"; // ghost-full, ghost-fade, hint-only, blind-test

  // DOM Elements
  const moduleSelect = document.getElementById("moduleSelect");
  const modeSelect = document.getElementById("modeSelect");
  const soundToggle = document.getElementById("soundToggle");
  const soundIcon = document.getElementById("soundIcon");
  const soundText = document.getElementById("soundText");
  const resetBtn = document.getElementById("resetBtn");

  const statWpm = document.getElementById("statWpm");
  const statAccuracy = document.getElementById("statAccuracy");
  const statLine = document.getElementById("statLine");
  const statErrors = document.getElementById("statErrors");
  const progressBar = document.getElementById("progressBar");
  const statPercent = document.getElementById("statPercent");

  const moduleBadge = document.getElementById("moduleBadge");
  const currentModeLabel = document.getElementById("currentModeLabel");
  const editorWrapper = document.getElementById("editorWrapper");
  const lineNumbersEl = document.getElementById("lineNumbers");
  const codeCanvas = document.getElementById("codeCanvas");
  const caret = document.getElementById("caret");
  const hiddenInput = document.getElementById("hiddenInput");

  // Tabs & Assistant
  const sidebarTabs = document.querySelectorAll(".sidebar-tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const currentLineDesc = document.getElementById("currentLineDesc");
  const teacherAnswerBox = document.getElementById("teacherAnswerBox");
  const previewIframe = document.getElementById("previewIframe");
  const fullCodeBlock = document.getElementById("fullCodeBlock");
  const copyCodeBtn = document.getElementById("copyCodeBtn");
  const customTitleInput = document.getElementById("customTitleInput");
  const customCodeTextarea = document.getElementById("customCodeTextarea");
  const loadCustomBtn = document.getElementById("loadCustomBtn");

  // Modal
  const successModal = document.getElementById("successModal");
  const modalWpm = document.getElementById("modalWpm");
  const modalAccuracy = document.getElementById("modalAccuracy");
  const modalErrors = document.getElementById("modalErrors");
  const modalNextBtn = document.getElementById("modalNextBtn");
  const modalRetryBtn = document.getElementById("modalRetryBtn");

  // Audio Context (Synthesized Mechanical Keyboard & Cues)
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playKeyClickSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(360 + Math.random() * 80, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, audioCtx.currentTime + 0.04);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
      filter.Q.setValueAtTime(3, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.045);
    } catch (e) {}
  }

  function playErrorSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  function playSuccessSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.26);
      });
    } catch (e) {}
  }

  // Populate Modules in Dropdown
  function initModuleSelect() {
    moduleSelect.innerHTML = "";
    LESSON_MODULES.forEach((mod, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = `${mod.title} [${mod.badge}]`;
      moduleSelect.appendChild(opt);
    });
  }

  // Character mapping and lines
  let charSpans = [];
  let lineStarts = []; // index in targetCode where each line begins

  function loadModule(idx) {
    currentModuleIndex = idx;
    currentModule = LESSON_MODULES[idx];
    targetCode = currentModule.code.replace(/\r\n/g, "\n");
    currentIndex = 0;
    errorsCount = 0;
    totalKeystrokes = 0;
    startTime = null;
    if (timerInterval) clearInterval(timerInterval);

    moduleBadge.textContent = `${currentModule.category} • ${currentModule.badge}`;
    fullCodeBlock.textContent = targetCode;

    renderEditor();
    updateLivePreview();
    updateStats();

    // Check auto-indent for line 1 if any
    checkAndSkipAutoIndent();

    updateTeacherExplanation(1);
    focusEditor();
  }

  // Render Editor DOM with Real Vertical Lines
  function renderEditor() {
    codeCanvas.innerHTML = "";
    lineNumbersEl.innerHTML = "";
    charSpans = [];
    lineStarts = [];

    // Re-attach Caret
    codeCanvas.appendChild(caret);

    const lines = targetCode.split("\n");
    let globalCharIndex = 0;

    lines.forEach((lineText, lineIdx) => {
      const lineNum = lineIdx + 1;
      lineStarts.push(globalCharIndex);

      // Line number row
      const lineNumEl = document.createElement("div");
      lineNumEl.className = "line-number-row";
      lineNumEl.textContent = lineNum;
      lineNumEl.id = `line-num-${lineNum}`;
      lineNumbersEl.appendChild(lineNumEl);

      // Code line container (Guaranteed vertical flow downwards)
      const lineDiv = document.createElement("div");
      lineDiv.className = "code-line";
      lineDiv.id = `code-line-${lineNum}`;
      lineDiv.dataset.line = lineNum;

      // Render each character in this line
      for (let c = 0; c < lineText.length; c++) {
        const char = lineText[c];
        const span = document.createElement("span");
        span.className = "code-char char-untyped";
        span.dataset.idx = globalCharIndex;
        span.dataset.line = lineNum;

        if (char === " ") {
          span.innerHTML = "&nbsp;";
          span.classList.add("char-space");
        } else if (char === "\t") {
          span.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
          span.classList.add("char-tab");
        } else {
          span.textContent = char;
        }

        applyGhostOpacity(span);
        lineDiv.appendChild(span);
        charSpans.push(span);
        globalCharIndex++;
      }

      // Add newline character marker at end of line (unless it's the very last line without newline)
      if (lineIdx < lines.length - 1) {
        const newlineSpan = document.createElement("span");
        newlineSpan.className = "code-char char-untyped char-newline";
        newlineSpan.dataset.idx = globalCharIndex;
        newlineSpan.dataset.line = lineNum;
        newlineSpan.innerHTML = "&crarr;";
        applyGhostOpacity(newlineSpan);

        lineDiv.appendChild(newlineSpan);
        charSpans.push(newlineSpan);
        globalCharIndex++;
      }

      // Handle completely empty lines so they have height
      if (lineText.length === 0 && lineIdx === lines.length - 1) {
        const emptySpan = document.createElement("span");
        emptySpan.className = "code-char";
        emptySpan.innerHTML = "&nbsp;";
        lineDiv.appendChild(emptySpan);
      }

      codeCanvas.appendChild(lineDiv);
    });

    updateCaretPosition();
  }

  function applyGhostOpacity(span) {
    if (currentMode === "ghost-full") {
      span.style.opacity = "0.38";
    } else if (currentMode === "ghost-fade") {
      span.style.opacity = "0.12";
    } else if (currentMode === "hint-only" || currentMode === "blind-test") {
      span.style.opacity = "0";
    }
  }

  function updateModeStyles() {
    currentMode = modeSelect.value;
    const modeTexts = {
      "ghost-full": "Ghost 100%",
      "ghost-fade": "Ghost 30%",
      "hint-only": "Kisi-kisi Saja",
      "blind-test": "Mode Ujian Asli"
    };
    currentModeLabel.textContent = modeTexts[currentMode] || "Ghost 100%";

    charSpans.forEach((span, i) => {
      if (i >= currentIndex) {
        applyGhostOpacity(span);
      }
    });
  }

  // AUTO-INDENT ENGINE: Skips leading spaces at the start of any line automatically
  function checkAndSkipAutoIndent() {
    if (currentIndex >= targetCode.length) return;

    // Check if we are at the start of a line and target chars are spaces or tabs
    while (currentIndex < targetCode.length && (targetCode[currentIndex] === " " || targetCode[currentIndex] === "\t")) {
      // Only auto-skip if it is leading indentation
      // Find current line start
      const currentSpan = charSpans[currentIndex];
      if (!currentSpan) break;
      const lineNum = parseInt(currentSpan.dataset.line, 10);
      const lineStartIdx = lineStarts[lineNum - 1];

      // If all chars from lineStartIdx to currentIndex are spaces/tabs, it's leading indent!
      let isLeadingIndent = true;
      for (let k = lineStartIdx; k < currentIndex; k++) {
        if (targetCode[k] !== " " && targetCode[k] !== "\t") {
          isLeadingIndent = false;
          break;
        }
      }

      if (isLeadingIndent) {
        // Auto-skip this indent space
        currentSpan.className = "code-char char-correct char-indent-auto";
        currentSpan.style.opacity = "0.5";
        currentIndex++;
      } else {
        break;
      }
    }

    updateCaretPosition();
  }

  // Caret Placement using exact getBoundingClientRect relative to canvas
  function updateCaretPosition() {
    if (currentIndex >= charSpans.length) {
      caret.style.display = "none";
      return;
    }
    caret.style.display = "block";
    const targetSpan = charSpans[currentIndex];
    if (targetSpan) {
      const canvasRect = codeCanvas.getBoundingClientRect();
      const spanRect = targetSpan.getBoundingClientRect();

      const top = spanRect.top - canvasRect.top;
      const left = spanRect.left - canvasRect.left;

      caret.style.top = `${top}px`;
      caret.style.left = `${left}px`;

      // Highlight active line row & number
      const line = parseInt(targetSpan.dataset.line || "1", 10);
      document.querySelectorAll(".line-number-row").forEach((el) => el.classList.remove("active"));
      document.querySelectorAll(".code-line").forEach((el) => el.classList.remove("active-line"));

      const activeLineNum = document.getElementById(`line-num-${line}`);
      if (activeLineNum) activeLineNum.classList.add("active");

      const activeCodeLine = document.getElementById(`code-line-${line}`);
      if (activeCodeLine) activeCodeLine.classList.add("active-line");

      statLine.textContent = `${line} / ${targetCode.split("\n").length}`;
      updateTeacherExplanation(line);

      // Auto-scroll vertically if caret goes out of view
      const wrapperHeight = editorWrapper.clientHeight;
      const currentScroll = editorWrapper.scrollTop;
      const relativeTop = top + currentScroll;
      if (top > wrapperHeight - 100) {
        editorWrapper.scrollTo({ top: currentScroll + (top - wrapperHeight / 2), behavior: "smooth" });
      } else if (top < 40) {
        editorWrapper.scrollTo({ top: Math.max(0, currentScroll - 100), behavior: "smooth" });
      }
    }
  }

  // Teacher Tips Update
  function updateTeacherExplanation(line) {
    if (!currentModule || !currentModule.explanations) return;

    let match = currentModule.explanations[line];
    if (!match) {
      const expLines = Object.keys(currentModule.explanations)
        .map(Number)
        .filter((l) => l <= line)
        .sort((a, b) => b - a);
      if (expLines.length > 0) {
        match = currentModule.explanations[expLines[0]];
      }
    }

    if (match) {
      currentLineDesc.innerHTML = `<strong>Baris ${line}:</strong> ${match.concept}`;
      teacherAnswerBox.textContent = match.teacherTip;
    } else {
      currentLineDesc.innerHTML = `<strong>Baris ${line}:</strong> Menulis lanjutan struktur kode kalkulator...`;
      teacherAnswerBox.textContent = `"Pak/Bu, bagian ini melengkapi fungsi kalkulator web kita."`;
    }
  }

  // Keyboard Event Handler
  function handleKeyDown(e) {
    initAudio();

    // Prevent default browser shortcuts that interfere
    if (["Tab", "Backspace", " ", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }

    if (currentIndex >= targetCode.length) return;

    if (!startTime) {
      startTime = new Date();
      timerInterval = setInterval(updateStats, 1000);
    }

    // Backspace Handling (Smart un-indenting)
    if (e.key === "Backspace") {
      if (currentIndex > 0) {
        currentIndex--;
        const span = charSpans[currentIndex];
        span.className = "code-char char-untyped";
        span.style.backgroundColor = "";
        applyGhostOpacity(span);

        // If previous characters were auto-indent on the same line, step back past them too!
        while (currentIndex > 0) {
          const prevSpan = charSpans[currentIndex - 1];
          if (prevSpan && prevSpan.classList.contains("char-indent-auto")) {
            currentIndex--;
            prevSpan.className = "code-char char-untyped";
            applyGhostOpacity(prevSpan);
          } else {
            break;
          }
        }

        updateCaretPosition();
        updateStats();
      }
      return;
    }

    // Tab key: If user manually presses Tab, advance past 4 spaces or indent
    if (e.key === "Tab") {
      if (targetCode[currentIndex] === " " || targetCode[currentIndex] === "\t") {
        while (currentIndex < targetCode.length && (targetCode[currentIndex] === " " || targetCode[currentIndex] === "\t")) {
          advanceCharacter(targetCode[currentIndex]);
        }
        playKeyClickSound();
        return;
      }
    }

    // Normal Character / Enter Matching
    let expectedChar = targetCode[currentIndex];
    let pressedKey = e.key;

    if (pressedKey === "Enter") {
      pressedKey = "\n";
    }

    totalKeystrokes++;

    if (pressedKey === expectedChar) {
      // MATCH!
      advanceCharacter(pressedKey);
      playKeyClickSound();

      // If we just pressed Enter (or finished newline), automatically skip indent of the new line!
      if (pressedKey === "\n") {
        checkAndSkipAutoIndent();
      }
    } else {
      // MISMATCH
      errorsCount++;
      playErrorSound();
      flashError(currentIndex);
    }

    updateStats();
  }

  function advanceCharacter(char) {
    const span = charSpans[currentIndex];
    span.className = "code-char char-correct";
    span.style.opacity = "1";
    span.style.backgroundColor = "";

    // Syntax coloring highlights
    if (char === "{" || char === "}" || char === "(" || char === ")") {
      span.style.color = "#fbbf24";
    } else if (char === "+" || char === "-" || char === "*" || char === "/" || char === "=") {
      span.style.color = "#38bdf8";
    } else if (char === '"' || char === "'") {
      span.style.color = "#a5d6ff";
    } else if (char === "\n") {
      span.style.color = "rgba(255, 255, 255, 0.4)";
    }

    currentIndex++;
    updateCaretPosition();

    // Check if module is completed!
    if (currentIndex >= targetCode.length) {
      onModuleComplete();
    }
  }

  function flashError(idx) {
    const span = charSpans[idx];
    if (span) {
      span.classList.remove("char-error");
      void span.offsetWidth; // trigger reflow
      span.classList.add("char-error");
      span.style.opacity = "1";
    }
  }

  // Update Stats
  function updateStats() {
    const totalChars = targetCode.length || 1;
    const progress = Math.min(100, Math.round((currentIndex / totalChars) * 100));
    progressBar.style.width = `${progress}%`;
    statPercent.textContent = `${progress}%`;

    statErrors.textContent = errorsCount;

    let accuracy = 100;
    if (totalKeystrokes > 0) {
      accuracy = Math.max(0, Math.round(((totalKeystrokes - errorsCount) / totalKeystrokes) * 100));
    }
    statAccuracy.textContent = `${accuracy}%`;

    let wpm = 0;
    if (startTime) {
      const elapsedMinutes = (new Date() - startTime) / 60000;
      if (elapsedMinutes > 0.05) {
        const wordsTyped = (currentIndex - errorsCount) / 5;
        wpm = Math.max(0, Math.round(wordsTyped / elapsedMinutes));
      }
    }
    statWpm.textContent = `${wpm} WPM`;
  }

  // Completion
  function onModuleComplete() {
    if (timerInterval) clearInterval(timerInterval);
    playSuccessSound();

    modalWpm.textContent = statWpm.textContent.replace(" WPM", "");
    modalAccuracy.textContent = statAccuracy.textContent;
    modalErrors.textContent = errorsCount;
    successModal.classList.add("active");
  }

  // Live Preview Builder
  function updateLivePreview() {
    const previewHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
          body { background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .kalkulator { background: #1e293b; padding: 18px; border-radius: 14px; width: 240px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; }
          #layar { width: 100%; height: 46px; background: #0b0f19; color: #38bdf8; font-size: 22px; font-weight: bold; text-align: right; padding: 8px 12px; border-radius: 8px; margin-bottom: 14px; border: 1px solid #334155; outline: none; }
          .tombol { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
          button { height: 44px; border: none; border-radius: 8px; background: #334155; color: white; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.1s; }
          button:hover { background: #475569; }
          button:active { transform: scale(0.96); }
          .btn-op { background: #2563eb; }
          .btn-op:hover { background: #1d4ed8; }
          .btn-clear { background: #ef4444; }
          .btn-equal { background: #10b981; }
        </style>
      </head>
      <body>
        <div class="kalkulator">
          <input type="text" id="layar" readonly placeholder="0">
          <div class="tombol">
            <button class="btn-clear" onclick="hapus()">C</button>
            <button class="btn-op" onclick="masukkan('/')">/</button>
            <button class="btn-op" onclick="masukkan('*')">*</button>
            <button class="btn-op" onclick="masukkan('-')">-</button>
            <button onclick="masukkan('7')">7</button>
            <button onclick="masukkan('8')">8</button>
            <button onclick="masukkan('9')">9</button>
            <button class="btn-op" onclick="masukkan('+')">+</button>
            <button onclick="masukkan('4')">4</button>
            <button onclick="masukkan('5')">5</button>
            <button onclick="masukkan('6')">6</button>
            <button class="btn-equal" onclick="hitung()">=</button>
            <button onclick="masukkan('1')">1</button>
            <button onclick="masukkan('2')">2</button>
            <button onclick="masukkan('3')">3</button>
            <button onclick="masukkan('0')">0</button>
          </div>
        </div>
        <script>
          function masukkan(val) {
            document.getElementById("layar").value += val;
          }
          function hitung() {
            let l = document.getElementById("layar");
            try {
              l.value = eval(l.value);
            } catch(e) {
              l.value = "Error";
            }
          }
          function hapus() {
            document.getElementById("layar").value = "";
          }
        </script>
      </body>
      </html>
    `;
    previewIframe.srcdoc = previewHtml;
  }

  function focusEditor() {
    hiddenInput.focus();
    editorWrapper.focus();
  }

  // Event Listeners
  moduleSelect.addEventListener("change", (e) => {
    loadModule(parseInt(e.target.value, 10));
  });

  modeSelect.addEventListener("change", () => {
    updateModeStyles();
    focusEditor();
  });

  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundToggle.classList.add("active");
      soundIcon.textContent = "🔊";
      soundText.textContent = "Sound ON";
      initAudio();
    } else {
      soundToggle.classList.remove("active");
      soundIcon.textContent = "🔇";
      soundText.textContent = "Sound OFF";
    }
    focusEditor();
  });

  resetBtn.addEventListener("click", () => {
    loadModule(currentModuleIndex);
  });

  modalRetryBtn.addEventListener("click", () => {
    successModal.classList.remove("active");
    loadModule(currentModuleIndex);
  });

  modalNextBtn.addEventListener("click", () => {
    successModal.classList.remove("active");
    const nextIdx = (currentModuleIndex + 1) % LESSON_MODULES.length;
    moduleSelect.value = nextIdx;
    loadModule(nextIdx);
  });

  // Tab switching
  sidebarTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      sidebarTabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const targetId = tab.dataset.tab;
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add("active");
    });
  });

  // Copy Full Code
  copyCodeBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(targetCode).then(() => {
      const orig = copyCodeBtn.textContent;
      copyCodeBtn.textContent = "✓ Kode Berhasil Disalin!";
      setTimeout(() => {
        copyCodeBtn.textContent = orig;
      }, 2000);
    });
  });

  // Load Custom Code
  loadCustomBtn.addEventListener("click", () => {
    const title = customTitleInput.value.trim() || "Modul Kustom Sendiri";
    const code = customCodeTextarea.value.trim();
    if (!code) {
      alert("Harap tempelkan (paste) kode terlebih dahulu!");
      return;
    }

    const customModule = {
      id: "custom-" + Date.now(),
      title: title,
      category: "Kustom",
      language: "custom",
      badge: "Latihan Mandiri",
      description: "Kisi-kisi kustom yang dimasukkan langsung oleh pengguna.",
      code: code,
      explanations: {
        1: {
          concept: "Kode kustom yang Anda masukkan sendiri untuk persiapan ujian.",
          teacherTip: "'Pak/Bu, ini adalah logika kalkulator kustom yang telah dipersiapkan.'"
        }
      }
    };

    LESSON_MODULES.push(customModule);
    initModuleSelect();
    moduleSelect.value = LESSON_MODULES.length - 1;
    loadModule(LESSON_MODULES.length - 1);

    document.querySelector('[data-tab="tab-tips"]').click();
  });

  editorWrapper.addEventListener("click", () => {
    focusEditor();
  });

  document.addEventListener("keydown", (e) => {
    if (e.target === customTitleInput || e.target === customCodeTextarea) {
      return;
    }
    handleKeyDown(e);
  });

  // Window resize: re-align caret
  window.addEventListener("resize", () => {
    updateCaretPosition();
  });

  // Initialize
  initModuleSelect();
  loadModule(0);
})();
