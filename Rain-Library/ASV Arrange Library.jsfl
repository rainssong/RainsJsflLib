// ASV Arrange Library Command
//
// Copyright (c) 2004 Manitu Group. All rights reserved.
//
// http://www.buraks.com
//
// version 1.5 (26 January 2004)
// http://www.buraks.com/asv/tools/index.html
//
fl.trace('');
fl.trace('ASV Arrange Library Command version 1.5');
fl.trace('Copyright (c) 2004 Manitu Group http://www.buraks.com');
fl.trace('Thanks to: Peter Hall, Jonathan Clark');
fl.trace('');

var doc=fl.getDocumentDOM();
if (doc!=null) {

var lib=doc.library;

var libItems, timelines;

function pushIfUnique(item,destArray){
	var x;
	for (x=0;x<destArray.length;x++){
		if (destArray[x]==item){ 
			return; 
		}
	}
	destArray.push(item);
}

function findLibItem(obj){
	var xi,i;
	for (xi=0;xi<libItems.length;xi++){
		i=libItems[xi];
		if (i.obj==obj){ 
			return(i); 
		}
	}
	return(null);
}

function findTimelineUses(timeline,destArray){
	var xl,l,xf,f,xe,e,i;
	for (xl=0;xl<timeline.layers.length;xl++){
		l=timeline.layers[xl];
		for (xf=0;xf<l.frames.length;xf++){
			f=l.frames[xf];
			for (xe=0;xe<f.elements.length;xe++){
				e=f.elements[xe];
				if (e.elementType=='instance'){
					i=findLibItem(e.libraryItem);
					if (i!=null){ pushIfUnique(i,destArray); }
				}	
			}
			xf+=f.duration-1;
		}
	}
}

function addSlash(s){
  if (s=='') { return(s); } else { return(s+'/'); }
}

function findUsedByCommonFolder(libItem){
	if  (libItem.usedBy.length==0) { return(unusedfolder);}
	var xu,u,s,s2,sp,sp2,l,xl,s3,mismatch;
	u=libItem.usedBy[0];
	s=addSlash(u.folder)+u.obj.name+' gfx';
	if (libItem.usedBy.length>1){
		mismatch=false;
		for (xu=1;xu<libItem.usedBy.length;xu++){
			sp=s.split('/');
			u=libItem.usedBy[xu];
			s2=addSlash(u.folder)+u.obj.name+' gfx';
			sp2=s2.split('/');
			if (sp.length!=sp2.length) { mismatch=true; }
			if (sp.length>sp2.length) {l=sp2.length} else {l=sp.length;}
			s3='';
			for (xl=0;xl<l;xl++){
				if (sp[xl]==sp2[xl]) { s3=addSlash(s3)+sp[xl];} else { mismatch=true; break;}
			}
			s=s3;
		}
		if (mismatch==true) { s=addSlash(s)+'gfx'; };
	}
	return(s);
}

var xi,i,xu,u,s,folders,sounds;

timelines=new Array();
for (xi=0;xi<doc.timelines.length;xi++){
	i=new Object();
	i.obj=doc.timelines[xi];
	i.uses=new Array();
	i.folder='';
	i.flag=1;
	timelines.push(i);
}
libItems=new Array();
folders=new Array();
sounds=new Array();
for (xi=0;xi<lib.items.length;xi++){
	s=lib.items[xi].name;
	if (s.slice(0,19)=='Flash UI Components') {
		continue; 
	}
	t=(lib.items[xi].itemType);
	if (t=='folder'){ 
		folders.push(lib.items[xi]);
		continue; 
	}
	if (t=='sound'){
		sounds.push(lib.items[xi]);
		continue;
	}
	i=new Object();
	i.obj=lib.items[xi];
	i.uses=new Array();
	i.usedBy=new Array();
	i.folder='';
	i.flag=0;
	libItems.push(i);
}

for (xi=0;xi<libItems.length;xi++){
	i=libItems[xi];
	lib.moveToFolder('',i.obj.name);
}
for (xi=0;xi<sounds.length;xi++){
	i=sounds[xi];
	lib.moveToFolder('',i.name);
}

for (xi=0;xi<folders.length;xi++){
	i=folders[xi];
	t=i.name;
	lib.deleteItem(i.name);
}

for (xi=0;xi<libItems.length;xi++){
	i=libItems[xi];
	s=i.obj.name;
	if (s.slice(-3)=='gfx') {
		i.obj.name+='_';
	}
}

var
  soundfolder = '_sounds';
  unusedfolder = '_unused';
  
while(lib.itemExists(soundfolder)){ soundfolder = '_'+soundfolder; }
while(lib.itemExists(unusedfolder)){ unusedfolder = '_'+unusedfolder; }

if (sounds.length>0){
	lib.newFolder(soundfolder);
	for (xi=0;xi<sounds.length;xi++){
		i=sounds[xi];
		lib.moveToFolder(soundfolder,i.name);
	}
}

for (xi=0;xi<timelines.length;xi++){
	i=timelines[xi];
	findTimelineUses(i.obj,i.uses);
}
for (xi=0;xi<libItems.length;xi++){
	i=libItems[xi];
	t=i.obj.itemType;
	if ( (t!='movie clip') && (t!='button') && (t!='graphic') ) { continue; }
	findTimelineUses(i.obj.timeline,i.uses);
}

for (xi=0;xi<timelines.length;xi++){
	i=timelines[xi];
	if (i.uses.length>0){
		for (xu=0;xu<i.uses.length;xu++){
			u=i.uses[xu];
			pushIfUnique(i,u.usedBy);
		}
	}
}
for (xi=0;xi<libItems.length;xi++){
	i=libItems[xi];
	if (i.uses.length>0){
		for (xu=0;xu<i.uses.length;xu++){
			u=i.uses[xu];
			pushIfUnique(i,u.usedBy);
		}
	}
}

var counter = 1;
var iteration = 0;
var notdone,problem;
notdone=true;
while (notdone==true) {
	notdone=false;
	for (xi=0;xi<libItems.length;xi++){
		i=libItems[xi];
		if (i.flag!=0) {continue;}
		problem=false;
		for (xu=0;xu<i.usedBy.length;xu++){
			u=i.usedBy[xu];
			if (u.flag==0) {
				problem=true;
				break;
			}
		}
		if (problem==false) { 
			i.folder=findUsedByCommonFolder(i);
			i.flag=counter;
			counter++;
		} else { notdone=true };
	}
	iteration++;
	if ((iteration>libItems.length) && (notdone==true)){
		fl.trace('An error occured.');
		break;
		}
}

for (xi=0;xi<libItems.length;xi++){
	i=libItems[xi];
	if (i.folder!='') {
		if (!lib.itemExists(i.folder)) { lib.newFolder(i.folder); };
	}
}

for (xi=0;xi<libItems.length;xi++){
	i=libItems[xi];
	lib.moveToFolder(i.folder,i.obj.name);
}

fl.trace('Completed.');
} else {
  fl.trace('Error. You must open an FLA file first.');
}