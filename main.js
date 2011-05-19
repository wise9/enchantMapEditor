window.onload = function() {
	enchant();
	var stage = document.getElementById('enchant-stage');
	stage.appendChild(mapForm.create());
	document.getElementById('checkbox').checked = true;
}
var app = {};
app.maps= {};
app.chipX = 0;
app.chipY = 0;
app.chipType = 0;
app.imagePath = '';
app.currentTab = 'bgTab';
app.drawFunc = 'pen';
app.typeEdit = true;
app.extendMode = false;
app.bgLayer = 0;
app.selectedLayer = 0;
app.selectedChip = 0;

var mapForm = {
	widthBox: (function() {
		var element = document.createElement('input');
		element.type = 'text';
		element.id = 'widthBox';
		return element;
	})(),
	heightBox: (function() {
		var element = document.createElement('input');                               
		element.type = 'text';
		element.id = 'heightBox';                                                
		return element;
	})(),
	imageMenu: (function() {
		var element = document.createElement('select');
		element.id = 'select';
		element.options[0] = new Option('RPG', 'map0.gif');
		element.options[1] = new Option('RPG', 'map1.gif');
		return element;
	})(),
	extendOption: (function() {
		var element = document.createElement('input');
		element.type = 'checkbox';
		element.id = 'checkbox';
		return element;
	})(),
	acceptButton: (function() {
		var element = document.createElement('input');                            
		element.type = 'button';                                              
		element.value = '作成';
		element.onclick = function() {
			var w = document.getElementById('widthBox');
			var h = document.getElementById('heightBox');                               
			var img = document.getElementById('select');
			var ex = document.getElementById('checkbox');
			var wv = parseInt(w.value, 10);                                             
			var hv = parseInt(h.value, 10);
			var iv = img.options[img.selectedIndex].value;
			var ev = ex.checked;
			app.imagePath = iv;
			if(!(isNaN(wv)) && !(isNaN(hv))) {
				var edit = document.getElementById('edit');
				html.mapImage.src = iv;
				app.extendMode = ev;
				start(wv, hv, iv, ev);
				edit.innerHTML+= '矢印キーでスクロール';
				edit.appendChild(html.icons);
				edit.appendChild(editorTabs.create());
				edit.appendChild(html.mapImage);
				edit.appendChild(html.geneButton);
				html.blankChip.draw();
				html.drawFunc.draw();
			} else {
				alert("input number");                                                  
			}                                                                          
		};                     
		return element;
	})(),
	create: function() {
		var form = document.createElement('div');
		form.innerHTML += '横幅: ';
		form.appendChild(this.widthBox);
		form.innerHTML += '<br />縦幅: ';
		form.appendChild(this.heightBox);
		form.innerHTML += '<br />画像: ';
		form.appendChild(this.imageMenu);
		form.innerHTML += '<br />マップ拡張を有効にする';
		form.appendChild(this.extendOption);
		form.innerHTML += '<br />';
		form.appendChild(this.acceptButton);
		return form;
	},
};

var MenuTab = function(str, active) {
	this.element = document.createElement('div');
	this.element.style.width = '8%';
	this.element.style.float = 'left';
	this.element.style['text-align'] = 'center';
	this.element.id = str;
	this.element.onclick = function() {
		if (app.currentTab == this.id) {
			return;
		}
		app.currentTab = this.id; 
		editorTabs.changeActive();
		if (app.currentTab == 'bg2Tab') {
			app.bgLayer = 1;
		} else {
			app.bgLayer = 0;
		}
	};
	if(active) {
		this.isActive = true;
	} else {
		this.isActive = false;
	}
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

var editorTabs = {
	names: [ 'bgTab', 'bg2Tab', 'fgTab', 'colTab' ],
	bgTab: (function() {
		var tab = new MenuTab('bgTab', true);
		tab.element.innerText = '背景';
		return tab;
	})(),
	bg2Tab: (function() {
		var tab = bg2Tab = new MenuTab('bg2Tab');
		tab.element.innerText = '背景2';
		return tab;
	})(),
	fgTab: (function() {
		var tab = new MenuTab('fgTab');
		tab.element.innerText = '前景';
		return tab;
	})(),
	colTab: (function() {
		var tab = new MenuTab('colTab');
		tab.element.innerText = '判定';
		return tab;
	})(),
	create: function() {
		var element = document.createElement('div');
		element.appendChild(this.bgTab.element);
		element.appendChild(this.bg2Tab.element);
		element.appendChild(this.fgTab.element);
		element.appendChild(this.colTab.element);
		return element;
	},
	applyColors: function() {
		for (var i = 0, l = this.names.length; i < l; i++) {
			this[this.names[i]].applyColor();
		}
	},
	changeActive: function() {
		for (var i = 0, l = this.names.length; i < l; i++) {
			this[this.names[i]].isActive = false;
		}
		this[app.currentTab].isActive = true;
		this.applyColors();
	}
};

var html = {};

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
	if (app.extendMode) {
		if (x < 6) {
			app.chipType = Math.floor(x / 3) + Math.floor(y / 4) * 2;
			app.typeEdit = true;
			x = Math.floor(x / 3) * 3;
			y = Math.floor(y / 4) * 4 + 1;
			html.selectedImage.update(x*16, y*16, 48, 48);
		} else if (x < 11) {
			app.selectedChip = x - 6 + 12 + y * 17;
			app.typeEdit = false;
			html.selectedImage.update(x*16, y*16);
		} else {
			app.selectedChip = x - 11 + 12 + 272 + y * 17;
			app.typeEdit = false;
			html.selectedImage.update(x*16, y*16);
		}

	}
	else {
		app.selectedChip = x + y * cols;
		html.selectedImage.update(x*16, y*16);
	}
};

html.icons = document.createElement('div');

html.selectedImage = document.createElement('canvas');
html.selectedImage.width = 48;
html.selectedImage.height = 48;
html.selectedImage.update = function(x, y, width, height) {
	var ctx = this.getContext('2d');
	ctx.clearRect(0, 0, 48, 48);
	ctx.drawImage(html.mapImage, x, y, width|16, height|16, 0, 0, 48, 48);
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
	app.chipType = -1;
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
	var txt = '';
	var w = window.open('about:blank', '_blank');
	var output = document.createElement('textarea');
	app.maps.bgMap.collisionData = app.maps.colMap._data[0];
	output.rows = 30;
	output.cols = 120;
	txt += app.maps.bgMap.getDataCode('backgroundMap', app.imagePath);
	txt += app.maps.fgMap.getDataCode('foregroundMap', app.imagePath);
	output.value = txt;
	w.document.body.appendChild(output);
};
