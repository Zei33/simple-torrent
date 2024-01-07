import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import Store from "electron-store";

import ViewControl from "./ViewControl";
import Development from "./Development";

export default class Main {
	static app: Electron.App;
    static window: Electron.BrowserWindow | null;
	static ipcMain: Electron.IpcMain;
	static storage: Store;

	static init(){
        Main.app = app;
        Main.app.on('window-all-closed', Main.windowsClosed);
        Main.app.on('ready', Main.ready);
		Main.ipcMain = ipcMain;
		Main.storage = new Store();
    }

    private static ready(){
        Main.window = new BrowserWindow({ 
			width: 1000, 
			height: 800, 
			webPreferences: { 
				preload: path.join(Main.app.getAppPath(), `preload${path.sep}preload.js`) 
			} 
		});
        Main.window.loadFile(path.join(Main.app.getAppPath(), `renderer${path.sep}views${path.sep}index.html`));
        Main.window.on("closed", Main.close);
		ViewControl.init(Main.app, Main.window, Main.ipcMain);
		
		if (!Main.app.isPackaged){ 
			Main.window.webContents.openDevTools();
			Development.init(Main.window, Main.ipcMain);
			Main.window.webContents.on("did-finish-load", () => Development.sendCompilingStatus());
		}

		Main.registerStorageCommands();
    }

	private static close(){
        Main.window = null;
    }

	private static windowsClosed(){
        if (process.platform !== 'darwin') Main.app.quit();
    }

	private static registerStorageCommands(){
		Main.ipcMain.on("storage-set", (event, data) => Main.storage.set(data.key, data.value));
		Main.ipcMain.on("storage-get", (event, key) => Main.window.webContents.send(`storage-get-${key}`, Main.storage.get(key)));
	}
}