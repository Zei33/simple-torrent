const fs = require("fs");
const path = require("path");
const watch = require("watch");
const copyfiles = require("copyfiles");
const child_process = require("child_process");

const input = "src";
const output = "dist";
const vsDefaultSettings = { "editor.insertSpaces": false };

const action = (file, stat) => {
	if (stat.isFile()){
		if (path.extname(file) == ".ts"){
			return "typescript";
		}else{
			return "file";
		}
	}else if (stat.isDirectory()){
		return "folder";
	}else{
		return "unknown";
	}
}

const setCompiling = status => {
	if (status){
		const vsSettings = structuredClone(vsDefaultSettings);
		vsSettings["files.watcherExclude"] = { "dist": true, "dist/**": true, "dist/**/*": true };
		fs.writeFileSync("./.vscode/settings.json", JSON.stringify(vsSettings, 0, 2));
	}else{
		fs.writeFileSync("./.vscode/settings.json", JSON.stringify(vsDefaultSettings, 0, 2));
	}
	
	const supportInfo = JSON.parse(fs.readFileSync("./support/info.json"));
	supportInfo["compiling"] = status;
	fs.writeFileSync("./support/info.json", JSON.stringify(supportInfo, 0, 2));
}

const isCompiling = () => {
	return JSON.parse(fs.readFileSync("./support/info.json"))["compiling"];
}

const compileTypescript = file => {
	if (isCompiling()) return;
	console.log(`Compiling typescript file (${file}).`);
	setCompiling(true);

	child_process.exec(`npm run build`, () => {
		setCompiling(false);
		console.log(`Finished compiling typescript (${file}).`);
	});
}

const copyFile = file => {
	console.log(`Copying a file (${file}).`);
	const target = path.dirname(file).replace(new RegExp(`^${input}`), output);
	copyfiles([file, target], { up: true }, () => {
		console.log(`Finished copying a file (${file}).`);
	});
}

watch.createMonitor(input, monitor => {
	monitor.on("created", (file, stat) => {
		try {
			switch(action(file, stat)){
				case "typescript": compileTypescript(file); break;
				case "file": copyFile(file); break;
				default: null;
			}
		} catch {
			setCompiling(false);
		}
	});

	monitor.on("changed", (file, currentStat, previousStat) => {
		try {
			switch(action(file, currentStat)){
				case "typescript": compileTypescript(file); break;
				case "file": copyFile(file); break;
				default: null;
			}
		} catch {
			setCompiling(false);
		}
	});

	monitor.on("removed", (file, stat) => {
		try {
			compileTypescript(file);
		} catch {
			setCompiling(false);
		}
	});
});

setCompiling(false);