const fs = require("fs");
const path = require("path");
const watch = require("watch");
const copyfiles = require("copyfiles");
const child_process = require("child_process");

const input = "src";
const output = "dist";
const ignore = ".DS_Store";

const action = file => {
	const stat = fs.statSync(file);
	const extension = path.extname(file);
	if (stat.isFile()){
		if (ignore.includes(path.basename(file))){
			return "ignore";
		}else if (extension == ".ts"){
			return "typescript";
		}else if (extension == ".scss"){
			return "sass";
		}else if (extension == ".DS_Store"){
			return "trash";
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
	const supportInfo = JSON.parse(fs.readFileSync(`.${path.sep}support${path.sep}info.json`));
	supportInfo["compiling"] = status;
	fs.writeFileSync("./support/info.json", JSON.stringify(supportInfo, 0, 2));
}

const isCompiling = () => {
	return JSON.parse(fs.readFileSync(`.${path.sep}support${path.sep}info.json`, "utf-8"))["compiling"];
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

fs.watch(input, { recursive: true }, (eventType, file) => {
	file = path.join(input, file);
	if (fs.existsSync(file)){
		switch(action(file)){
			case "typescript": compileTypescript(file); break;
			case "file": copyFile(file); break;
			default: null;
		}
	}else{
		compileTypescript(file);
	}
});

console.log(`Watching for file changes...`);
setCompiling(false);