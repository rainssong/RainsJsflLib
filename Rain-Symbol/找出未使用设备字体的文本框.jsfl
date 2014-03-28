fl.outputPanel.clear();
main();

var doc;
var timeline;
var lib;
var log;
var log2;
var faces;
var autoChange = false;
var includeStatic = false;
var commonDic;
function main(){
	includeStatic = confirm("请确认：此次分析是否也包含静态文本？\n\t> 【确定】将分析全部文本\n\t> 【取消】不分析静态文本");
	autoChange = confirm("请确认：是否直接将所有的动态文本（含输入文本）设置为'使用设备字体'\n\t> 【确定】将直接替换\n\t> 【取消】只输出有问题的文本框名，没有实际修改");
	if(autoChange){
		autoChange = confirm("警告：会将所有文本设置为'使用设备字体'！");
	}
	
	faces = {};
	log = {};
	log2 = {};
	
	commonDic = {};
	commonDic["微软雅黑"] = true;
	commonDic["宋体"] = true;
	commonDic["_sans"] = true;
	commonDic["Times New Roman"] = true;
	
	doc = fl.getDocumentDOM();
	if(!doc){
		alert("错误，文档尚未打开");
		return -1;
	}
	
	lib = doc.library;
	
	var len = lib.items.length;
	
	for(var i = 0;i<len;i++){
		var item = lib.items[i];
		if(item.itemType == "font"){
			faces[item.font] = true;
		}
	}
	
	
	for(var i = 0;i<len;i++){
		var item = lib.items[i];
		if(item.itemType == "movie clip"||item.itemType == "button"){
			iden(item.timeline,item.name);
		}
	}
	
	fl.trace("当前定义以下字体为“常见字体”,如希望增加或删除，请修改jsfl");
	for(var s in commonDic){
		fl.trace(s);
	}
	fl.trace("---------------------------------------");
	fl.trace("以下是未使用设备字体的文本框");
	var flag = true;
	for(var s in log){
		flag = false;
		fl.trace(s);
	}
	if(flag){
		fl.trace("<无>");
	}else{
		if(autoChange){
			fl.trace("已将这些文本框设置为使用设备字体");
		}
	}
	fl.trace("---------------------------------------");
	fl.trace("以下是未使用常见字体的文本框");
	flag = true
	for(var s in log2){
		fl.trace(s);
		flag = false;
	}
	if(flag){
		fl.trace("<无>");
	}
}

function iden(timeline, itemName){
		var len_l = timeline.layers.length;
		for(var l = 0;l<len_l;l++){
			var frame = timeline.layers[l].frames[0];
			if(!frame){
				//只发生在图层是文件夹、特殊操作删除了全部帧等情况
				continue;
			}
			var len_e = frame.elements.length;
			
			for(var e = 0;e<len_e;e++){
				var elem = frame.elements[e];
				switch(elem.elementType){
					case "shape":
						idenGroup(elem, itemName);
						break;
					case "text":
						if(elem.fontRenderingMode != "device"){
							if(elem.textType == "static" && includeStatic){
								log["\t(静态)【"+itemName+"】包含了非设备字体文本框，呈现方式"+elem.fontRenderingMode+"，当前内容:"+elem.getTextString()] = true;
							}else{
								log["<!>\t【"+itemName+"】包含了非设备字体文本框，呈现方式"+elem.fontRenderingMode+"，当前内容:"+elem.getTextString()] = true;
							}
					
							if(autoChange){
								elem.fontRenderingMode = "device";
							}
						}
						var face = elem.getTextAttr("face");
						if(!commonDic[face] && face.charAt(face.length-1)!="*"){
							if(elem.textType == "static"){
								if(!faces[face]){
									log2["\t(静态)【"+itemName+"】使用了未嵌入的非常见字体["+face+"]，当前内容:"+elem.getTextString()] = true;
								}else{
									log2["\t(静态)【"+itemName+"】使用了已嵌入的非常见字体["+face+"]，当前内容:"+elem.getTextString()] = true;
								}
							}else{
								if(!faces[face]){
									log2["<!>\t【"+itemName+"】使用了未嵌入的非常见字体["+face+"]，当前内容:"+elem.getTextString()] = true;
								}else{
									log2["\t【"+itemName+"】使用了已嵌入的非常见字体["+face+"]，当前内容:"+elem.getTextString()] = true;
								}
							}
						}
						break;
					default:
						//如果出现视频、组件之类将会出现在这，不过一般不会出现
						break
				}
			}
		}
	return 0;
}

function idenGroup(elem, itemName){
	var len_m = elem.members.length;
	for(var m = 0;m<len_m;m++){
		var mem = elem.members[m];
		switch(mem.elementType){
			case "shape":
				if(mem.isGroup){
					idenGroup(mem,itemName);
				}
				break;
			case "text":				
				if(mem.fontRenderingMode != "device"){
					if(mem.textType == "static" && includeStatic){
						log["\t(静态)【"+itemName+"】包含了非设备字体文本框，呈现方式"+mem.fontRenderingMode+"，当前内容:"+mem.getTextString()] = true;
					}else{
						log["<!>\t【"+itemName+"】包含了非设备字体文本框，呈现方式"+mem.fontRenderingMode+"，当前内容:"+mem.getTextString()] = true;
					}
					
					if(autoChange){
						mem.fontRenderingMode = "device";
					}
				}
				var face = mem.getTextAttr("face");
				if(!commonDic[face]&& face.charAt(face.length-1)!="*"){
					if(mem.textType == "static"){
						if(!faces[face]){
							log2["\t(静态)【"+itemName+"】使用了未嵌入的非常见字体["+face+"]，当前内容:"+mem.getTextString()] = true;
						}else{
							log2["\t(静态)【"+itemName+"】使用了已嵌入的非常见字体["+face+"]，当前内容:"+mem.getTextString()] = true;
						}
					}else{
						if(!faces[face]){
							log2["<!>\t【"+itemName+"】使用了未嵌入的非常见字体["+face+"]，当前内容:"+mem.getTextString()] = true;
						}else{
							log2["\t【"+itemName+"】使用了已嵌入的非常见字体["+face+"]，当前内容:"+mem.getTextString()] = true;
						}
					}
				}
				break;
			default:
				//如果出现视频、组件之类将会出现在这，不过一般不会出现
				break
		}
	}
	return 0;
}