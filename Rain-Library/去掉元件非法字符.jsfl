
 var items = fl.getDocumentDOM().library.items;
 var itemNum = items.length;
 for (var i = 0; i < itemNum; i++) {
   	var name = items[i].name;
	name = name.slice(name.lastIndexOf("/") +1);
   	name = name.replace("<","");	
	name = name.replace(">","");
	name = name.replace("_","");
	name = name.replace("-","");
	items[i].name = name ;
	
 }
 fl.trace("All invalid library item names are renamed.");