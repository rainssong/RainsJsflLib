/***
批量元件转位图 版本:v1.0
简要说明:这家伙很懒什么都没写
创建人:ZЁЯ¤  身高:168cm+;体重:57kg+;未婚(已有女友);最爱的运动:睡觉;格言:路见不平,拔腿就跑;QQ:358315553
创建时间:2009年6月16日 16:56:05
历次修改:未有修改
用法举例:这家伙很懒什么都没写
*/

var dom;
var lib;
var output;
init();
function init(){
	fl.outputPanel.clear();
	dom=fl.getDocumentDOM();
	if(!dom){
		alert("找不到当前fla文档.\n如果你没打开任何fla,请打开你要处理的fla;\n如果你已经打开,请点击一下主场景,然后再运行该命令.\n- -0");
		return;
	}
	lib=dom.library;
	//创建装 导出的png 的文件夹
	var folder="file:///"+dom.path.replace(/\\/g,"/").replace(":","|");
	var id=folder.lastIndexOf("/");
	folder=folder.substr(0,id)+folder.substr(id,100).replace(".","_")+"导出的位图/";
	if(!FLfile.exists(folder)){
		FLfile.createFolder(folder);
	}
	
	//检测是否选择了库中的元件
	var items=lib.getSelectedItems().slice();
	if(items.length==0){
		alert("未选中库中任何元件");
		return;
	}
	
	
	var newDom=fl.createDocument();//新建一空fla
	
	output="";
	for each(var item in items){
		if(!checkItem(item)){
			continue;
		}
		lib.editItem(item.name);
		var timeline=dom.getTimeline();
		for each(var layer in timeline.layers){
			layer.locked=false;
			layer.visible=true;
		}
		dom.selectAll();
		if(dom.selection.length==0){
			continue;
		}
		dom.group();
		var rect=dom.getSelectionRect();
		
		dom.clipCut();
		newDom.clipPaste();
		newDom.group();
		var element=newDom.selection[0];
		newDom.width=Math.round(element.width);
		newDom.height=Math.round(element.height);
		element.x=element.width/2;
		element.y=element.height/2;
		
		//导出png
		
		var pngPath=folder+item.name+"_png.png";
		newDom.exportPNG(pngPath,true);
		newDom.deleteSelection();
		
		//导入png
		dom.importFile(pngPath);
		var bmp=dom.selection[0];
		bmp.x=rect.left;
		bmp.y=rect.top;
		
		bmp.libraryItem.allowSmoothing=true;//平滑
		
		//删掉新建的fla里的元件
		while(newDom.library.items.length>0){
			newDom.library.deleteItem(newDom.library.items[0].name);
		}
	}
	
	//关闭新建的fla
	newDom.close(false);
	if(output){
		alert(output);
	}
}
function checkItem(item){
	if(item.timeline){
		for each(var layer in item.timeline.layers){
			if(layer.frames.length>1){
				output+="不支持转换多帧的元件: "+item.name+"\n";
				return false;
			}
		}
		return true;
	}
	output+="不支持转换没有时间轴的元件: "+item.name+"\n";
	return false;
}

//

// 常忘正则表达式
// /^\s*|\s*$/					//前后空白						"\nabc d  e 哈 哈\t \r".replace(/^\s*|\s*$/g,"") === "abc d  e 哈 哈"
// /[\\\/:*?\"<>|]/				//不合法的windows文件名字符集		"\\\/:*?\"<>|\\\/:*哈 哈?\"<>|\\哈 \/:*?\"<>|".replace(/[\\\/:*?\"<>|]/g,"") === "哈 哈哈 "
// /[a-zA-Z_][a-zA-Z0-9_]*/		//合法的变量名(不考虑中文)
// value=value.replace(/[^a-zA-Z0-9_]/g,"").replace(/^[0-9]*/,"");//替换不合法的变量名
// 先把除字母数字下划线的字符去掉,再把开头的数字去掉
// 想不到怎样能用一个正则表达式搞定...

//正则表达式30分钟入门教程		http://www.unibetter.com/deerchao/zhengzhe-biaodashi-jiaocheng-se.htm
//正则表达式用法及实例			http://eskimo.blogbus.com/logs/29095458.html
//常用正则表达式					http://www.williamlong.info/archives/433.html

/*

//常用值
fl.scriptURI					//当前 jsfl 文件所在的目录
fl.configDirectory				//例: C:\Documents and Settings\Administrator\Local Settings\Application Data\Adobe\Flash CS3\zh_cn\Configuration\
fl.configURI					//例: file:///C|/Documents%20and%20Settings/Administrator/Local%20Settings/Application%20Data/Adobe/Flash%20CS3/zh_cn/Configuration/

//常用语句块
//清除输出面板
	fl.outputPanel.clear();

//复制至剪贴板
	fl.clipCopyString(str);
	
//遍历所有元件
	var items=lib.items.slice();
	for each(var item in items){
		//fl.trace(item);
	}

//遍历所有元素
	var timelines=new Array();
	for each(var timeline in dom.timelines){
		timelines.push(timeline);
	}
	var items=lib.items.slice();
	for each(var item in items){
		if(item.timeline){
			timelines.push(item.timeline);
		}
	}
	for each(var timeline in timelines){
		for each(var layer in timeline.layers){
			for each(var frame in layer.frames){
				for each(var element in frame.elements){
					//fl.trace(element);
				}
			}
		}
	}
	
//递归得到文件夹内所有fla文件
//用法:
	getAllFiles(fl.browseForFolderURL("选择要遍历的文件夹"));
	getAllFiles("file:///C|/Documents and Settings/Administrator/桌面");
function getAllFiles(folder){
	var list=FLfile.listFolder(folder+"/*.fla","files");
	var i=-1;
	for each(var file in list){
		list[++i]=decodeURI(folder+"/"+file);
	}
	var folders=FLfile.listFolder(folder+"/*","directories");
	for each(var childFolder in folders){
		list=list.concat(getAllFiles(folder+"/"+childFolder));
	}
	return list;
}
*/