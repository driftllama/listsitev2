var allEls = document.getElementsByClassName("dateInput");
for(var i = 1; i <= allEls.length; i++) {
	allEls[i - 1].valueAsDate = new Date();
}