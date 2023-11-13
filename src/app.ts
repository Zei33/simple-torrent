import { app, BrowserWindow, ipcMain } from "electron";
import { Google, Listener } from "./classes/google";
import Main from "./classes/Main";

// (async () => {
// 	const listener = await Google.credentials().then(credentials => new Listener(credentials));
// 	listener.record();
// })();

Main.init(app, BrowserWindow, ipcMain);