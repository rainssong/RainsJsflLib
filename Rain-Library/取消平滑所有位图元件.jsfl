/***
平滑所有位图元件 版本:v1.0
简要说明:这家伙很懒什么都没写
创建人:ZЁЯ¤  身高:168cm+;体重:57kg+;未婚;最爱的运动:睡觉;格言:路见不平,拔腿就跑;QQ:358315553
创建时间:2009年2月24日 10:29:10
历次修改:未有修改
用法举例:这家伙很懒什么都没写
*/
var total=0;
for each(var item in fl.getDocumentDOM().library.items){
	if(item.itemType=="bitmap"){
		item.allowSmoothing=false;
		total++;
	}
}
fl.trace("共对"+total+"个位图元件取消平滑");