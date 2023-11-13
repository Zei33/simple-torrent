const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("development", {
	compiling: callback => ipcRenderer.on("compiling", callback)
});