// rainssong
// 2014-4-10
//
fl.trace('');
fl.trace('Rainssong');
fl.trace('2014-4-10');
fl.trace('');
var library=document.library;
//��ÿ���Ԫ������
var items=library.items;

function executeBitmapConvert(items)
{
	//��ÿ���Ԫ�ص�����
	var itemsCount=items.length;

	for(var i=0;i< itemsCount;i++){
	//���Ԫ����λͼ����������ѹ������
		if(items[i].itemType="bitmap"){
		//ʹ��photo(JPEG)ѹ��
		items[i].compressionType="photo";
		//ʹ���ĵ���ѹ�����������ڵ���ʱ����
		items[i].useImportedJPEGQulity=true;
		}
	} 
	
	fl.trace('all Bitmap type changer to JPG');
}
//ִ�к���
executeBitmapConvert(items);