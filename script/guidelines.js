var version="30";

function titleToPathFrag (title) {
	return title.toLowerCase().replace(/[\s,]+/g, "-").replace(/[\(\)]/g, "");
}

function findHeading(el) {
	return el.querySelector('h1') || el.querySelector('h2') || el.querySelector('h3') || el.querySelector('h4') || el.querySelector('h5') || el.querySelector('h6');
}

function findFirstTextChild(el) {
	var children = el.childNodes;
	for (i = 0; i < children.length; i++) {
		if (children[i].nodeType == 3) {
			return children[i];
			break;
		}
	}
}

function textNoDescendant(el) {
	var textContent = "";
	el.childNodes.forEach(function(node) {
		if (node.nodeType == 3) textContent += node.textContent;
	})
	return textContent;
}

function linkHowTo() {
	var howtoBaseURI = "https://www.w3.org/WAI/GL/WCAG3/2020/how-tos/";
	//if (respecConfig.specStatus == "ED") understandingBaseURI = "../../understanding/";
	//else understandingBaseURI = "https://www.w3.org/WAI/WCAG" + version + "/Understanding/";
	document.querySelectorAll('.guideline').forEach(function(node){
		//this is brittle, depends on how respec does the heading
		var heading = textNoDescendant(findHeading(node));
		var pathFrag = titleToPathFrag(heading);
		var el = document.createElement("p");
		el.setAttribute("class", "howto-link");
		el.innerHTML = "<a href=\"" + howtoBaseURI + pathFrag + "/\">" + heading + " <span>how-to</span></a>";
		node.insertBefore(el, node.querySelector('section'));
	})
}

function addGuidelineMarkers() {
	document.querySelectorAll('.guideline').forEach(function(node){
		var guidelineHeader = findHeading(node);
		guidelineHeader.innerHTML = "<span class=\"inserted\">Guideline: </span>" + guidelineHeader.innerHTML;
	})
}

function addOutcomeMarkers() {
	document.querySelectorAll('.outcome').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var outcomeHeader = findHeading(node);
		outcomeHeader.innerHTML = "<span class=\"inserted\">" + textNoDescendant(parentHeader) + " outcome: </span>" + outcomeHeader.innerHTML;
	})
}

function addMethodMarkers() {
	document.querySelectorAll('.methods').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var methodHeader = node.querySelector('summary');
		methodHeader.innerHTML = "Methods for <q>" + textNoDescendant(parentHeader).toLowerCase() + "</q>";
	})
}

function addFailureMarkers() {
	document.querySelectorAll('.failures').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var failureHeader = node.querySelector('summary');
		failureHeader.innerHTML = "Critical failures for <q>" + textNoDescendant(parentHeader).toLowerCase() + "</q>";
	})
}

function addRatingMarkers() {
	document.querySelectorAll('.rating').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var sectionHeader = node.querySelector('summary');
		sectionHeader.innerHTML = "Rating for <q>" + textNoDescendant(parentHeader).toLowerCase() + "</q>";
		
		var caption = node.querySelector('caption');
		caption.innerHTML = "Rating scale for <q>" + textNoDescendant(parentHeader).toLowerCase() + "</q>";
	})
}

function addSummaryMarkers() {
	document.querySelectorAll('.summary').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var summaryHeader = node.querySelector('summary');
		summaryHeader.innerHTML = "Simplified summary for " + textNoDescendant(parentHeader);
		
		var el = document.createElement("p");
		el.className = "summaryEnd";
		el.innerHTML = "~ End of summary for " + textNoDescendant(parentHeader) + " ~";
		node.appendChild(el);
		
		node.setAttribute("role", "region");
	})
}

function termTitles() {
	// put definitions into title attributes of term references
	document.querySelectorAll('.internalDFN').forEach(function(node){
		node.title = document.querySelector(node.href.substring(node.href.indexOf('#'))).parentNode.nextElementSibling.firstElementChild.textContent.trim().replace(/\s+/g,' ');
	});	
}

function removeDraftMethodLinks() {
	document.querySelectorAll('.method-link').forEach(function(node){
		uri = node.href;
		if (!uri.startsWith("https://www.w3.org")) {
			node.parentElement.innerHTML = node.textContent;	
		}
	});
}
// scripts before Respec has run
function preRespec() {
	addGuidelineMarkers();
	linkHowTo();
	addOutcomeMarkers();
	addMethodMarkers();
	addFailureMarkers();
	addRatingMarkers();
	addSummaryMarkers();
}

// scripts after Respec has run
function postRespec() {
	termTitles();
	removeDraftMethodLinks();
}
