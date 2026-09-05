/**
 * Cortex Code Editor — Landing Page Interactive Engine
 * BUIMB Research (c) 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initEditorSimulator();
  initTerminalEmulator();
  initShortcutsCatalog();
  initFaqAccordion();
  initDownloadDropdown();
  initTermsModal();
  initHashViewers();
  initNavbarScroll();
});

/* ==========================================================================
   1. Interactive Editor Simulator
   ========================================================================== */
const SIMULATOR_FILES = {
  'app-tsx': {
    name: 'App.tsx',
    lang: 'TypeScript React (UTF-8)',
    code: [
      '<span class="syn-kw">import</span> React, { useState, useEffect } <span class="syn-kw">from</span> <span class="syn-str">\'react\'</span>;',
      '<span class="syn-kw">import</span> { MonacoEditor, TerminalDock, WorkspaceTree } <span class="syn-kw">from</span> <span class="syn-str">\'@cortex/core\'</span>;',
      '<span class="syn-kw">import</span> { useCortexStore } <span class="syn-kw">from</span> <span class="syn-str">\'./store/cortexStore\'</span>;',
      '',
      '<span class="syn-comm">// Initialize sovereign, privacy-first Cortex Desktop Editor</span>',
      '<span class="syn-kw">export const</span> <span class="syn-fn">App</span>: React.FC = () =&gt; {',
      '  <span class="syn-kw">const</span> { activeTab, telemetryEnabled, openFile } = <span class="syn-fn">useCortexStore</span>();',
      '  <span class="syn-kw">const</span> [isPtyReady, setPtyReady] = <span class="syn-fn">useState</span>(<span class="syn-kw">true</span>);',
      '',
      '  <span class="syn-fn">useEffect</span>(() =&gt; {',
      '    <span class="syn-comm">// 100% Local IPC bridge with zero telemetry tracking</span>',
      '    window.cortexAPI.<span class="syn-fn">onWorkspaceChange</span>((event) =&gt; {',
      '      console.<span class="syn-fn">log</span>(<span class="syn-str">\'[Chokidar IPC] Live File Event:\'</span>, event);',
      '    });',
      '  }, []);',
      '',
      '  <span class="syn-kw">return</span> (',
      '    &lt;<span class="syn-type">div</span> <span class="syn-prop">className</span>=<span class="syn-str">"cortex-window-root dark-theme"</span>&gt;',
      '      &lt;<span class="syn-type">WorkspaceTree</span> <span class="syn-prop">liveSync</span>={<span class="syn-kw">true</span>} /&gt;',
      '      &lt;<span class="syn-type">MonacoEditor</span>',
      '        <span class="syn-prop">theme</span>=<span class="syn-str">"cortex-dark"</span>',
      '        <span class="syn-prop">activeFile</span>={activeTab}',
      '        <span class="syn-prop">options</span>={{ minimap: { enabled: <span class="syn-kw">true</span> }, fontSize: 14 }}',
      '      /&gt;',
      '      &lt;<span class="syn-type">TerminalDock</span> <span class="syn-prop">shell</span>=<span class="syn-str">"node-pty-powershell"</span> <span class="syn-prop">latencyMs</span>={0} /&gt;',
      '    &lt;/<span class="syn-type">div</span>&gt;',
      '  );',
      '};'
    ]
  },
  'terminal-ts': {
    name: 'terminalService.ts',
    lang: 'TypeScript (UTF-8)',
    code: [
      '<span class="syn-kw">import</span> * <span class="syn-kw">as</span> pty <span class="syn-kw">from</span> <span class="syn-str">\'node-pty\'</span>;',
      '<span class="syn-kw">import</span> { spawn, ChildProcess } <span class="syn-kw">from</span> <span class="syn-str">\'child_process\'</span>;',
      '',
      '<span class="syn-kw">export class</span> <span class="syn-type">TerminalService</span> {',
      '  <span class="syn-kw">private</span> terminals = <span class="syn-kw">new</span> <span class="syn-type">Map</span>&lt;<span class="syn-type">string</span>, <span class="syn-type">any</span>&gt;();',
      '',
      '  <span class="syn-kw">public</span> <span class="syn-fn">createSession</span>(id: <span class="syn-type">string</span>, shell: <span class="syn-type">string</span>, cwd: <span class="syn-type">string</span>) {',
      '    <span class="syn-kw">try</span> {',
      '      <span class="syn-comm">// Spawn native pseudo-terminal with high-fps stream</span>',
      '      <span class="syn-kw">const</span> ptyProcess = pty.<span class="syn-fn">spawn</span>(shell || <span class="syn-str">\'powershell.exe\'</span>, [], {',
      '        name: <span class="syn-str">\'xterm-256color\'</span>,',
      '        cols: 80,',
      '        rows: 24,',
      '        cwd: cwd,',
      '        env: process.env',
      '      });',
      '      ',
      '      ptyProcess.<span class="syn-fn">onData</span>((data) =&gt; <span class="syn-kw">this</span>.<span class="syn-fn">sendIpc</span>(id, data));',
      '      <span class="syn-kw">this</span>.terminals.<span class="syn-fn">set</span>(id, ptyProcess);',
      '      <span class="syn-kw">return true</span>;',
      '    } <span class="syn-kw">catch</span> (err) {',
      '      <span class="syn-comm">// Dynamic fallback to interactive child process shell</span>',
      '      <span class="syn-kw">return this</span>.<span class="syn-fn">fallbackShell</span>(id, shell, cwd);',
      '    }',
      '  }',
      '}'
    ]
  },
  'chokidar-ts': {
    name: 'fileWatcher.ts',
    lang: 'TypeScript (UTF-8)',
    code: [
      '<span class="syn-kw">import</span> chokidar <span class="syn-kw">from</span> <span class="syn-str">\'chokidar\'</span>;',
      '<span class="syn-kw">import</span> { BrowserWindow } <span class="syn-kw">from</span> <span class="syn-str">\'electron\'</span>;',
      '',
      '<span class="syn-kw">export const</span> <span class="syn-fn">initWorkspaceWatcher</span> = (workspacePath: <span class="syn-type">string</span>, win: BrowserWindow) =&gt; {',
      '  <span class="syn-kw">const</span> watcher = chokidar.<span class="syn-fn">watch</span>(workspacePath, {',
      '    ignored: [/(^|[\\/\\\\])\\../, <span class="syn-str">\'**/node_modules/**\'</span>, <span class="syn-str">\'**/.git/**\'</span>],',
      '    persistent: <span class="syn-kw">true</span>,',
      '    ignoreInitial: <span class="syn-kw">true</span>,',
      '    depth: 9',
      '  });',
      '',
      '  watcher.<span class="syn-fn">on</span>(<span class="syn-str">\'all\'</span>, (event, filePath) =&gt; {',
      '    <span class="syn-comm">// Instant UI push over type-safe IPC channels</span>',
      '    win.webContents.<span class="syn-fn">send</span>(<span class="syn-str">\'cortex:workspace-file-changed\'</span>, { event, filePath });',
      '  });',
      '',
      '  <span class="syn-kw">return</span> watcher;',
      '};'
    ]
  },
  'cortex-config': {
    name: 'cortex.config.json',
    lang: 'JSON (UTF-8)',
    code: [
      '{',
      '  <span class="syn-prop">"version"</span>: <span class="syn-str">"1.0.0"</span>,',
      '  <span class="syn-prop">"editor"</span>: {',
      '    <span class="syn-prop">"theme"</span>: <span class="syn-str">"cortex-dark"</span>,',
      '    <span class="syn-prop">"fontSize"</span>: 14,',
      '    <span class="syn-prop">"fontFamily"</span>: <span class="syn-str">"Fira Code, JetBrains Mono, Consolas"</span>,',
      '    <span class="syn-prop">"tabSize"</span>: 2,',
      '    <span class="syn-prop">"formatOnSave"</span>: <span class="syn-kw">true</span>',
      '  },',
      '  <span class="syn-prop">"privacy"</span>: {',
      '    <span class="syn-prop">"telemetry"</span>: <span class="syn-kw">false</span>,',
      '    <span class="syn-prop">"crashReports"</span>: <span class="syn-str">"local-only"</span>',
      '  },',
      '  <span class="syn-prop">"terminal"</span>: {',
      '    <span class="syn-prop">"defaultShell"</span>: <span class="syn-str">"powershell.exe"</span>,',
      '    <span class="syn-prop">"cursorBlink"</span>: <span class="syn-kw">true</span>',
      '  }',
      '}'
    ]
  },
  'terms-md': {
    name: 'TERMS.md',
    lang: 'Markdown (UTF-8)',
    code: [
      '<span class="syn-fn"># Cortex Terms &amp; Open Source License Agreement</span>',
      '',
      '<span class="syn-comm">**Developed and maintained by BUIMB Research.**</span>',
      '',
      '<span class="syn-kw">- Permissive Open-Source Grant:</span> Free for private, commercial, and research use.',
      '<span class="syn-kw">- Sovereign Execution:</span> Zero telemetry, zero code scraping, zero keystroke logging.',
      '<span class="syn-kw">- AI Direct Connect:</span> API keys talk directly to upstream endpoints without BUIMB proxies.',
      '<span class="syn-kw">- Local Persistence:</span> Configurations stored strictly in %APPDATA%/Cortex.'
    ]
  }
};

function initEditorSimulator() {
  const displayContainer = document.getElementById('sim-code-display');
  const breadcrumbEl = document.getElementById('bc-filename');
  const treeFiles = document.querySelectorAll('.tree-file');
  const tabButtons = document.querySelectorAll('.sim-tab');

  function renderFile(fileKey) {
    const file = SIMULATOR_FILES[fileKey] || SIMULATOR_FILES['app-tsx'];
    
    // Render lines
    if (displayContainer) {
      displayContainer.innerHTML = file.code.map((line, idx) => `
        <div class="code-line">
          <span class="line-no">${idx + 1}</span>
          <span class="line-code">${line}</span>
        </div>
      `).join('');
    }

    if (breadcrumbEl) {
      breadcrumbEl.textContent = file.name;
    }

    // Sync active state in tree
    treeFiles.forEach(el => {
      el.classList.toggle('active', el.dataset.file === fileKey);
    });

    // Sync active state in tabs
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === fileKey);
    });
  }

  // Click handlers on sidebar files
  treeFiles.forEach(item => {
    item.addEventListener('click', () => {
      const key = item.dataset.file;
      renderFile(key);
    });
  });

  // Click handlers on tabs
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.tab;
      renderFile(key);
    });
  });

  // Initial render
  renderFile('app-tsx');
}

/* ==========================================================================
   2. Interactive Terminal Emulator
   ========================================================================== */
function initTerminalEmulator() {
  const inputEl = document.getElementById('term-input');
  const logsEl = document.getElementById('term-log-entries');
  const clearBtn = document.getElementById('term-clear-btn');
  const buildBtn = document.getElementById('term-run-build-btn');

  if (!inputEl || !logsEl) return;

  function appendLog(lineHtml) {
    const row = document.createElement('div');
    row.className = 'term-line';
    row.innerHTML = lineHtml;
    logsEl.appendChild(row);
    logsEl.scrollTop = logsEl.scrollHeight;
  }

  function handleCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    appendLog(`<span class="term-prompt">PS C:\\Cortex\\workspace&gt;</span> <span style="color:#fff">${escapeHtml(rawCmd)}</span>`);

    if (!cmd) return;

    switch (cmd) {
      case 'help':
        appendLog(`
          <div style="color:#94a3b8; margin: 4px 0;">
            Available interactive commands:<br/>
            - <span class="cyan">build</span> : Simulate Vite bundle &amp; Electron package build<br/>
            - <span class="cyan">features</span> : Display list of core Cortex features<br/>
            - <span class="cyan">specs</span> : Show current runtime specs and benchmark data<br/>
            - <span class="cyan">download</span> : Jump directly to download center<br/>
            - <span class="cyan">version</span> : Show version and license information<br/>
            - <span class="cyan">clear</span> : Clear current terminal log
          </div>
        `);
        break;

      case 'build':
      case 'npm run build':
        appendLog(`<span class="cyan">⚡ [Cortex Build Pipeline]</span> Starting TypeScript validation...`);
        setTimeout(() => {
          appendLog(`<span class="green">✔</span> [Renderer] Vite React 18 build complete in 1.42s`);
          appendLog(`<span class="green">✔</span> [Main Process] node-pty &amp; IPC bundle verified (0 errors)`);
          appendLog(`<span class="purple">📦 Package:</span> Cortex Setup 1.0.0.exe (104.7 MB) &amp; ZIP Archive ready!`);
        }, 500);
        break;

      case 'features':
        appendLog(`
          <span class="cyan">Cortex Core Features:</span><br/>
          • Monaco Editor Engine (25+ Languages)<br/>
          • Zero-Lag Native Terminal (node-pty / xterm.js)<br/>
          • Chokidar Real-time File System Sync<br/>
          • 100% Local Privacy (Zero Telemetry)<br/>
          • Lightning &lt; 0.8s Cold Startup
        `);
        break;

      case 'specs':
        appendLog(`
          <span class="purple">System Specs:</span> Windows 10/11 x64 | Electron 31 | React 18 | TypeScript 5<br/>
          <span class="green">Telemetry:</span> DISABLED (0 bytes sent)<br/>
          <span class="cyan">Memory:</span> ~110 MB idle footprint
        `);
        break;

      case 'download':
        window.location.hash = '#downloads';
        appendLog(`<span class="green">✔ Navigating to download options...</span>`);
        break;

      case 'version':
        appendLog(`<span class="cyan">Cortex v1.0.0 Stable</span> (BUIMB Research) — Open Source Permissive License`);
        break;

      case 'clear':
      case 'cls':
        logsEl.innerHTML = '';
        break;

      default:
        appendLog(`<span class="red">Command not recognized: '${escapeHtml(rawCmd)}'.</span> Type <span class="cyan">'help'</span> for available commands.`);
    }
  }

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = inputEl.value;
      inputEl.value = '';
      handleCommand(val);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      logsEl.innerHTML = '';
    });
  }

  if (buildBtn) {
    buildBtn.addEventListener('click', () => {
      handleCommand('build');
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ==========================================================================
   3. Shortcuts Catalog & Filter Engine
   ========================================================================== */
const SHORTCUTS_DATA = [
  { title: 'Save Active File', keys: ['Ctrl', 'S'], cat: 'editor' },
  { title: 'Save All Open Files', keys: ['Ctrl', 'Shift', 'S'], cat: 'editor' },
  { title: 'Close Active Tab', keys: ['Ctrl', 'W'], cat: 'editor' },
  { title: 'Toggle Native Terminal Dock', keys: ['Ctrl', '`'], cat: 'view' },
  { title: 'Toggle File Explorer Sidebar', keys: ['Ctrl', 'B'], cat: 'view' },
  { title: 'Open Single File Dialog', keys: ['Ctrl', 'O'], cat: 'workspace' },
  { title: 'Open Workspace Folder', keys: ['Ctrl', 'Shift', 'O'], cat: 'workspace' },
  { title: 'Command Palette', keys: ['Ctrl', 'Shift', 'P'], cat: 'editor' },
  { title: 'Quick File Finder', keys: ['Ctrl', 'P'], cat: 'workspace' },
  { title: 'Duplicate Current Line', keys: ['Shift', 'Alt', '↓'], cat: 'editor' },
  { title: 'Toggle Line Comment', keys: ['Ctrl', '/'], cat: 'editor' },
  { title: 'Help & License Terms', keys: ['F1'], cat: 'view' }
];

function initShortcutsCatalog() {
  const gridEl = document.getElementById('shortcuts-grid');
  const searchInput = document.getElementById('shortcut-search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!gridEl) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function render() {
    const filtered = SHORTCUTS_DATA.filter(item => {
      const matchCat = currentCategory === 'all' || item.cat === currentCategory;
      const matchSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery) ||
        item.keys.join(' ').toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      gridEl.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 24px;">No shortcuts found matching '${escapeHtml(searchQuery)}'</div>`;
      return;
    }

    gridEl.innerHTML = filtered.map(item => `
      <div class="shortcut-card">
        <span class="shortcut-title">${item.title}</span>
        <div class="shortcut-keys">
          ${item.keys.map(k => `<kbd>${k}</kbd>`).join(' + ')}
        </div>
      </div>
    `).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      render();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.cat;
      render();
    });
  });

  render();
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
}

/* ==========================================================================
   5. Download Dropdown Menu
   ========================================================================== */
function initDownloadDropdown() {
  const trigger = document.getElementById('hero-dropdown-trigger');
  const menu = document.getElementById('hero-dropdown-menu');

  if (!trigger || !menu) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== trigger) {
      menu.classList.remove('show');
    }
  });
}

/* ==========================================================================
   6. Terms & License Modal
   ========================================================================== */
function initTermsModal() {
  const modal = document.getElementById('terms-modal');
  const openBtn = document.getElementById('open-terms-modal-btn');
  const footerTermsBtn = document.getElementById('footer-terms-btn');
  const closeBtn = document.getElementById('close-terms-modal-btn');
  const dismissBtn = document.getElementById('terms-dismiss-btn');

  function open() {
    if (modal) modal.classList.add('open');
  }
  function close() {
    if (modal) modal.classList.remove('open');
  }

  if (openBtn) openBtn.addEventListener('click', open);
  if (footerTermsBtn) {
    footerTermsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (dismissBtn) dismissBtn.addEventListener('click', close);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      close();
    }
  });
}

/* ==========================================================================
   7. SHA-256 Hash Viewer & Copy
   ========================================================================== */
function initHashViewers() {
  const hashBtns = document.querySelectorAll('.hash-btn');
  hashBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.classList.toggle('show');
      }
    });
  });

  const copyBtns = document.querySelectorAll('.copy-hash-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const hashVal = btn.dataset.hash;
      navigator.clipboard.writeText(hashVal).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 2000);
      });
    });
  });
}

/* ==========================================================================
   8. Navbar Scroll & Mobile Menu Toggle
   ========================================================================== */
function initNavbarScroll() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '72px';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = '#090d16';
        navMenu.style.padding = '20px';
        navMenu.style.borderBottom = '1px solid rgba(0, 240, 255, 0.3)';
      }
    });
  }
}
