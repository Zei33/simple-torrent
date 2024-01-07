class MainMenu {
	static init(){
		Questions.askFirstLanguage();
	}
}

class Questions {
	static languages = [
		{ code: "vn", flag: "vietnam", font: "vietnamese", label: "tiếng Việt" },
		{ code: "en", flag: "britain2", font: "english", label: "English" },
		{ code: "jp", flag: "japan", font: "japanese", label: "日本語" }
	];

	static setQuestionText(content){
		const questionElement = document.querySelector(`#menu-question`);
		const questionContentElement = document.createElement("div");
		questionContentElement.classList.add("lead", "mb-3");
		questionContentElement.textContent = content;
		questionElement.appendChild(questionContentElement);
	}

	static askFirstLanguage(){
		this.setQuestionText(`What is your first language?`);

		const optionsElement = document.querySelector(`#menu-options`);
		for (const language of this.languages){
			let containerElement = document.createElement("div");
			containerElement.classList.add("option", "text-center", "mx-1");
			containerElement.setAttribute("language-code", language.code);
			optionsElement.appendChild(containerElement);

			let flagRestrictorElement = document.createElement("div");
			flagRestrictorElement.classList.add("flag-restrictor", "md");
			containerElement.appendChild(flagRestrictorElement);

			let flagElement = document.createElement("flag");
			flagElement.classList.add(language.flag, "md");
			flagRestrictorElement.appendChild(flagElement);

			let labelElement = document.createElement("div");
			labelElement.classList.add(language.font);
			labelElement.textContent = language.label;
			containerElement.appendChild(labelElement);
		}
		
		this.bindFirstLanguageOptions(document.querySelectorAll(`#menu-options > .option`));
	}

	static bindFirstLanguageOptions(elements){
		elements.addEventAll("click", async function(event){
			this.classList.add("clicked");
			setTimeout(() => this.classList.remove("clicked"), 150);
			
			window.storage.set("firstLanguage", this.getAttribute("language-code"));
		})
	}
}