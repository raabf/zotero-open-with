// Only create main object once
if (!Zotero.OpenWith) {
	let loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
					.getService(Components.interfaces.mozIJSSubScriptLoader);
	loader.loadSubScript("chrome://zoteroopenwith/content/openwith.js");
}
