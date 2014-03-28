///////////////////////////////////////////////////////
// ERROR STRINGS FOR LOCALIZATION

var notFlash_ERROR = "只能转换 Actionscript 文档。";
var notSaved_ERROR = "没有复制未使用的库项目。要复制它们，请保存此 Actionscript 文档然后转换该文件。";
var noDOM_ERROR = "未打开任何有效文档。";
var conversion_SUCCESS = "创建了新的 HTML Canvas 文档。";

////////////////////////////////////////////////////////


var height;
var width;
var bgColor;
var frameRate;
var unusedItems;

var getKeyframes = function (layer) {
	var keyframes = [];
	for (var f in layer.frames) {
		if (f == layer.frames[f].startFrame) {
			keyframes.push({
				frame: layer.frames[f],
				index: f
			});
		}
	}
	return keyframes;
};

function scanTimeline(tl) {
	var timeLine = tl;
	var layers = timeLine.layers;

	for (var z = 0; z < layers.length; z++) {
		var frames = getKeyframes(layers[z]);
		for (var j = 0; j < frames.length; j++) {
			var ac = frames[j].frame.actionScript;

			if (ac != "") {

				var result = ac.match(/\/\/[ ]*\/\* js\s[^]*?\*\//g);

				if ('null' != result) {
					for (var k in result) {
						var arrayOfLines = result[k].split("\n");
						var toPasteArray = [];
						for (var l = 1; l < arrayOfLines.length - 1; l++) {
							toPasteArray.push(arrayOfLines[l].slice(2));
						}
						var modified_ac = toPasteArray.join("\n");
						frames[j].frame.actionScript = ac + "\n" + modified_ac;

					}

				}

			}

		}

	}

}

function convertAS(dom) {
	dom.currentTimeline = 0;
	scanTimeline(dom.getTimeline());
	var libraryItems = dom.library.items;
	for (var i = 0; i < libraryItems.length; i++) {
		item = libraryItems[i];
		if (item.itemType == 'movie clip') {
			scanTimeline(item.timeline);
		}
	}
}

fl.outputPanel.clear();

var dom = fl.getDocumentDOM();
if (!dom) {
	alert(noDOM_ERROR);
} else if (dom.type !== "Flash") {
	alert(notFlash_ERROR);
} else {
	convertFile();
}



function convertFile() {
	try {
		var filePath = dom.pathURI;
		height = dom.height;
		width = dom.width;
		bgColor = dom.backgroundColor;
		frameRate = dom.frameRate;
		var tls = dom.timelines;
		var sourceLibrary = dom.library.items;


		for (var j = 0; j < tls.length; j++) {
			var dom2 = fl.createDocument("htmlcanvas");
			var fileURL = fl.browseForFileURL("save", "Save File", "FLA document (*.fla)", "fla");

			if (fileURL == null) {
				//alert(nofilelocation_ERROR);
				return;
			}

			var fileSave_start = fl.saveDocument(dom2, fileURL);
			if (!fileSave_start) {
				//alert(nofilelocation_ERROR);
				return;
			}

			dom.editScene(j);
			var tl = dom.getTimeline();
			var fileName = tl.name;


			var m = tl.layerCount;
			tl.copyLayers(0, m - 1);
			dom2.width = width;
			dom2.height = height;
			dom2.backgroundColor = bgColor;
			dom2.frameRate = frameRate;
			var tl2 = dom2.getTimeline();
			tl2.pasteLayers();

			var unusedItems = [];

			var destLibrary = dom2.library;
			for (var sourceCount in sourceLibrary) {
				if (!destLibrary.itemExists(sourceLibrary[sourceCount].name)) {
					unusedItems.push(sourceLibrary[sourceCount]);
				}
			}

			var layerIndex = tl2.addNewLayer("unusedItem", "guide");

			for (var unusedCount in unusedItems) {
				dom2.addItem({
					x: 0,
					y: 0
				}, unusedItems[unusedCount]);
			}
			tl2.deleteLayer(layerIndex);



			convertAS(dom2);

			var fileSave = fl.saveDocument(dom2, fileURL);
			fl.closeDocument(dom2, false);
			if (!fileSave) {
				//alert(nofilelocation_ERROR);
				return;
			}
			fl.openDocument(fileURL);
		}
		fl.trace(conversion_SUCCESS);
	} catch (err) {
		fl.trace("ERROR : " + err);
	}

}
