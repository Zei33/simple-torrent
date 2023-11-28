import { app, BrowserWindow, ipcMain } from "electron";
import { Google, Listener } from "./classes/Google";
import Main from "./classes/Main";

// (async () => {
// 	const listener = await Google.credentials().then(credentials => new Listener(credentials));
// 	listener.record();
// })();

Main.init();