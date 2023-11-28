import fs from "node:fs";
import path from "node:path";

export default class ViewControl {
	static app: Electron.App;
	static ipcMain: Electron.IpcMain;
	static window: Electron.BrowserWindow;

	static viewPath: string;
	
	static init(app: Electron.App, window: Electron.BrowserWindow, ipcMain: Electron.IpcMain){
		ViewControl.app = app;
		ViewControl.ipcMain = ipcMain;
		ViewControl.window = window;

		ViewControl.viewPath = path.join(ViewControl.app.getAppPath(), `renderer${path.sep}views`);

		ViewControl.registerView("main-menu", ViewControl.loadMainMenu);
	}

	static registerView(view, callback){
		console.log(`Registering view ${view}.`);
		ViewControl.ipcMain.on(`load-${view}`, (event, data) => {
			console.log(`Loading view ${view}.`);
			ViewControl.window.webContents.send(`show-${view}`, { content: callback(data) });
		});
	}

	static loadMainMenu(data){
		const content = fs.readFileSync(path.join(ViewControl.viewPath, `main-menu.html`), "utf-8");
		return content;
	}
}