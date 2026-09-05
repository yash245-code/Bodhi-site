# Cortex v1.0.0 — Initial Stable Release

## 🚀 Welcome to Cortex v1.0.0

**Cortex** is a next-generation lightweight, high-performance desktop code editor and AI-ready IDE engineered by **BUIMB Research**. Built on Electron, React 18, TypeScript, Monaco Editor, and native `node-pty` terminal streaming, Cortex delivers blazing speed with strict user privacy and zero hidden telemetry.

---

## 🏷️ Release Metadata & Labels

| Field | Value |
|---|---|
| **Tag Version** | `v1.0.0` |
| **Release Title** | `Cortex v1.0.0 — Initial Stable Release` |
| **Target Branch** | `main` |
| **Release Labels** | `release`, `v1.0.0`, `stable`, `windows-x64`, `electron`, `monaco`, `buimb-research` |

---

## ✨ Key Highlights & Features

### ⚡ 1. High-Precision Monaco Editor Core
- Powered by the Monaco Editor engine (`@monaco-editor/react`) with custom `cortex-dark` syntax highlighting.
- Syntax support for **25+ programming languages** (TypeScript, JavaScript, Python, Rust, Go, HTML, CSS, JSON, Markdown, and more).
- Multi-cursor editing, minimap, bracket colorization, dirty buffer indicators (`●`), and active breadcrumb navigation.

### 🖥️ 2. Integrated Native Terminal (xterm.js + node-pty)
- Built-in dockable terminal powered by `xterm.js` and `FitAddon`.
- Direct native pseudo-terminal execution (`node-pty`) streaming PowerShell and WSL with zero input latency.
- Graceful interactive fallback mechanism ensuring compatibility across all Windows environments.
- Quick clear and terminal session controls.

### 📂 3. Dynamic File Explorer & Live Chokidar Sync
- Complete project workspace folder and file tree view.
- Real-time disk synchronization powered by `chokidar` in the Electron main process.
- Changes made externally on disk reflect instantly in the workspace tree without manual reloads.
- Inline file & folder creation, renaming, and deletion.

### 🛡️ 4. Sovereign Privacy & 100% Local Execution
- **Zero Hidden Telemetry**: Cortex does not track, scrape, or transmit source code or keystrokes.
- **Direct AI Connectivity**: AI assistant features connect directly to your specified API provider using your own API key with no BUIMB intermediary proxy servers.
- **Process Isolation**: Strict security boundary (`contextIsolation: true`, `nodeIntegration: false`) exposing only type-safe IPC channels via `window.cortexAPI`.

### 📜 5. BUIMB Terms & Conditions Integration
- Built-in **License Agreement & Terms** screen inside the Windows installer and in-app Help menu.
- Released under a permissive open-source license grant.

---

## ⌨️ Default Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>Ctrl</kbd> + <kbd>S</kbd> | Save active file |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> | Save all open files |
| <kbd>Ctrl</kbd> + <kbd>W</kbd> | Close active tab |
| <kbd>Ctrl</kbd> + <kbd>`</kbd> | Toggle integrated terminal dock |
| <kbd>Ctrl</kbd> + <kbd>B</kbd> | Toggle file explorer sidebar |
| <kbd>Ctrl</kbd> + <kbd>O</kbd> | Open single file dialog |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>O</kbd> | Open workspace folder dialog |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> | Open Command Palette |

---

## 📦 Distribution Packages & Assets

Attach these 3 files from `c:\Users\rawat\BUIMB Projects\Cortex\dist\`:

| Asset | Format | Size | Description |
|---|---|---|---|
| **`Cortex Setup 1.0.0.exe`** | NSIS Installer | ~104.7 MB | Full Windows installer with Start Menu & desktop shortcuts |
| **`Cortex-1.0.0-win-x64.zip`** | ZIP Archive | ~103.3 MB | Standalone portable package (extract and run) |
| **`Cortex 1.0.0.exe`** | Portable Binary | ~104.2 MB | Single executable, zero installation required |

---

## 🔧 System Requirements

- **Operating System**: Windows 10 / Windows 11 (64-bit)
- **Processor**: 64-bit Intel / AMD CPU (1.6 GHz or faster)
- **Memory (RAM)**: 2 GB minimum (4 GB recommended)
- **Disk Space**: ~250 MB free space

---

**Full Changelog**: https://github.com/yash245-code/Cortex/commits/v1.0.0
