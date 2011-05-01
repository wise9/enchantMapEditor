function start(mapWidth, mapHeight, gameImage) {

	enchant.Map.prototype.fill = function(num, x, y) {          
		var matrix = this._data;
		var fillnum = matrix[num][y][x];
		var searchNewPoint = function(matrix, num, x, y, leftX, rightX) {
			var inFillArea = false;
			while(leftX <= rightX || inFillArea) {
				if(matrix[num][y][leftX] == fillnum) {
					inFillArea = true;
				}
				else if(inFillArea == true) {
					searchLine(matrix, num, leftX-1, y);
					inFillArea = false;
				}
				leftX++;
			}
		}
		var searchLine = function(matrix, num, x, y) {
			var leftX = x;
			var rightX = x;
			if(matrix[num][y][x] != fillnum)
				return;
			while(1) {
				if(rightX < matrix[num][y].length - 1 && matrix[num][y][rightX+1] == fillnum) {
					rightX++;
					matrix[num][y][rightX] = "tmp";
				}
				else
					break;
			}
			while(1) {
				if(rightX > 0 && matrix[num][y][leftX-1] == fillnum) {
					leftX--;
					matrix[num][y][leftX] = "tmp";
				}
				else
					break;
			}
			matrix[num][y][x] = "tmp";
			if(typeof matrix[num][y+1] != "undefined")
				searchNewPoint(matrix, num, x, y+1, leftX, rightX);
			if(typeof matrix[num][y-1] != "undefined")
				searchNewPoint(matrix, num, x, y-1, leftX, rightX);
		}
		searchLine(matrix, num, x, y);
		for(i in matrix[num]) {
			for(j in matrix[num][i]) {
				if(matrix[num][i][j] == "tmp")
					matrix[num][i][j] = app.selectedChip;
			}
		}
		this.image = game.assets[gameImage];
	};

	enchant.Map.prototype.changeChip = function(num, x, y) {
		this._data[num][y][x] = app.selectedChip;
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
			if (app.currentTab == 'bgTab') {
				return;
			}
			app.currentTab = 'bgTab';
			html.editTabs.changeActive('bgTab');
			app.bgLayer = 0;
		};
		var bg2Tab = document.getElementById('bgTab2');
		bg2Tab.onclick = function() {
			if (app.currentTab == 'bg2Tab') {
				return;
			}
			app.currentTab = 'bg2Tab';
			html.editTabs.changeActive('bg2Tab');
			app.bgLayer = 1;
		};
		var fgTab = document.getElementById('fgTab');
		fgTab.onclick = function() {
			if (app.currentTab == 'f1gTab') {
				return;
			}
			app.currentTab = 'fgTab';
			html.editTabs.changeActive('fgTab');
		};
		var colTab = document.getElementById('colTab');
		colTab.onclick = function() {
			if (app.currentTab == 'colTab') {
				return;
			}
			app.currentTab = 'colTab';
			html.editTabs.changeActive('colTab');
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
		colMap.getPaintNum = function(x, y) {
			var num = this._data[0][y][x];
			if (num == 0) {
				this.paintNum = 1;
			} else {
				this.paintNum = 0;
			}
		};
		colMap.paint = function(x, y) {
			this._data[0][y][x] = this.paintNum;
			this.image = game.assets['ui_16.png'];
		};
		
		app.maps.bgMap = bgMap;
		app.maps.fgMap = fgMap;
		app.maps.colMap = colMap;

		var mapFrame = new Sprite(mapWidth * 16, mapHeight * 16);
		var frame = new Surface(mapWidth * 16, mapHeight * 16);
		frame.context.strokeStyle = 'Red';
		frame.context.lineWidth = 4;
		frame.context.strokeRect(0, 0, mapWidth * 16, mapHeight * 16);
		mapFrame.image = frame;

		var bg = new Sprite(640, 480);
		
		var stage = new Group();
		stage.addChild(bgMap);
		stage.addChild(fgMap);
		stage.addChild(colMap);
		stage.addChild(mapFrame);
		game.rootScene.addChild(stage);
		game.rootScene.addChild(bg);
		game.rootScene.backgroundColor = '#eee';
		
		game.rootScene.addEventListener('leftbuttondown', function() {
			if (stage.x  <  0) {
				stage.x += 16;
			}
		});
		game.rootScene.addEventListener('rightbuttondown', function() {
			if (stage.x  > 640 - mapWidth * 16) {
				stage.x -= 16;
			}
		});
		game.rootScene.addEventListener('upbuttondown', function() {
			if (stage.y < 0) {
				stage.y += 16;
			}
		});
		game.rootScene.addEventListener('downbuttondown', function() {
			if (stage.y > 480 - mapHeight * 16) {
				stage.y -= 16;
			}
		});

		game.rootScene.addEventListener('abuttondown', function() {
			bgMap.addMap();
		});

		bg.addEventListener('touchstart', function(e) {
			app.chipX = Math.floor(e.localX / 16) | 0;
			app.chipY = Math.floor(e.localY / 16) | 0;
			app.chipX -= Math.floor(stage.x / 16) | 0;
			app.chipY -= Math.floor(stage.y / 16) | 0;
			if (app.chipX >= mapWidth || app.chipY >= mapHeight
				|| app.chipX < 0 || app.chipY < 0) {
				return;
			}
			switch (app.currentTab) {
			case 'bgTab':
			case 'bg2Tab':
				if (app.drawFunc == 'pen') {
					bgMap.changeChip(app.bgLayer, app.chipX, app.chipY); 
				} else if (app.drawFunc == 'fill') {
					bgMap.fill(app.bgLayer, app.chipX, app.chipY);
				}
				break;
			case 'fgTab':
				if (app.drawFunc == 'pen') {
					fgMap.changeChip(0, app.chipX, app.chipY); 
				} else if (app.drawFunc == 'fill') {
					fgMap.fill(0, app.chipX, app.chipY);
				}
				break;
			case 'colTab':
				colMap.getPaintNum(app.chipX, app.chipY);
				colMap.paint(app.chipX, app.chipY);
				break;
			default:
				break;
			}
		});

		game.rootScene.addEventListener('touchmove', function(e) {
			app.chipX = Math.floor(e.localX / 16) | 0;
			app.chipY = Math.floor(e.localY / 16) | 0;
			app.chipX -= Math.floor(stage.x / 16) | 0;
			app.chipY -= Math.floor(stage.y / 16) | 0;
			if (app.chipX >= mapWidth || app.chipY >= mapHeight
				|| app.chipX < 0 || app.chipY < 0) {
				return;
			}
			switch (app.currentTab) {
			case 'bgTab':
			case 'bg2Tab':
				if (app.drawFunc == 'pen') {
					bgMap.changeChip(app.bgLayer, app.chipX, app.chipY); 
				} else if (app.drawFunc == 'fill') {
					bgMap.fill(app.bgLayer, app.chipX, app.chipY);
				}
				break;
			case 'fgTab':
				if (app.drawFunc == 'pen') {
					fgMap.changeChip(0, app.chipX, app.chipY); 
				} else if (app.drawFunc == 'fill') {
					fgMap.fill(0, app.chipX, app.chipY);
				}
				break;
			case 'colTab':
				colMap.paint(app.chipX, app.chipY);
				break;
			default:
				break;
			}
		});
    };
    game.start();
}

