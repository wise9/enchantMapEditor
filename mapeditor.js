function start(mapWidth, mapHeight, gameImage) {

	enchant.Map.prototype.changeChip = function() {
		this._data[app.bgLayer][app.chipY][app.chipX] = app.selectedChip;
		this.image = game.assets[gameImage];
	};
	enchant.Map.prototype.addMap = function() {
		var arr = new Array(mapHeight);
		for (var i = 0 ; i < mapHeight ; i++) {
			arr[i] = new Array(mapWidth);
			for (var j = 0 ; j < mapWidth ; j++) {
				arr[i][j] = -1;
			}
		}
		this.loadData(this._data[0], arr);
	};

    var game = new Game(640, 480);
    game.fps = 16;
	game.keybind(16, 'a');
    game.preload('ui_16.png', gameImage);
    game.onload = function() {
		var bgTab = document.getElementById('bgTab');
		bgTab.onclick = function() {
			if (html.editTabs.current == 'bgTab') {
				return;
			}
			html.editTabs.current = 'bgTab';
			html.editTabs.changeActive('bgTab');
			if (app.collisionMode) {
				stage.removeChild(colMap);
			}
			app.bgLayer = 0;
			app.bgMode = true;
			app.bg2Mode = false;
			app.fgmode = false;
			app.collisionMode = false;
		};
		var bg2Tab = document.getElementById('bgTab2');
		bg2Tab.onclick = function() {
			if (html.editTabs.current == 'bg2Tab') {
				return;
			}
			html.editTabs.current = 'bg2Tab';
			html.editTabs.changeActive('bg2Tab');
			if (app.collisionMode) {
				stage.removeChild(colMap);
			}
			app.bgLayer = 1;
			app.bgMode = true;
			app.bg2Mode = false;
			app.fgmode = false;
			app.collisionMode = false;
		};
		var fgTab = document.getElementById('fgTab');
		fgTab.onclick = function() {
			if (html.editTabs.current == 'f1gTab') {
				return;
			}
			html.editTabs.current = 'fgTab';
			html.editTabs.changeActive('fgTab');
			if (app.collisionMode) {
				stage.removeChild(colMap);
			}
			app.bgMode = false;
			app.bg2Mode = false;
			app.fgMode = true;
			app.collisionMode = false;
		};
		var colTab = document.getElementById('colTab');
		colTab.onclick = function() {
			if (html.editTabs.current == 'colTab') {
				return;
			}
			html.editTabs.current = 'colTab';
			html.editTabs.changeActive('colTab');
			stage.addChild(colMap);
			app.bgMode = false;
			app.bg2Mode = false;
			app.fgMode = false;
			app.collisionMode = true;
		};

		function makeArray(num) {
			var arr = new Array(mapHeight);
			for (var i = 0 ; i < mapHeight ; i++) {
				arr[i] = new Array(mapWidth);
				for (var j = 0 ; j < mapWidth ; j++) {
					arr[i][j] = num;
				}
			}
			return arr;
		}

		var bgArr = makeArray(-1);
		var bgArr2 = makeArray(-1);
		var fgArr = makeArray(-1);
		var colArr = makeArray(0);
		
		var bgMap = new Map(16, 16);
		var fgMap = new Map(16, 16);
		var colMap = new Map(16, 16);
		bgMap.image = fgMap.image = game.assets[gameImage];
		colMap.image = game.assets['ui_16.png'];
		bgMap.loadData(bgArr, bgArr2);
		fgMap.loadData(fgArr);
		colMap.loadData(colArr);
		colMap.paintNum = 0;
		colMap.getPaintNum = function() {
			var num = this._data[0][app.chipY][app.chipX];
			if (num == 0) {
				this.paintNum = 1;
			} else {
				this.paintNum = 0;
			}
		};
		colMap.paint = function() {
			this._data[0][app.chipY][app.chipX] = this.paintNum;
			this.image = game.assets['ui_16.png'];
		};
		
		app.maps.bgMap = bgMap;
		app.maps.fgMap = fgMap;
		app.maps.colMap = colMap;

		var bg = new Sprite(640, 480);
		
		var stage = new Group();
		stage.addChild(bgMap);
		stage.addChild(fgMap);
		game.rootScene.addChild(stage);
		game.rootScene.addChild(bg);
		game.rootScene.backgroundColor = '#eee';
		
		game.rootScene.addEventListener('leftbuttondown', function() {
			stage.x -= 8;
		});
		game.rootScene.addEventListener('rightbuttondown', function() {
			stage.x += 8;
		});
		game.rootScene.addEventListener('upbuttondown', function() {
			stage.y -= 8;
		});
		game.rootScene.addEventListener('downbuttondown', function() {
			stage.y += 8;
		});

		game.rootScene.addEventListener('abuttondown', function() {
			bgMap.addMap();
		});

		bg.addEventListener('touchstart', function(e) {
			app.chipX = Math.floor(e.localX / 16) | 0;
			app.chipY = Math.floor(e.localY / 16) | 0;
			app.chipX -= Math.floor(stage.x / 16) | 0;
			app.chipY -= Math.floor(stage.y / 16) | 0;
			if (app.chipX >= mapWidth || app.chipY >= mapHeight) {
				return;
			}
			if (app.collisionMode) {
				colMap.getPaintNum();
				colMap.paint();
			} else if (app.bgMode) {
				bgMap.changeChip(); 
			} else {
				fgMap.changeChip();
			}
		});

		game.rootScene.addEventListener('touchmove', function(e) {
			app.chipX = Math.floor(e.localX / 16) | 0;
			app.chipY = Math.floor(e.localY / 16) | 0;
			app.chipX -= Math.floor(stage.x / 16) | 0;
			app.chipY -= Math.floor(stage.y / 16) | 0;
			if (app.chipX >= mapWidth || app.chipY >= mapHeight) {
				return;
			}
			if (app.collisionMode) {
				colMap.paint();
			} else if (app.bgMode) {	
				bgMap.changeChip(0); 
			} else {
				fgMap.changeChip(0);
			}
		});
    };
    game.start();
}

