import * as vscode from 'vscode';
import fs from 'node:fs';
import path from 'node:path';

export function activate(context: vscode.ExtensionContext) {
	if(vscode.workspace.workspaceFolders !== undefined) {
		let wf = vscode.workspace.workspaceFolders[0].uri.path;
		const infoPath = path.join(wf, `support${path.sep}info.json`);
		if (fs.existsSync(infoPath)){
			fs.watch(infoPath, (eventType, file) => {console.log("FILE CHANGE");
				const compiling = JSON.parse(fs.readFileSync(infoPath, "utf-8"))["compiling"];
				console.log(compiling);
				if (!compiling) vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer");
			});
		}
	} 
}

// This method is called when your extension is deactivated
export function deactivate() {}
