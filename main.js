window.onload = function() {
	enchant('');
	var enc = document.getElementById('enchant-stage');
    enc.innerHTML += 'Width: ';
    enc.appendChild(html.widthBox);
    enc.innerHTML += '<br />Height: ';
    enc.appendChild(html.heightBox);
    enc.innerHTML += '<br />Source: ';
	enc.appendChild(html.imageMenu);
    enc.innerHTML += '<br />';
    enc.appendChild(html.createButton);
}
var app = {};
app.maps= {};
app.chipX = 0;
app.chipY = 0;
app.imagePath = '';
app.currentTab = 'bgTab';
app.drawFunc = 'pen';
app.bgLayer = 0;
app.selectedLayer = 0;
app.selectedChip = 0;
app.onClickFunction = function() {};

var html = {};
html.widthBox= document.createElement('input');                                 
html.widthBox.type = 'text';
html.widthBox.id = 'widthBox';                                                  

html.heightBox = document.createElement('input');                               
html.heightBox.type = 'text';
html.heightBox.id = 'heightBox';                                                

html.imageMenu = document.createElement('select');
html.imageMenu.id = 'select';
var opt1 = new Option('RPG', 'map0.gif');
var opt2 = new Option('2D Scroll', 'map1.gif');
html.imageMenu.options[0] = opt1;
html.imageMenu.options[1] = opt2;

html.createButton = document.createElement('input');                            
html.createButton.type = 'button';                                              
html.createButton.value = '作成';
html.createButton.onclick = function() {
    var w = document.getElementById('widthBox');
    var h = document.getElementById('heightBox');                               
	var img = document.getElementById('select');
    var wv = parseInt(w.value, 10);                                             
    var hv = parseInt(h.value, 10);
	var iv = img.options[img.selectedIndex].value;
	app.imagePath = iv;
    if(!(isNaN(wv)) && !(isNaN(hv))) {
		var edit= document.getElementById('edit');
		html.mapImage.src = iv;
		start(wv, hv, iv);
		edit.innerHTML+= '矢印キーでスクロール';
		edit.appendChild(html.icons);
		edit.appendChild(html.editTabs.element);
		edit.appendChild(html.mapImage);
		edit.appendChild(html.geneButton);
		html.blankChip.draw();
		html.drawFunc.draw();
    } else {
        alert("input number");                                                  
    }                                                                           
};                     

var MenuTab = function(str) {
	this.element = document.createElement('div');
	this.element.style.width = '8%';
	this.element.style.float = 'left';
	this.element.style['text-align'] = 'center';
	this.element.id = str;
	this.isActive = false;
	this.applyColor();
};
MenuTab.prototype = {
	activeBgColor : '#357',
	inactiveBgColor : '#555',
	activeColor : '#000',
	inactiveColor : '#777',
	applyColor : function() {
		if (this.isActive) {
			this.element.style.backgroundColor = this.activeBgColor;
			this.element.style.color = this.activeColor;
		} else {
			this.element.style.backgroundColor = this.inactiveBgColor;
			this.element.style.color = this.inactiveColor;
		}
	}
};

html.editTabs = {}; 
html.editTabs.names = [ 'bgTab', 'bg2Tab', 'fgTab', 'colTab' ]; 
html.editTabs.element = document.createElement('div');
html.editTabs.bgTab = new MenuTab('bgTab');
html.editTabs.bgTab.element.innerText = '背景';
html.editTabs.bgTab.isActive = true;
html.editTabs.bgTab.applyColor();
html.editTabs.element.appendChild(html.editTabs.bgTab.element);
html.editTabs.bg2Tab = new MenuTab('bgTab2');
html.editTabs.bg2Tab.element.innerText = '背景2';
html.editTabs.element.appendChild(html.editTabs.bg2Tab.element);
html.editTabs.fgTab = new MenuTab('fgTab');
html.editTabs.fgTab.element.innerText = '前景';
html.editTabs.element.appendChild(html.editTabs.fgTab.element);
html.editTabs.colTab = new MenuTab('colTab');
html.editTabs.colTab.element.innerText = '判定';
html.editTabs.element.appendChild(html.editTabs.colTab.element);
html.editTabs.changeActive = function(name) {
	for (var i = 0 ; i < this.names.length ; i++) {
		this[this.names[i]].isActive = false;
	}
	this[name].isActive = true;
	for (var i = 0 ; i < this.names.length ; i++) {
		this[this.names[i]].applyColor();
	}
};
	

html.mapImage = document.createElement('image');
html.mapImage.onload = function() {
	html.selectedImage.update(0,0);
};
html.mapImage.onclick = function(e) {
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;
	var cols = Math.floor(this.width / 16);
	x = Math.floor(x / 16) | 0;
	y = Math.floor(y / 16) | 0;
	app.selectedChip = x + y * cols;
	html.selectedImage.update(x*16, y*16);
};

html.icons = document.createElement('div');

html.selectedImage = document.createElement('canvas');
html.selectedImage.width = 48;
html.selectedImage.height = 48;
html.selectedImage.update = function(x, y) {
	var ctx = this.getContext('2d');
	ctx.clearRect(0, 0, 48, 48);
	ctx.drawImage(html.mapImage, x, y, 16, 16, 0, 0, 48, 48);
	ctx.strokeStyle = '#ff5544';
	ctx.lineWidth = 3;
	ctx.strokeRect(0, 0, 48, 48);
};
html.selectedImage.clear = function() {
	var ctx = this.getContext('2d');
	ctx.clearRect(0, 0, 48, 48);
	ctx.strokeStyle = '#ff5544';
	ctx.lineWidth = 3;
	ctx.strokeRect(0, 0, 48, 48);
	ctx.lineWidth = 2;
	ctx.moveTo(0, 0);
	ctx.lineTo(48, 48);
	ctx.stroke();
};

html.blankChip = document.createElement('canvas');
html.blankChip.width = 48;
html.blankChip.height = 48;
html.blankChip.draw = function() {
	var ctx = this.getContext('2d');
	ctx.strokeStyle = 'Red';
	ctx.lineWidth = 3;
	ctx.strokeRect(0, 0, 48, 48);
	ctx.lineWidth = 2;
	ctx.moveTo(0, 0);
	ctx.lineTo(48, 48);
	ctx.stroke();
};
html.blankChip.onclick = function() {
	app.selectedChip = -1;
	html.selectedImage.clear();
};

html.drawFunc = document.createElement('canvas');
html.drawFunc.width = 48;
html.drawFunc.height = 48;
html.drawFunc.draw = function() {
	var ctx = this.getContext('2d');
	ctx.clearRect(0, 0, 48, 48);
	ctx.font = '20px helvetica';
	ctx.fillText(app.drawFunc, 8, 32); 
};
html.drawFunc.onclick = function() {
	if (app.drawFunc == 'pen') {
		app.drawFunc = 'fill';
	} else {
		app.drawFunc = 'pen';
	}
	this.draw();
};

html.icons.appendChild(html.selectedImage);
html.icons.appendChild(html.blankChip);
html.icons.appendChild(html.drawFunc);

html.geneButton = document.createElement('input');
html.geneButton.type = 'button';
html.geneButton.id = 'gene';
html.geneButton.value = 'コード生成';
html.geneButton.onclick = function() {
	if(!html.outputArea.isDisplayed) {
		var edit = document.getElementById('edit');
		edit.insertBefore(html.outputArea, this);
		html.outputArea.isDisplayed = true;
	}
		html.outputArea.updateValue();
};

html.outputArea = document.createElement('textarea');
html.outputArea.value = '';
html.outputArea.rows = 30;
html.outputArea.cols = 120;
html.outputArea.isDisplayed = false;
html.outputArea.updateValue = function() {
	var txt = 'var background = new Map(16, 16);\n';
	txt += "background.image = game.assets['" + app.imagePath + "'];\n"; 
	txt += 'background.loadData(';
	for (var i = 0 ; i < app.maps.bgMap._data.length ; i++) {
		txt += '[\n'
		for (var j = 0 ; j < app.maps.bgMap._data[0].length ; j++) {
			txt += '    [';
			txt += app.maps.bgMap._data[i][j].toString();
			txt += '],\n';
		}
		txt = txt.slice(0,-2);
		txt += '\n],'
	}
	txt = txt.slice(0,-1);
	txt += ');\n';
	txt += 'background.collisionData = [\n';
	for (var i = 0 ; i < app.maps.colMap._data[0].length ; i++) {
		txt += '    [';
		txt += app.maps.colMap._data[0][i].toString();
		txt += '],\n';
	}
	txt = txt.slice(0,-2);
	txt += '\n],'

	txt += 'var foreground = new Map(16, 16);\n';
	txt += "foreground.image = game.assets['" + app.imagePath + "'];\n"; 
	txt += 'foreground.loadData(';
	for (var i = 0 ; i < app.maps.fgMap._data.length ; i++) {
		txt += '[\n'
		for (var j = 0 ; j < app.maps.fgMap._data[0].length ; j++) {
			txt += '    [';
			txt += app.maps.fgMap._data[i][j].toString();
			txt += '],\n';
		}
		txt = txt.slice(0,-2);
		txt += '\n],'
	}
	txt = txt.slice(0,-1);
	txt += ');\n';

	html.outputArea.value = txt;
};
