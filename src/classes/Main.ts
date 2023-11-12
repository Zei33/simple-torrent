import path from "node:path";

export default class Main {
	static app: Electron.App;
    static window: Electron.BrowserWindow | null;
    static BrowserWindow;
	static ipcMain: Electron.IpcMain;

    private static ready(){
        Main.window = new Main.BrowserWindow({ 
			width: 800, 
			height: 600, 
			webPreferences: { 
				preload: path.join(Main.app.getAppPath(), "preload/preload.js") 
			} 
		});
        Main.window.loadFile(path.join(Main.app.getAppPath(), "renderer/views/index.html"));
        Main.window.on('closed', Main.close);

		Main.window.webContents.openDevTools();

		Main.ipcMain.handle('ping', () => 'pong');
    }

	private static close(){
        Main.window = null;
    }

	private static windowsClosed(){
        if (process.platform !== 'darwin') Main.app.quit();
    }

    static init(app: Electron.App, browserWindow: typeof Electron.BrowserWindow, ipcMain: Electron.IpcMain){
        Main.BrowserWindow = browserWindow;
        Main.app = app;
        Main.app.on('window-all-closed', Main.windowsClosed);
        Main.app.on('ready', Main.ready);
		Main.ipcMain = ipcMain;
    }
}