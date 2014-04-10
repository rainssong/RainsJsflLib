//======[jave.lin原创]======  
//批量设置选中的图片文件，并设置链接名  
fl.outputPanel.clear();  
var doc=fl.getDocumentDOM();  
var input=window.prompt("请输入链接名的前缀","asset.common.bitmap.coach.CoachImage");  
fl.trace(input);  
var libs=doc.library;  
//var items=libs.items;  
var items=libs.getSelectedItems();  
for(var i in items){  
    var item=items[i];  
    if(item.itemType=="bitmap"){  
        var fileName=item.name.substr(item.name.lastIndexOf('/')+1);  
        var pureFileName=fileName.split('.')[0];  
//      fl.trace("fileName:" + fileName);  
//      fl.trace("pureFileName:" + pureFileName);  
//      for(var key in item){  
//          fl.trace(key + "=" + item[key]);  
//      }  
//      break;  
        item.linkageExportForAS = true;  
        item.linkageExportForRS = false;  
        item.linkageExportInFirstFrame = true;  
        item.linkageClassName = (input + pureFileName);  
        //fl.trace(item.linkageClassName);  
    }  
}  
fl.saveDocument(doc);  
//fl.closeDocument(doc,false);  
//当然你也可以在这里加多一句提示：导出成功之类的！  
alert("批量设置成功！");  