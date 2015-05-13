var document = fl.getDocumentDOM();	

if(!document){
	alert("请参考以下步骤：\r    >打开要导出的文件\r    >切换到要导出的时间轴\r    >运行此文件");
}

var timeline = document.getTimeline();

document.selectAll();
document.clipCopy();

timeline.setSelectedLayers(0,true);
for(var i = 1;i<timeline.layers.length;i++)
{
	timeline.setSelectedLayers(i,false);
}
timeline.setLayerProperty('layerType', 'guide');
timeline.setLayerProperty('locked', true);

timeline.addNewLayer();

document.clipPaste(true);
document.selectAll();
document.convertSelectionToBitmap();

timeline.setSelectedLayers(0,true);
timeline.setLayerProperty('name', 'Bitmap');