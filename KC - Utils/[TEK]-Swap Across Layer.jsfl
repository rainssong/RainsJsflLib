﻿var doc=fl.getDocumentDOM();
if(!doc) {
	alert("Please open a file before using the Swap Symbol Accross Layer command");
} else {
	
	var lib=doc.library;
	
	var sellib=lib.getSelectedItems()[0];
	
	if(doc.selection.length!=1 || lib.getSelectedItems().length!=1){
		alert("In order to use Swap Symbol Across Layer, you must select an instance on stage and a library item to swap it with. You may have no more than one stage element and one library item selected. Be sure there are no other items on each frame of the layer other than the instance of the symbol, otherwise, Swap Symbol Across Layer will fail.");
	}else{
		var tl=doc.getTimeline();
		var fselframe=tl.getSelectedFrames();
		var selitem=doc.selection[0].libraryItem.name;
		var selitemname=doc.selection[0].name;
		var sellib=lib.getSelectedItems()[0];
		var lay=tl.layers[tl.currentLayer];
		var frs=lay.frames;
		
		//save layer locks
		var slay=new Array();
		for(var i=0;i<tl.layers.length;i++){
			slay.push(tl.layers[i].locked);
		}
		
		tl.setLayerProperty("locked",true,"others");
		tl.setLayerProperty("locked",false,"selected");
		

		for(var i=0;i<frs.length;i++){
			var fr=frs[i];
			if(fr.elements.length>1){
				alert("There is more than one item on the frame "+(i+1)+". Swap Symbol Across Layer only works with layers containing one instance across frames.");
				break;
			}else{
				if(fr.elements.length>0){
					var el=fr.elements[0];
					var symbolname=el.libraryItem.name;
					doc.selectNone();
					if(selitem==symbolname && fr.startFrame==i){
						tl.setSelectedFrames(i,i+1);
						doc.selectAll();
						doc.setElementProperty("name",selitemname);
						doc.swapElement(sellib.name);
					}
				}
			}
		}
		
		for(var i=0;i<slay.length;i++){
			tl.setSelectedLayers(i,i);
			tl.setLayerProperty("locked",slay[i],"selected");
		}
		
		tl.setSelectedFrames(fselframe,fselframe+1);
	
	}
}
