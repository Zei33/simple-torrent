const { app, BrowserWindow, ipcMain, desktopCapturer } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const google = require("./import/google");

let listener = null;
google.credentials().then(() => listener = new google.Listener());

const mainWindow = app
.on("ready", async () => {
	const window = new BrowserWindow({ width: 800, height: 600, webPreferences: { preload: path.join(__dirname, "preload.js") } });
	window.loadFile("views/index.html");
	window.webContents.openDevTools();

	ipcMain.handle('ping', () => 'pong');

	return window;
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
