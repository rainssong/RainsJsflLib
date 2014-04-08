(function()
{
    var tmpdata = {};
    var folder_cnt = 0, file_cnt = 0;
    var items = fl.getDocumentDOM().library.items;
    var date=new Date();
    var timeString= date.toLocaleTimeString();
    var prex =
    {
        'movie clip': 'Mc',
        'button': 'Btn',
        'graphic': 'Gr',
        'bitmap': 'Bm',
        'sound': 'Sd',
        'compiled clip': 'Cm'
    };
 
    for(var i in items)
    {
        var obj = items[i];
        var pathinfo = obj.name.split('/');
        var realname = pathinfo.pop();
        var realpath = pathinfo.join('/') || '_G_L_O_B_A_L_';
        var myfolder = pathinfo.pop() || 'Root';
        var id = tmpdata[realpath] || 1;
        if(obj.itemType !== 'folder')
        {
            var pre = prex[obj.itemType] || 'Ano';
			obj.name = pre + id + '_' + timeString;
            tmpdata[realpath] = ++id;
            file_cnt++;
        }
        else
        {
            folder_cnt++;
        }
    }
	
	for(var i in items)
    {
        var obj = items[i];
        var pathinfo = obj.name.split('/');
        var realname = pathinfo.pop();
        var realpath = pathinfo.join('/') || '_G_L_O_B_A_L_';
        var myfolder = pathinfo.pop() || 'Root';
        var id = tmpdata[realpath] || 1;
        if(obj.itemType !== 'folder')
        {
            var pre = prex[obj.itemType] || 'Ano';
			obj.name = pre + id;
            tmpdata[realpath] = ++id;
            file_cnt++;
        }
        else
        {
            folder_cnt++;
        }
    }
	
    fl.trace('ReName Completed!\n' + folder_cnt + ' folder(s) and ' + file_cnt + ' symbol(s)');
})();