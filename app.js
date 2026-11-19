// app.js - Engine UKK LiveCode Simulator

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
      osc.frequency.setValueAtTime(350 + Math.random() * 80, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);

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
    } catch (e) {
      // Audio fallback fail-safe
    }
  }

  function playErrorSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(130, audioCtx.currentTime);

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

  // Load Module
  let charSpans = [];
  let lineBreakIndices = [];

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
    updateTeacherExplanation(1);
    focusEditor();
  }

  // Render Editor DOM with Spans
  function renderEditor() {
    codeCanvas.innerHTML = "";
    lineNumbersEl.innerHTML = "";
    charSpans = [];
    lineBreakIndices = [];

    // Append caret first
    codeCanvas.appendChild(caret);

    const lines = targetCode.split("\n");
    lines.forEach((_, i) => {
      const lineNum = document.createElement("div");
      lineNum.textContent = i + 1;
      lineNum.id = `line-num-${i + 1}`;
      lineNumbersEl.appendChild(lineNum);
    });

    let currentLine = 1;
    for (let i = 0; i < targetCode.length; i++) {
      const char = targetCode[i];
      const span = document.createElement("span");
      span.className = "code-char char-untyped";
      span.dataset.idx = i;
      span.dataset.line = currentLine;

      if (char === "\n") {
        span.innerHTML = "&crarr;<br>";
        span.classList.add("char-newline");
        lineBreakIndices.push(i);
        currentLine++;
      } else if (char === " ") {
        span.innerHTML = "&nbsp;";
        span.classList.add("char-space");
      } else if (char === "\t") {
        span.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
        span.classList.add("char-tab");
      } else {
        span.textContent = char;
      }

      applyGhostOpacity(span);
      codeCanvas.appendChild(span);
      charSpans.push(span);
    }

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

  // Caret Placement
  function updateCaretPosition() {
    if (currentIndex >= charSpans.length) {
      caret.style.display = "none";
      return;
    }
    caret.style.display = "block";
    const targetSpan = charSpans[currentIndex];
    if (targetSpan) {
      const top = targetSpan.offsetTop;
      const left = targetSpan.offsetLeft;
      caret.style.top = `${top}px`;
      caret.style.left = `${left}px`;

      // Auto-scroll to keep caret in view
      const wrapperHeight = editorWrapper.clientHeight;
      const currentScroll = editorWrapper.scrollTop;
      if (top > currentScroll + wrapperHeight - 120) {
        editorWrapper.scrollTo({ top: top - wrapperHeight / 2, behavior: "smooth" });
      } else if (top < currentScroll + 60) {
        editorWrapper.scrollTo({ top: Math.max(0, top - 60), behavior: "smooth" });
      }

      // Highlight active line number
      const line = parseInt(targetSpan.dataset.line || "1", 10);
      document.querySelectorAll(".line-numbers div").forEach((el) => el.classList.remove("active"));
      const activeLineEl = document.getElementById(`line-num-${line}`);
      if (activeLineEl) activeLineEl.classList.add("active");

      statLine.textContent = `${line} / ${targetCode.split("\n").length}`;
      updateTeacherExplanation(line);
    }
  }

  // Teacher Tips Update
  function updateTeacherExplanation(line) {
    if (!currentModule || !currentModule.explanations) return;

    // Check exact line or find closest previous line explanation
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
      currentLineDesc.innerHTML = `<strong>Baris ${line}:</strong> Sedang menulis alur kode lanjutan kalkulator...`;
      teacherAnswerBox.textContent = `"Pak/Bu, bagian ini merupakan kelanjutan dari struktur logika perhitungan kalkulator."`;
    }
  }

  // Keyboard Event Handler
  function handleKeyDown(e) {
    initAudio();

    // Prevent scrolling or unwanted browser actions
    if (["Tab", "Backspace", " ", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }

    if (currentIndex >= targetCode.length) return;

    if (!startTime) {
      startTime = new Date();
      timerInterval = setInterval(updateStats, 1000);
    }

    // Backspace handling
    if (e.key === "Backspace") {
      if (currentIndex > 0) {
        currentIndex--;
        const span = charSpans[currentIndex];
        span.className = "code-char char-untyped";
        span.style.backgroundColor = "";
        applyGhostOpacity(span);
        updateCaretPosition();
        updateStats();
      }
      return;
    }

    // Tab handling: if target code is indent (multiple spaces), tab can autocomplete current indent level!
    if (e.key === "Tab") {
      if (targetCode.substr(currentIndex, 4) === "    ") {
        for (let k = 0; k < 4; k++) {
          advanceCharacter(" ");
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
    } else {
      // MISMATCH / ERROR
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

    // Syntax coloring hints
    if (char === "{" || char === "}" || char === "(" || char === ")") {
      span.style.color = "#fbbf24";
    } else if (char === "+" || char === "-" || char === "*" || char === "/" || char === "=") {
      span.style.color = "#38bdf8";
    } else if (char === '"' || char === "'") {
      span.style.color = "#a5d6ff";
    }

    currentIndex++;
    updateCaretPosition();

    // Auto-complete spaces if user presses Enter and target has automatic indent
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
    const defaultHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
          body { background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .calc { background: #1e293b; padding: 20px; border-radius: 16px; width: 260px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; }
          #display { background: #0b0f19; color: #38bdf8; font-size: 28px; font-weight: bold; text-align: right; padding: 14px; border-radius: 8px; margin-bottom: 16px; min-height: 55px; }
          .keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
          button { height: 46px; border: none; border-radius: 8px; background: #334155; color: white; font-size: 16px; font-weight: bold; cursor: pointer; }
          button:hover { background: #475569; }
          .op { background: #2563eb; }
          .op:hover { background: #1d4ed8; }
          .clear { background: #ef4444; }
          .equal { background: #10b981; grid-row: span 2; height: 100px; }
        </style>
      </head>
      <body>
        <div class="calc">
          <div id="display">0</div>
          <div class="keys">
            <button class="clear" onclick="clearAll()">AC</button>
            <button class="op" onclick="chooseOperation('/')">&divide;</button>
            <button class="op" onclick="chooseOperation('*')">&times;</button>
            <button class="op" onclick="chooseOperation('-')">-</button>
            <button onclick="appendNumber('7')">7</button>
            <button onclick="appendNumber('8')">8</button>
            <button onclick="appendNumber('9')">9</button>
            <button class="op" onclick="chooseOperation('+')">+</button>
            <button onclick="appendNumber('4')">4</button>
            <button onclick="appendNumber('5')">5</button>
            <button onclick="appendNumber('6')">6</button>
            <button class="equal" onclick="calculate()">=</button>
            <button onclick="appendNumber('1')">1</button>
            <button onclick="appendNumber('2')">2</button>
            <button onclick="appendNumber('3')">3</button>
            <button onclick="appendNumber('0')">0</button>
            <button onclick="appendNumber('.')">.</button>
          </div>
        </div>
        <script>
          let currentInput = "0";
          let previousInput = "";
          let operation = null;
          function appendNumber(num) {
            if (num === "." && currentInput.includes(".")) return;
            if (currentInput === "0" && num !== ".") currentInput = num;
            else currentInput += num;
            updateDisplay();
          }
          function chooseOperation(op) {
            if (currentInput === "") return;
            if (previousInput !== "") calculate();
            operation = op;
            previousInput = currentInput;
            currentInput = "";
            updateDisplay();
          }
          function calculate() {
            let res;
            const p = parseFloat(previousInput);
            const c = parseFloat(currentInput);
            if (isNaN(p) || isNaN(c)) return;
            switch(operation) {
              case '+': res = p + c; break;
              case '-': res = p - c; break;
              case '*': res = p * c; break;
              case '/': res = c === 0 ? "Error" : p / c; break;
              default: return;
            }
            currentInput = res.toString();
            operation = null;
            previousInput = "";
            updateDisplay();
          }
          function clearAll() {
            currentInput = "0";
            previousInput = "";
            operation = null;
            updateDisplay();
          }
          function updateDisplay() {
            document.getElementById("display").innerText = currentInput;
          }
        </script>
      </body>
      </html>
    `;
    previewIframe.srcdoc = defaultHtml;
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

    // Switch back to Tips tab
    document.querySelector('[data-tab="tab-tips"]').click();
  });

  // Click editor area to capture keystrokes
  editorWrapper.addEventListener("click", () => {
    focusEditor();
  });

  // Listen to keystrokes on document and hidden input
  document.addEventListener("keydown", (e) => {
    // If typing in textarea or inputs on custom tab, don't hijack
    if (e.target === customTitleInput || e.target === customCodeTextarea) {
      return;
    }
    handleKeyDown(e);
  });

  // Initialize
  initModuleSelect();
  loadModule(0);
})();
