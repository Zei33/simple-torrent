import fs from "node:fs";
import path from "node:path";

export default class Development {
	static ipcMain: Electron.IpcMain;
	static window: Electron.BrowserWindow;
	static infoPath: string = path.join(process.cwd(), `support${path.sep}info.json`);

	private static getInfo = () => JSON.parse(fs.readFileSync(Development.infoPath, "utf-8"));

	static init(window: Electron.BrowserWindow, ipcMain: Electron.IpcMain){console.log("Starting DEV");
		Development.ipcMain = ipcMain;
		Development.window = window;
		
		fs.watch(Development.infoPath, (eventType, filename) => {console.log("File changed " + eventType);console.log(Development.getInfo());
			Development.window.webContents.send("compiling", Development.getInfo().compiling);
		});
	}
}