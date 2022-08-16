/*
https://community.adobe.com/t5/photoshop-ecosystem-discussions/select-layer-group-below-the-currently-selected-group/m-p/13137748#M664949

Script to select the group present under the current selected group
Conditions:- The target group should not be present inside the currently selected group
Pre Requisite:- The script needs to be run after making a group selection in the layers panel.
Warning :- No elaborate error checking

Author:- Manan Joshi
Guthub Repo :- https://github.com/Manan-Joshi/Photoshop-Scripts.git
*/

var s2t = stringIDToTypeID;
var t2s = typeIDToStringID;

function getProperty(className, property, index)
{
	var r = new ActionReference(), p = s2t(property)
	r.putProperty(s2t('property'), p)
	if(index != undefined)
		r.putIndex(s2t(className),index)
	else
		r.putEnumerated(s2t(className), s2t('ordinal'), s2t('targetEnum'))
	var a = executeActionGet(r)
	return a
}

function isGroup(layerIdx){
	var r 
	if(layerIdx !== null)
		r = t2s(getProperty("layer", "layerSection", layerIdx).getEnumerationValue(s2t("layerSection")))
	else
		r = t2s(getProperty("layer", "layerSection").getEnumerationValue(s2t("layerSection")))
		
	return r === "layerSectionStart"
}

function movetoEnd(grpIdx){
	var r = t2s(getProperty("layer", "layerSection", grpIdx).getEnumerationValue(s2t("layerSection")))
	while(r !== "layerSectionEnd")
		r = t2s(getProperty("layer", "layerSection", --grpIdx).getEnumerationValue(s2t("layerSection")))
		
	return grpIdx
}

function selectGroup(layerName, layerID) {
    var idselect = stringIDToTypeID("select");
    var desc25 = new ActionDescriptor();
    var idnull = stringIDToTypeID("null");
    var ref11 = new ActionReference();
    var idlayer = stringIDToTypeID("layer");
    ref11.putName(idlayer, layerName);
    desc25.putReference(idnull, ref11);
    var idmakeVisible = stringIDToTypeID("makeVisible");
    desc25.putBoolean(idmakeVisible, false);
    var idlayerID = stringIDToTypeID("layerID");
    var list5 = new ActionList();
    list5.putInteger(layerID);
    desc25.putList(idlayerID, list5);
    executeAction(idselect, desc25, DialogModes.NO);
}

var layerIdx = activeDocument.activeLayer.itemIndex
var bgLayer = getProperty("document", "hasBackgroundLayer").getBoolean(s2t("hasBackgroundLayer")) ? 0 : 1
!bgLayer && layerIdx--
if(isGroup())
{
	layerIdx = movetoEnd(layerIdx)
	r = isGroup(--layerIdx)
	while(!r && layerIdx > bgLayer){
		r = isGroup(--layerIdx)
	}

	if(isGroup(layerIdx)){
		var n = getProperty("layer", "name", layerIdx).getString(s2t("name"))
		selectGroup(n, layerIdx)
	}
}