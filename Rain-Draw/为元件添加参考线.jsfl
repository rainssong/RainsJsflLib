﻿//選択したエレメントをガイドに変換var doc = fl.getDocumentDOM();var timeline = doc.getTimeline();var selection = doc.selection;for each(var element in selection){	var rect = {		left:element.left,		top:element.top,		right:element.left+element.width,		bottom:element.top+element.height	}	drawGuideLine(timeline,rect);}function drawGuideLine(timeline,rect){	var guideline_xml = XML(timeline.getGuidelines());		var node = <guidelines>		<guideline direction="h">{rect.top}</guideline>		<guideline direction="h">{rect.bottom}</guideline>		<guideline direction="v">{rect.left}</guideline>		<guideline direction="v">{rect.right}</guideline>	</guidelines>;		guideline_xml.appendChild(node.guideline);		timeline.setGuidelines(guideline_xml.toXMLString());		guideline_xml = XML(timeline.getGuidelines());	fl.trace(guideline_xml)}