const { contextBridge, ipcRenderer } = require('electron');

// ─── Expose Native PC APIs to React app ──────────────────────
// All IPC calls are safely bridged through contextIsolation

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close:    () => ipcRenderer.send('window-close'),

  // PC File System
  createFile:    (args) => ipcRenderer.invoke('pc-create-file',    args),
  listFiles:     ()     => ipcRenderer.invoke('pc-list-files'),
  openExplorer:  (args) => ipcRenderer.invoke('pc-open-explorer',  args),
  saveDialog:    (args) => ipcRenderer.invoke('pc-save-dialog',    args),

  // PC Power Management
  shutdown:        (args) => ipcRenderer.invoke('pc-shutdown',        args),
  cancelShutdown:  ()     => ipcRenderer.invoke('pc-cancel-shutdown'),

  // Apps & URL
  openURL:         (args) => ipcRenderer.invoke('pc-open-url',        args),
  runSafeCommand:  (args) => ipcRenderer.invoke('pc-run-safe-command', args),

  // System Info
  systemInfo: () => ipcRenderer.invoke('pc-system-info'),

  // Environment flag
  isElectron: true,
  platform: process.platform,
});
