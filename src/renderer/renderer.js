// Development Tools
window.development.compiling((event, status) => {
	if (document.querySelector("compiling-status") == null){
		const element = document.createElement("compiling-status");
		document.body.prepend(element);
	}

	if (status) document.querySelector("compiling-status").classList.add("compiling")
	else document.querySelector("compiling-status").classList.remove("compiling");
});

// View Controllers
window.showView.mainMenu((event, view) => {
	document.querySelector("main").innerHTML = view.content;
	MainMenu.init();
});

// Initial menu load
window.loadView.mainMenu();