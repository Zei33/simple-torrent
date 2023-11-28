const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("development", {
	compiling: callback => ipcRenderer.on("compiling", callback)
});

// Call window.loadView to initiate a window.showView event.
contextBridge.exposeInMainWorld("loadView", {
	mainMenu: (data = {}) => ipcRenderer.send("load-main-menu", data)
});

// Call window.showView to set action upon resolving a window.loadView event.
contextBridge.exposeInMainWorld("showView", {
	mainMenu: callback => ipcRenderer.on("show-main-menu", callback)
});