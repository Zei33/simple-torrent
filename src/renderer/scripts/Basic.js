NodeList.prototype.addEventAll = function(event, callback, options = undefined){
	[...this].map(element => element.addEventListener(event, callback, options));
}