// rainssong
// 2014-4-10
//
fl.trace('');
fl.trace('Rainssong');
fl.trace('2014-4-10');
fl.trace('');
var library=document.library;
//获得库中元素数组
var items=library.items;

function executeBitmapConvert(items)
{
	//获得库中元素的数量
	var itemsCount=items.length;

	for(var i=0;i< itemsCount;i++){
	//如果元素是位图，则设置其压缩属性
		if(items[i].itemType="bitmap"){
		//使用photo(JPEG)压缩
		items[i].compressionType="photo";
		//使用文档的压缩质量，可在导出时设置
		items[i].useImportedJPEGQulity=true;
		}
	} 
	
	fl.trace('all Bitmap type changer to JPG');
}
//执行函数
executeBitmapConvert(items);