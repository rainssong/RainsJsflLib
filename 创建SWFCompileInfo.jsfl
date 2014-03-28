/**
2009.06.16	tamt	在当前文档的文档类的目录下创建一个SWFCompileInfo.as的类文件, 该类文件记录了编译时的一些信息, 如编译时间. 目前只定义编译时间
					建议把该脚本放置在目录 C:\Documents and Settings\Administrator\Local Settings\Application Data\Adobe\Flash CS3\zh_cn\Configuration\Commands
**/

var doc = fl.getDocumentDOM();

/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
++++++++++++++++++[ 定位文档类所在的目录 ]+++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/
var profile_path = getFolderURI(doc.path.split(doc.name)[0]) + doc.name + '.swf_compiletime_profile.xml';
//fl.trace(profile_path);
doc.exportPublishProfile(profile_path);
var profile = String(FLfile.read(profile_path));
var as3paths = profile.substring(profile.indexOf("<AS3PackagePaths>") + 17, profile.indexOf("</AS3PackagePaths>"));
var docClass = doc.docClass;
var classPathsStr = (as3paths.length>0?(as3paths+";"):"") + fl.as3PackagePaths;
var classPaths = classPathsStr.split(";");
//去除含"$(AppConfig)"的路径.
for(var i=0; i<classPaths.length; i++){
	if(classPaths[i].indexOf("$(AppConfig)") >=0 ){
		classPaths.splice(i, 1);
	}
}
//把所有相对路径补全为绝对路径.
for(var i=0; i<classPaths.length; i++){
	if(classPaths[i].indexOf(":\\")==-1){
		classPaths[i] = doc.path.split(doc.name)[0] + classPaths[i];
	}
}
//保证所以路径的最后一个字符是"/";
for(var i=0; i<classPaths.length; i++){
	classPaths[i] = getFolderURI(classPaths[i]);
	if(classPaths[i].substr(-1, 1)!='/')classPaths[i]+='/';
}
//查询文档类被放置在哪个路径下了.
var SWFCompileInfoPath = "";
var t_str = replaceStr(docClass, ".", "/") + ".as";
for(var i=0; i<classPaths.length; i++){
	if(FLfile.exists(classPaths[i] + t_str)){
		//fl.trace(classPaths[i] + t_str);
		SWFCompileInfoPath = classPaths[i] + t_str.substr(0, t_str.lastIndexOf("/")+1);
		break;
	}
}
/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/

SWFCompileInfoPath += "SWFCompileInfo.as";
var classContent = getClassContent();
FLfile.write(SWFCompileInfoPath, classContent);
//fl.trace(SWFCompileInfoPath);
FLfile.remove(profile_path);








/*
++++++++++++++++函数定义+++++++++++++++++++++++++++++++++++++
*/
function getClassContent(){
	var str = "";
	var timelineClass = "SWFCompileInfo";
	str += ("package " + docClass.substr(0, docClass.lastIndexOf(".")) + "{");
	str += ("\n\t/**");
	str += ("\n\t * "+timelineClass + ' 类');
    str += ("\n\t * [注意]该类文件由脚本运行生成, 修改内容后, 下次脚本运行会覆盖修改!!!!");
    str += ("\n\t * [建议]如果需要修改该类, 请编辑脚本:创建SWFCompileInfo类_并测试影片.jsfl");
    str += ("\n\t * @author tamt");
    str += ("\n\t */");
    str += ("\n\tpublic class "+timelineClass+"\n\t{");
	str += ("\n\t\tpublic static const COMPILE_TIME_STR:String = '" +getTimestamp() + "';");
	str += ("\n\t\t//编译时间戳, 始于1970, 单位:毫秒");
	str += ("\n\t\tpublic static const COMPILE_TIME:uint = " +(new Date()).getTime() + ";");
	str += ("\n\t\tpublic static const COMPILE_DAY:uint = " +(new Date()).getDate() + ";");
	str += ("\n\t}");
	str += ("\n}");
	return str;
}

function getFolderURI(filePath){
	folderURI = filePath;
	folderURI = replaceStr(folderURI,"\\", "/");
	folderURI = replaceStr(folderURI, " ", "%20");
	folderURI = replaceStr(folderURI, ":", "|");
	folderURI = "file:///"+folderURI;
	return folderURI;
}

function replaceStr(origStr, searchStr, replaceStr) {
	var tempStr = "";
	var startIndex = 0;
	if (searchStr == "") {
		return origStr;
	}
	if (origStr.indexOf(searchStr) != -1) {
		while ((searchIndex=origStr.indexOf(searchStr, startIndex)) != -1) {
		tempStr += origStr.substring(startIndex, searchIndex);
		tempStr += replaceStr;
		startIndex = searchIndex+searchStr.length;
	}	
		return tempStr+origStr.substring(startIndex);
	} else {
		return origStr;
	}
}

//时间戳函数.
function getTimestamp() {
	var t = new Date();
	var month = returnTwoDigit(t.getMonth()+1);
	var day = returnTwoDigit(t.getDate());
	var year = t.getFullYear();
	var hour = returnTwoDigit(t.getHours());
	var minute = returnTwoDigit(t.getMinutes());
	var second = returnTwoDigit(t.getSeconds());
	
	var ampm = (t.getHours() > 11) ? "pm" : "am";
	
	if (t.getHours() > 12) hour = returnTwoDigit(t.getHours()-12);
	
	var myDate = month + "/" + day + "/" + year;
	var myTime = hour + ":" + minute + ":" + second + ampm;
	return myDate + " " + myTime;
}
function returnTwoDigit(num) { return (num < 10) ? ("0" + num) : num; }