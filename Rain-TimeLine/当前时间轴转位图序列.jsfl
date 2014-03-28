/**
*@author
*	General_Clarke
*@data
*	since 2012-4-1
*	lastUpdate 2012-4-19
*@version
*	2.1.0 release
*@history
*	2012-4-19:
*		可选择留空模式，支持尺寸统一、左上对齐和最小区域
*	2012-4-13:
*		支持遮罩层，支持跳过空白、重复帧
*	2012-4-2:
*		利用新文档暂时容纳矢量图，可以不破坏原文档结构，可以在新文档中补间转逐帧
*	
*/

//下版本可能加入人工设置留空大小的功能。
//如对此工具有何反馈，或希望添加什么功能，请于此处跟帖 http://bbs.9ria.com/viewthread.php?tid=120818

fl.outputPanel.clear();

main();
function main(){
	var oldDom = fl.getDocumentDOM();	
	if(!oldDom){
		alert("请参考以下步骤：\r    >打开要导出的文件\r    >切换到要导出的时间轴\r    >运行此文件");
		return;
	}
	var document = oldDom;
	var timeline = document.getTimeline();
	var len = timeline.frameCount;
	
	var flURI = fl.getDocumentDOM().pathURI
	var tmp1 = flURI.split("/");
	tmp1.pop();
	fl.trace("位图批量导出  @author:General_Clarke");
	fl.trace("=============================");
	fl.trace("说明：此脚本会将当前正在编辑的时间轴上每帧转换成一张PNG位图");
	fl.trace("这些位图通过保留一部分透明区域的办法进行自动对齐，但剪裁到透明区最小");
	fl.trace("如果希望输出固定大小的PNG，请给源配上一个该大小的透明矩形作为背景");
	fl.trace("不会导出隐藏图层");
	fl.trace("=============================");
	var tmp2 = tmp1.join("/");
	var iniURI = tmp2+"/targetURI.ini";
	if(!FLfile.exists(iniURI)){
		targetFolder = fl.browseForFolderURL("首次为该FL导出图片，选择导出文件夹"); 
		if(!targetFolder){
			fl.trace("已取消");
			return;
		}
		FLfile.write(iniURI,targetFolder);
	}else{
		targetFolder = FLfile.read(iniURI);		
	}
	
	fl.trace("正在使用目标文件夹位置"+targetFolder);
	fl.trace("如果希望改换，请修改或删除与源fla同文件夹的targetURI.ini文件");
	var isSingleFrame = false;
	
	var xmlURI = "file:///_PanelOutput.xml"
	if(timeline.frameCount>1){
		var xml_pre = "请输入前缀"
		var xml_type = "导出动画序列"
	}else{
		var xml_pre = "请输入文件名"
		var xml_type = "导出单张图片"
		isSingleFrame = true;
	}
	var xml =   '<?xml version="1.0" ?>'+
	'<dialog title="'+xml_type+'" buttons="accept,cancel">'+
	'<label value="'+xml_pre+'"/>'+
	'<textbox id="name" value="'+timeline.name+'" width="250"/> '+
	'<radiogroup id="radio">'+
	'<radio value="1" label="尺寸统一，四边留出透明区域进行对齐" />'+
	'<radio value="2" label="左上对齐，仅在左上方留出透明区域" />'+
	'<radio value="3" label="最小区域，不考虑对齐使透明区域最小" />'+
	'</radiogroup>'+
	'<separator/>'+
	'<checkbox id="cmask" label="计算遮罩/被遮罩层大小" checked="true"/> '+
	'<checkbox id="cguide" label="计算引导/被引导层大小" checked="true"/> '+
	'<checkbox id="jumpEmptys" label="跳过重复帧" checked="true"/>'+
	'<checkbox id="exportEmptys" label="为无图帧导出一张空白图" checked="false"/>'+
	'</dialog>'
	FLfile.write(xmlURI,xml);
	var info = document.xmlPanel(xmlURI);
	FLfile.remove(xmlURI);
	
	prefix = info.dismiss
	if(prefix=="cancel"){
		fl.trace("已取消");
		return;
	}
	prefix = info.name;
	var c_mask = info.cmask
	var c_guide = info.cguide
	var jumpEmptys = info.jumpEmptys
	var exportEmptys = info.exportEmptys;
	var mode = Number(info.radio);
	
	var states = [];
	for(var l = 0;l<timeline.layers.length;l++){
		timeline.setSelectedLayers(l,true);
		var type = timeline.getLayerProperty('layerType');
		states[l] = [type,timeline.getLayerProperty("visible"),timeline.getLayerProperty("locked")];
	}



	timeline.setSelectedLayers(0,true);
	for(var l = 1;l<timeline.layers.length;l++){
		timeline.setSelectedLayers(l,false);
	}
	timeline.copyFrames();
	
	
	var newDom=fl.createDocument();
	document = newDom;

	timeline = document.getTimeline();
	timeline.pasteFrames(0,0);
	var emptys = [];
	for(var f = 0;f<timeline.frameCount;f++){
		var empty = true;
		for(var l = 0;l<timeline.layers.length;l++){
			var layer = timeline.layers[l];
			timeline.setSelectedLayers(l,true);
			timeline.setSelectedFrames(f,f,true);
			var frame = layer.frames[f];
			empty = false;
			if(f != frame.startFrame){
				if(frame.tweenType=="none"){
					empty = true
				}
			}
			if(empty == false){
				break;
			}
		}
		emptys[f] = empty;
	}

	timeline.setSelectedLayers(0,true);
	for(var l = 1;l<timeline.layers.length;l++){
		timeline.setSelectedLayers(l,false);
	}
	timeline.setLayerProperty("locked",false,"all");
	timeline.convertToKeyframes();
	
	var flag
	flag = c_mask
	for(var l = 0;l<timeline.layers.length;l++){
		timeline.setSelectedLayers(l,true);
		if(timeline.getLayerProperty("layerType")=="mask"||timeline.getLayerProperty("layerType")=="masked"){
			timeline.setLayerProperty("locked",!flag);
		}
	}
	flag = c_guide
	for(var l = 0;l<timeline.layers.length;l++){
		timeline.setSelectedLayers(l,true);
		if(timeline.getLayerProperty("layerType")=="guide"||timeline.getLayerProperty("layerType")=="guided"){
			timeline.setLayerProperty("locked",!flag);
		}
	}

	timeline.setSelectedLayers(0,true);
	for(var l = 1;l<timeline.layers.length;l++){
		timeline.setSelectedLayers(l,false);
	}
	
	
	
	var globalLeft = 9999;
	var globalTop = 9999;
	var globalRight = -9999;
	var globalBottom = -9999;

	var multiLayer = false;
	if(timeline.layers.length>1){
		multiLayer = true;
	}
	var frameLefts = [];
	var frameRights = [];
	var frameTops = [];
	var frameBottoms = [];
	for(var i = 0;i<len;i++){
		document.selectNone();
		timeline.setSelectedFrames(i,i);
		document.selectAll();
		var arr = document.selection;
		var lenj = arr.length;
		var frameLeft = 9999;
		var frameTop = 9999;
		var frameRight = -9999;
		var frameBottom = -9999;
		for(var j = 0;j<lenj;j++){
			var target = arr[j];

			if(target.left<frameLeft){
				frameLeft = Math.floor(target.left);
			}
			if(target.top<frameTop){
				frameTop = Math.floor(target.top);
			}
			if(target.left+target.width>frameRight){
				frameRight = target.left+target.width;
			}
			if(target.top+target.height>frameBottom){
				frameBottom = target.top+target.height;
			}
		}
		frameLefts[i] = frameLeft;
		frameRights[i] = frameRight;
		frameTops[i] = frameTop;
		frameBottoms[i] = frameBottom;
		
		
		if(frameLeft<globalLeft){
			globalLeft = frameLeft
		}
		if(frameTop<globalTop){
			globalTop = frameTop;
		}
		if(frameRight>globalRight){
			globalRight = frameRight;
		}
		if(frameBottom>globalBottom){
			globalBottom = frameBottom;
		}
	}
	
	if(globalLeft == 9999){
		alert("错误：在全部帧中找不到任何可用来计算大小的图片");
		document.close(false);
		fl.setActiveWindow(oldDom,true);
		return;
	}
	var w1 = globalRight-globalLeft;
	var h1 = globalBottom-globalTop;
	
	
	var profile = new XML(document.exportPublishProfileString());
	profile.@name = 'Game';
	profile.PublishFormatProperties.png = 1;
	profile.PublishFormatProperties.flash = 0;
	profile.PublishFormatProperties.generator = 0;
	profile.PublishFormatProperties.projectorWin = 0;
	profile.PublishFormatProperties.projectorMac = 0; 
	profile.PublishFormatProperties.html = 0;
	profile.PublishFormatProperties.gif = 0; 
	profile.PublishFormatProperties.jpeg = 0;
	profile.PublishFormatProperties.qt = 0; 
	profile.PublishFormatProperties.rnwk = 0; 

	profile.PublishPNGProperties.@enabled = 'true';
	profile.PublishPNGProperties.Width = 500; 
	profile.PublishPNGProperties.Height = 500; 
	profile.PublishPNGProperties.Interlace = 0;
	profile.PublishPNGProperties.Transparent = 1;
	profile.PublishPNGProperties.Smooth = 1; 
	profile.PublishPNGProperties.DitherSolids = 0;
	profile.PublishPNGProperties.RemoveGradients = 0;
	profile.PublishPNGProperties.MatchMovieDim = 0;
	profile.PublishPNGProperties.DitherOption = 'None'; 
	profile.PublishPNGProperties.FilterOption = 'None';
	profile.PublishPNGProperties.BitDepth = '24-bit with Alpha'; 

	setDocumentSize(document,profile,Math.ceil(w1+1),Math.ceil(h1+1));
	
	timeline.setSelectedLayers(0,true);
	for(var l = 1;l<timeline.layers.length;l++){
		timeline.setSelectedLayers(l,false);
	}

	var index = 0;
	var skips = 0;
	for(var i = 0;i<len;i++){
		if(jumpEmptys){
			if(emptys[i]){
				skips++
				continue
			}
		}
		timeline.setLayerProperty("locked",false,"all");
		
		document.selectNone();
		timeline.setSelectedFrames(i,i);
		document.selectAll();

		var arr = document.selection;
		var lenj = arr.length;
		
		if(lenj == 0){
			if(!exportEmptys){
				skips++;
				continue;
			}
		}
		if(mode == 1){
			for(var j = 0;j<lenj;j++){
				var target = arr[j];
				target.x-=globalLeft;
				target.y-=globalTop;
			}
		}else if(mode == 2){
			for(var j = 0;j<lenj;j++){
				var target = arr[j];
				target.x-=globalLeft;
				target.y-=globalTop;
			}
		}else if(mode == 3){
			for(var j = 0;j<lenj;j++){
				var target = arr[j];
				target.x-=frameLefts[i];
				target.y-=frameTops[i];
			}
		}
		for(var l = 0;l<timeline.layers.length;l++){
			timeline.setSelectedLayers(l,true);
			timeline.setLayerProperty("locked",states[l][2]);
		}
		index++;
		if(isSingleFrame){
			var id = "";
		}else{
			var id = "000"+index;
			id = id.substr(-4);
			id = "_"+id;
		}
		if(mode == 1){
			
		}else if(mode == 2){
			setDocumentSize(document,profile,Math.ceil(frameRights[i]-globalLeft+1),Math.ceil(frameBottoms[i]-globalTop+1));
		}else if(mode == 3){
			setDocumentSize(document,profile,Math.ceil(frameRights[i]-frameLefts[i]+1),Math.ceil(frameBottoms[i]-frameTops[i]+1));
		}
		document.exportPNG(targetFolder+"/"+prefix+id+".png",false,true);
	}

	document.close(false);
	fl.setActiveWindow(oldDom,true);
	
	if(skips){
		fl.trace("输出结束，跳过了"+skips+"个空白/重复帧");
	}
}
function setDocumentSize(document,profile,width,height){
	document.width = width;
	document.height = height;
	profile.PublishPNGProperties.Width = width; 
	profile.PublishPNGProperties.Height = height;
	if (document.publishProfiles.indexOf('Game') != -1) {
		document.currentPublishProfile = 'Game';   
		document.deletePublishProfile();
	}
	document.addNewPublishProfile('Game');
	document.importPublishProfileString(profile); 
}