/**
 * Bodhi Code Editor — Landing Page Interactive Engine
 * BUIMB Research (c) 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initEditorSimulator();
  initTerminalEmulator();
  initShortcutsCatalog();
  initFaqAccordion();
  initDownloadDropdown();
  initHashViewers();
  initNavbarScroll();
  initDownloadAgreementWall();
  initCliTabs();
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
      '<span class="syn-kw">import</span> { MonacoEditor, TerminalDock, WorkspaceTree } <span class="syn-kw">from</span> <span class="syn-str">\'@bodhi/core\'</span>;',
      '<span class="syn-kw">import</span> { useBodhiStore } <span class="syn-kw">from</span> <span class="syn-str">\'./store/bodhiStore\'</span>;',
      '',
      '<span class="syn-comm">// Initialize sovereign, privacy-first Bodhi Desktop Editor</span>',
      '<span class="syn-kw">export const</span> <span class="syn-fn">App</span>: React.FC = () =&gt; {',
      '  <span class="syn-kw">const</span> { activeTab, telemetryEnabled, openFile } = <span class="syn-fn">useBodhiStore</span>();',
      '  <span class="syn-kw">const</span> [isPtyReady, setPtyReady] = <span class="syn-fn">useState</span>(<span class="syn-kw">true</span>);',
      '',
      '  <span class="syn-fn">useEffect</span>(() =&gt; {',
      '    <span class="syn-comm">// 100% Local IPC bridge with zero telemetry tracking</span>',
      '    window.bodhiAPI.<span class="syn-fn">onWorkspaceChange</span>((event) =&gt; {',
      '      console.<span class="syn-fn">log</span>(<span class="syn-str">\'[Chokidar IPC] Live File Event:\'</span>, event);',
      '    });',
      '  }, []);',
      '',
      '  <span class="syn-kw">return</span> (',
      '    &lt;<span class="syn-type">div</span> <span class="syn-prop">className</span>=<span class="syn-str">"bodhi-window-root dark-theme"</span>&gt;',
      '      &lt;<span class="syn-type">WorkspaceTree</span> <span class="syn-prop">liveSync</span>={<span class="syn-kw">true</span>} /&gt;',
      '      &lt;<span class="syn-type">MonacoEditor</span>',
      '        <span class="syn-prop">theme</span>=<span class="syn-str">"bodhi-dark"</span>',
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
      '    win.webContents.<span class="syn-fn">send</span>(<span class="syn-str">\'bodhi:workspace-file-changed\'</span>, { event, filePath });',
      '  });',
      '',
      '  <span class="syn-kw">return</span> watcher;',
      '};'
    ]
  },
  'bodhi-config': {
    name: 'bodhi.config.json',
    lang: 'JSON (UTF-8)',
    code: [
      '{',
      '  <span class="syn-prop">"version"</span>: <span class="syn-str">"1.0.0-beta.1"</span>,',
      '  <span class="syn-prop">"editor"</span>: {',
      '    <span class="syn-prop">"theme"</span>: <span class="syn-str">"bodhi-dark"</span>,',
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
      '<span class="syn-fn"># Bodhi Terms &amp; Open Source License Agreement</span>',
      '',
      '<span class="syn-comm">**Developed and maintained by BUIMB Research.**</span>',
      '',
      '<span class="syn-kw">- Permissive Open-Source Grant:</span> Free for private, commercial, and research use.',
      '<span class="syn-kw">- Sovereign Execution:</span> Zero telemetry, zero code scraping, zero keystroke logging.',
      '<span class="syn-kw">- AI Direct Connect:</span> API keys talk directly to upstream endpoints without BUIMB proxies.',
      '<span class="syn-kw">- Local Persistence:</span> Configurations stored strictly in %APPDATA%/Bodhi.'
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

    treeFiles.forEach(el => {
      el.classList.toggle('active', el.dataset.file === fileKey);
    });

    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === fileKey);
    });
  }

  treeFiles.forEach(item => {
    item.addEventListener('click', () => {
      const key = item.dataset.file;
      renderFile(key);
    });
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.tab;
      renderFile(key);
    });
  });

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
    appendLog(`<span class="term-prompt">PS C:\\Bodhi\\workspace&gt;</span> <span style="color:#fff">${escapeHtml(rawCmd)}</span>`);

    if (!cmd) return;

    switch (cmd) {
      case 'help':
        appendLog(`
          <div style="color:#94a3b8; margin: 4px 0;">
            Available interactive commands:<br/>
            - <span class="green">build</span> : Simulate Vite bundle &amp; Electron package build<br/>
            - <span class="green">features</span> : Display list of core Bodhi features<br/>
            - <span class="green">specs</span> : Show current runtime specs and benchmark data<br/>
            - <span class="green">terms</span> : View BUIMB Research Terms &amp; Open Source License<br/>
            - <span class="green">download</span> : Jump directly to download center<br/>
            - <span class="green">version</span> : Show version and license information<br/>
            - <span class="green">clear</span> : Clear current terminal log
          </div>
        `);
        break;

      case 'build':
      case 'npm run build':
        appendLog(`<span class="green">⚡ [Bodhi Build Pipeline]</span> Starting TypeScript validation...`);
        setTimeout(() => {
          appendLog(`<span class="green">✔</span> [Renderer] Vite React 18 build complete in 1.42s`);
          appendLog(`<span class="green">✔</span> [Main Process] node-pty &amp; IPC bundle verified (0 errors)`);
          appendLog(`<span class="purple">📦 Package:</span> Bodhi Setup 1.0.0.exe (104.7 MB) &amp; ZIP Archive ready!`);
        }, 500);
        break;

      case 'features':
        appendLog(`
          <span class="green">Bodhi Core Features:</span><br/>
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
          <span class="green">Memory:</span> ~110 MB idle footprint
        `);
        break;

      case 'terms':
      case 'license':
        appendLog(`<span class="green">✔ BUIMB Research Open Source License:</span> Permissive grant. 100% local privacy guarantee.`);
        break;

      case 'download':
        window.location.hash = '#downloads';
        appendLog(`<span class="green">✔ Navigating to download options...</span>`);
        break;

      case 'version':
        appendLog(`<span class="green">Bodhi v1.0.0 Stable</span> (BUIMB Research) &mdash; Open Source Permissive License`);
        break;

      case 'clear':
      case 'cls':
        logsEl.innerHTML = '';
        break;

      default:
        appendLog(`<span class="red">Command not recognized: '${escapeHtml(rawCmd)}'.</span> Type <span class="green">'help'</span> for available commands.`);
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
   6. Mandatory Terms Agreement & Download Flow
   ========================================================================== */
function initDownloadAgreementWall() {
  const modal = document.getElementById('download-agreement-modal');
  const closeBtn = document.getElementById('close-agreement-modal-btn');
  const cancelBtn = document.getElementById('agreement-cancel-btn');
  const downloadBtn = document.getElementById('agreement-download-btn');
  const checkbox = document.getElementById('terms-agree-checkbox');
  const labelWrap = document.getElementById('agreement-label');

  const fileNameEl = document.getElementById('agreement-file-name');
  const fileMetaEl = document.getElementById('agreement-file-meta');
  const modalIconEl = document.getElementById('agreement-modal-icon');

  if (!modal || !downloadBtn || !checkbox) return;

  let pendingDownloadUrl = '';
  let pendingDownloadName = '';

  function openModal(url, name, type, size) {
    pendingDownloadUrl = url;
    pendingDownloadName = name;

    if (fileNameEl) fileNameEl.textContent = name;
    if (fileMetaEl) fileMetaEl.textContent = `${type} • ${size}`;

    if (modalIconEl) {
      if (name.endsWith('.zip')) modalIconEl.textContent = '📦';
      else if (name.includes('Setup')) modalIconEl.textContent = '⚡';
      else modalIconEl.textContent = '🚀';
    }

    checkbox.checked = false;
    downloadBtn.disabled = true;
    labelWrap?.classList.remove('checked');

    modal.classList.add('open');
  }

  function closeModal() {
    modal.classList.remove('open');
  }

  // Attach triggers to all download buttons
  const triggers = document.querySelectorAll('.require-agreement-trigger');
  triggers.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const url = el.dataset.downloadUrl || 'https://github.com/yash245-code/Bodhi/releases/download/v1.0.0-beta.1/Bodhi%20Code%20Editor%20Setup%201.0.0-beta.1.exe';
      const name = el.dataset.downloadName || 'Bodhi Code Editor Setup 1.0.0-beta.1.exe';
      const type = el.dataset.downloadType || 'Windows Package';
      const size = el.dataset.downloadSize || '~104 MB';

      // Close dropdown if open
      const dropdown = document.getElementById('hero-dropdown-menu');
      if (dropdown) dropdown.classList.remove('show');

      openModal(url, name, type, size);
    });
  });

  // Checkbox toggle handler
  checkbox.addEventListener('change', () => {
    downloadBtn.disabled = !checkbox.checked;
    if (checkbox.checked) {
      labelWrap?.classList.add('checked');
    } else {
      labelWrap?.classList.remove('checked');
    }
  });

  // Execute download on accept
  downloadBtn.addEventListener('click', () => {
    if (!checkbox.checked || !pendingDownloadUrl) return;

    // Trigger download
    const link = document.createElement('a');
    link.href = pendingDownloadUrl;
    link.setAttribute('download', pendingDownloadName);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Provide visual confirmation
    const origText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span>✔ Starting Download...</span>';
    setTimeout(() => {
      closeModal();
      downloadBtn.innerHTML = origText;
    }, 1200);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
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
        navMenu.style.borderBottom = '1px solid rgba(0, 229, 153, 0.3)';
      }
    });
  }
}

/* ==========================================================================
   9. CLI & Package Manager Tab Switcher
   ========================================================================== */
function initCliTabs() {
  const cliTabs = document.querySelectorAll('.cli-tab-btn');
  const cliCmdText = document.getElementById('cli-cmd-text');
  const cliCopyBtn = document.getElementById('cli-copy-btn');

  if (!cliTabs.length || !cliCmdText || !cliCopyBtn) return;

  cliTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      cliTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cmd = tab.dataset.cmd;
      if (cmd) {
        cliCmdText.textContent = cmd;
        cliCopyBtn.dataset.clipboard = cmd;
      }
    });
  });

  cliCopyBtn.addEventListener('click', () => {
    const cmd = cliCopyBtn.dataset.clipboard || cliCmdText.textContent;
    navigator.clipboard.writeText(cmd).then(() => {
      const origSpan = cliCopyBtn.querySelector('span');
      if (origSpan) {
        const origText = origSpan.textContent;
        origSpan.textContent = 'Copied!';
        cliCopyBtn.style.background = 'var(--green-primary)';
        cliCopyBtn.style.color = '#07090e';
        setTimeout(() => {
          origSpan.textContent = origText;
          cliCopyBtn.style.background = '';
          cliCopyBtn.style.color = '';
        }, 2000);
      }
    });
  });
}

