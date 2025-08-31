const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  fetchStockItems: () => ipcRenderer.invoke('fetch-stock-items')
});
