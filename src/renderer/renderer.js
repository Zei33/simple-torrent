window.development.compiling((_event, status) => {
	if (status) document.querySelector("#compiling-status").classList.add("compiling")
	else document.querySelector("#compiling-status").classList.remove("compiling");
});