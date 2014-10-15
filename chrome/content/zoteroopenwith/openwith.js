Zotero.OpenWith = {
	DB: null,

	init: function () {
		// Connect to (and create, if necessary) zoteroopenwith.sqlite in the Zotero directory
		this.DB = new Zotero.DBConnection('zoteroopenwith');

		if (!this.DB.tableExists('changes')) {
			this.DB.query("CREATE TABLE changes (num INT)");
			this.DB.query("INSERT INTO changes VALUES (0)");
		}

		// Register the callback in Zotero as an item observer
		var notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item']);

		// Unregister callback when the window closes (important to avoid a memory leak)
		window.addEventListener('unload', function(e) {
				Zotero.Notifier.unregisterObserver(notifierID);
		}, false);
	},

	insertOpenWith: function() {
		var data = {
			title: "Zotero",
			company: "Fabian Raab",
			creators: [
				['Fabian', 'Raab', 'programmer']
			],
			version: '1.0',
			company: 'Fabian Raab',
			place: 'Munich, Germany',
			url: 'https://github.com/raabf/zotero-open-with'
		};
		Zotero.Items.add('computerProgram', data); // returns a Zotero.Item instance
	},

	openwith1: function() {
		Zotero.debug("OpenWith: run openwith1");
		//get first selected item
		var selected_items = ZoteroPane.getSelectedItems();
		var item = selected_items[0];

		if (item.isAttachment()) {
			Zotero.debug("OpenWith: item is attachment");
			this.openFileWithApp(item);
		}

		if (item.isRegularItem()) {
			// we could grab attachments:
			var att_ids = item.getAttachments(false);
			if (att_ids.length>1) exit(); // ba€ilout
			item_att=Zotero.Items.get(att_ids[0]);
			this.openFileWithApp(item_att);
		}


	},

	openFileWithApp: function(att) {
		var itempath = att.getFile().path;
		Zotero.debug("OpenWith: Path: " + itempath);

		// run Application
		var exeFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
		exeFile.initWithPath("C:\\Office\\PDF Annotator\\PDFAnnotator.exe");
		var parameter=itempath;

		if(exeFile.exists()){

			var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
			process.init(exeFile);
			process.run(false,[parameter],1);  // launch the executable with another file as parameter.
		}
	}
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.OpenWith.init(); }, false);
