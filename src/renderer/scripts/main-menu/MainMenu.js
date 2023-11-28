import Questions from "./Questions.js";

class MainMenu {
	static init(){
		console.log("Main menu initialised.");
		Questions.init();
	}
}

MainMenu.init();