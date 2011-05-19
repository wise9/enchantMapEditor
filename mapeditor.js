function start(mapWidth, mapHeight, gameImage, extend) {

    var game = new Game(640, 480);
    game.fps = 16;
	//game.keybind(16, 'a');	// shiftkey
    game.preload('ui_16.png', gameImage);
    game.onload = function() {

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
		if (extend) {
			var bgMap = new ExMap(16, 16);
			var fgMap = new ExMap(16, 16);
			var colMap = new Map(16, 16);
		} else {
			var bgMap = new Map(16, 16);
			var fgMap = new Map(16, 16);
			var colMap = new Map(16, 16);
		}
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
				if (app.extendMode && app.typeEdit) {
					if (app.drawFunc == 'pen') {
						bgMap.changeType(app.bgLayer, app.chipX, app.chipY, app.chipType);
					} else if (app.drawFunc == 'fill') {
						bgMap.fillType(app.bgLayer, app.chipX, app.chipY, app.chipType);
					}
				} else {
					if (app.drawFunc == 'pen') {
						bgMap.changeData(app.bgLayer, app.chipX, app.chipY, app.selectedChip);
					} else if (app.drawFunc == 'fill') {
						bgMap.fillData(app.bgLayer, app.chipX, app.chipY, app.selectedChip);
					}
				}
				break;
			case 'fgTab':
				if (app.extendMode && app.typeEdit) {
					if (app.drawFunc == 'pen') {
						fgMap.changeType(0, app.chipX, app.chipY, app.chipType);
					} else if (app.drawFunc == 'fill') {
						fgMap.fillType(0, app.chipX, app.chipY, app.chipType);
					}
				} else {
					if (app.drawFunc == 'pen') {
						fgMap.changeData(0, app.chipX, app.chipY, app.selectedChip);
					} else if (app.drawFunc == 'fill') {
						fgMap.fillData(0, app.chipX, app.chipY, app.selectedChip);
					}
				}
				break;
			case 'colTab':
				colMap.getPaintNum(app.chipX, app.chipY);
				if (app.drawFunc == 'pen') {
					colMap.changeData(0, app.chipX, app.chipY, colMap.paintNum);
				} else if (app.drawFunc == 'fill') {
					colMap.fillData(0, app.chipX, app.chipY, colMap.paintNum);
				}
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
				if (app.extendMode && app.typeEdit) {
					if (app.drawFunc == 'pen') {
						bgMap.changeType(app.bgLayer, app.chipX, app.chipY, app.chipType);
					} else if (app.drawFunc == 'fill') {
						bgMap.fillType(app.bgLayer, app.chipX, app.chipY, app.chipType);
					}
				} else {
					if (app.drawFunc == 'pen') {
						bgMap.changeData(app.bgLayer, app.chipX, app.chipY, app.selectedChip);
					} else if (app.drawFunc == 'fill') {
						bgMap.fillData(app.bgLayer, app.chipX, app.chipY, app.selectedChip);
					}
				}
				break;
			case 'fgTab':
				if (app.extendMode && app.typeEdit) {
					if (app.drawFunc == 'pen') {
						fgMap.changeType(0, app.chipX, app.chipY, app.chipType);
					} else if (app.drawFunc == 'fill') {
						fgMap.fillType(0, app.chipX, app.chipY, app.chipType);
					}
				} else {
					if (app.drawFunc == 'pen') {
						fgMap.changeData(0, app.chipX, app.chipY, app.selectedChip);
					} else if (app.drawFunc == 'fill') {
						fgMap.fillData(0, app.chipX, app.chipY, app.selectedChip);
					}
				}
				break;
			case 'colTab':
				if (app.drawFunc == 'pen') {
					colMap.changeData(0, app.chipX, app.chipY, colMap.paintNum);
				}
				break;
			default:
				break;
			}
		});
    };
    game.start();
}
