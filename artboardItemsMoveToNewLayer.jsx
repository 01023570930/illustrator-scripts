/* 

  Program version: Adobe Illustrator CS5+
  Name: artboardItemsMoveToNewLayer.jsx;

  Author: Alexander Ladygin, email: i@ladygin.pro
  Copyright (c) 2018

*/
if (app.documents.length) {
    function getCustomNumbers ($str, items, returnItems) {
        var __num = $str.replace(/ /g, '').replace(/[^-0-9^,]/gim,'').split(','),
            $maxItems = items.length,
            j = __num.length,
            arr = [];

        function getNumbersBetweenMinMax (min, max) {
            var numbers = [];
            for (var n = min; n <= max; n++) {
                if (n < $maxItems) {
                    numbers.push(returnItems ? items[n] : n);
                }
            }
            return numbers;
        }

        while (j--) {
            if (__num[j].indexOf('-') > -1) {
                var values = __num[j].split('-'),
                    min = parseInt(values[0]),
                    max = parseInt(values[1]);

                if (!isNaN(min) && !isNaN(max)) arr = arr.concat(getNumbersBetweenMinMax(min - 1, max - 1));
            }
                else {
                    var __val = parseInt(__num[j]);
                    if (!isNaN(__val) && __val <= $maxItems) {
                        arr.push(returnItems ? items[__val - 1] : __val - 1);
                    }
                }
        }

        return arr;
    }

    function removeEmptyLayers (layers) {
        var n = layers.length,
            isEmpty = true;
        
        while (n--) {
            if (layers[n].layers.length) isEmpty = removeEmptyLayers(layers[n].layers);
            if (isEmpty && !layers[n].pageItems.length) layers[n].remove();
        }

        return isEmpty;
    }


    function __artboardItemsMoveToNewLayer (__artNumbers) {
        __artNumbers = (__artNumbers instanceof Array ? __artNumbers : []);

        var arts = activeDocument.artboards,
            l = __artNumbers.length ? __artNumbers.length : arts.length;

        selection = null;

        function __move (items) {
            var layer = activeDocument.layers.add(),
                j = items.length;

            while (j--) {
                items[j].moveToBeginning(layer);
            }
        }

        for (var i = 0; i < l; i++) {
            activeDocument.artboards.setActiveArtboardIndex(i);
            activeDocument.selectObjectsOnActiveArtboard();
            __move(selection);
            selection = null;
        }

        if (removeEmptyLayersCheckbox.value) removeEmptyLayers(activeDocument.layers);
    }

    var selectionBak = selection;

    var win = new Window('dialog', 'Artboards items move to new layer', undefined);
        win.orientation = 'column';
        win.alignChildren = ['fill', 'fill'];

    var panel = win.add('panel', undefined, 'Artboards:');
        panel.orientation = 'column';
        panel.alignChildren = ['fill', 'fill'];
        panel.margins = 20;

    var groupRadio = panel.add('group');
        groupRadio.orientation = 'row';

    var allArtboardsRadio = groupRadio.add('radiobutton', undefined, 'All'),
        customArtboardsRadio = groupRadio.add('radiobutton', undefined, 'Custom');
        allArtboardsRadio.value = true;
        allArtboardsRadio.onClick = function () { customArts.enabled = false; };
        customArtboardsRadio.onClick = function () { customArts.enabled = true; };

    var customArts = panel.add('edittext', undefined, activeDocument.artboards.getActiveArtboardIndex() + 1);
        customArts.enabled = false;

    var panelCheckbox = win.add('panel', undefined, 'Clear empty:');
        panelCheckbox.orientation = 'column';
        panelCheckbox.alignChildren = ['fill', 'fill'];
        panelCheckbox.margins = 20;

    var removeEmptyLayersCheckbox = panelCheckbox.add('checkbox', undefined, 'Layers & Sub layers');

    var winButtons = win.add('group');
        winButtons.orientation = 'row';
        winButtons.alignChildren = ['fill', 'fill'];

    var ok = winButtons.add('button', undefined, 'OK');
        ok.helpTip = 'Press Enter to Run';
        ok.onClick = startAction;
        ok.active = true;

    var cancel = winButtons.add('button', undefined, 'Cancel');
        cancel.helpTip = 'Press Esc to Close';
        cancel.onClick = function () { win.close(); }

    function startAction() {
        var __arts = [];

        if (customArtboardsRadio.value) {
            __arts = getCustomNumbers(customArts.text, activeDocument.artboards);
        }

        __artboardItemsMoveToNewLayer(__arts);

        selection = selectionBak;

        win.close();
    }

    selection = null;
    win.center();
    win.show();

}
    else {
        throw new Error('Create document!');
    }