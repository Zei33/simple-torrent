// Development Tools
window.development.compiling((_event, status) => {
	if (document.querySelector("compiling-status") == null){
		const element = document.createElement("compiling-status");
		document.body.prepend(element);
	}

	if (status) document.querySelector("compiling-status").classList.add("compiling")
	else document.querySelector("compiling-status").classList.remove("compiling");
});

// View Controllers
window.showView.mainMenu((_event, view) => {
	document.querySelector("main").innerHTML = view.content;
});

// Initial menu load
window.loadView.mainMenu();