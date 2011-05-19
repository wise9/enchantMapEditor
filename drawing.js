enchant.Map.prototype.fillData = function(index, x, y, paintNum) {          
	var game = enchant.Game.instance;
	var matrix = this._data;
	var fillnum = matrix[index][y][x];
	var searchNewPoint = function(matrix, index, x, y, leftX, rightX) {
		var inFillArea = false;
		while (leftX <= rightX || inFillArea) {
			if (matrix[index][y][leftX] == fillnum) {
				inFillArea = true;
			}
			else if (inFillArea == true) {
				searchLine(matrix, index, leftX-1, y);
				inFillArea = false;
			}
			leftX++;
		}
	}
	var searchLine = function(matrix, index, x, y) {
		var leftX = x;
		var rightX = x;
		if (matrix[index][y][x] != fillnum)
			return;
		while (1) {
			if (rightX < matrix[index][y].length - 1 && matrix[index][y][rightX+1] == fillnum) {
				rightX++;
				matrix[index][y][rightX] = "tmp";
			}
			else
				break;
		}
		while (1) {
			if (rightX > 0 && matrix[index][y][leftX-1] == fillnum) {
				leftX--;
				matrix[index][y][leftX] = "tmp";
			}
			else
				break;
		}
		matrix[index][y][x] = "tmp";
		if (typeof matrix[index][y+1] != "undefined")
			searchNewPoint(matrix, index, x, y+1, leftX, rightX);
		if (typeof matrix[index][y-1] != "undefined")
			searchNewPoint(matrix, index, x, y-1, leftX, rightX);
	}
	searchLine(matrix, index, x, y);
	for (var i = 0, l = matrix[0].length; i < l; i++) {
		for (var j = 0, ll = matrix[0][0].length; j < ll; j++) {
			if (matrix[index][i][j] == "tmp")
				matrix[index][i][j] = paintNum;
		}
	}
	this.redraw(0, 0, game.width, game.height);
};

enchant.Map.prototype.changeData = function(index, x, y, paintNum) {
	var game = enchant.Game.instance;
	this._data[index][y][x] = paintNum;
	this.redraw(0, 0, game.width, game.height);
};
enchant.Map.prototype.addMap = function() {
	var game = enchant.Game.instance;
	var arr = new Array();
	var l = Math.floor(game.height/16);
	var ll = Math.floor();
	for (var i = 0; i < l; i++) {
		arr[i] = new Array();
		for (var j = 0; j < ll; j++) {
			arr[i][j] = -1;
		}
	}
	var newArr = this._data.push(arr);
	this.loadData(newArr);
};

enchant.Map.prototype.getDataCode = function(mapName, imagePath) {
    var txt = 'var ' + mapName + ' = new Map(16, 16);\n';
    txt += mapName + ".image = game.assets['" + imagePath + "'];\n"; 
    txt += mapName + '.background.loadData(';
    for (var i = 0, l = this._data.length; i < l; i++) {
        txt += '[\n'
        for (var j = 0, ll = this._data[0].length; j < ll; j++) {
            txt += '    [';
            txt += this._data[i][j].toString();
            txt += '],\n';
        }   
        txt = txt.slice(0,-2);
        txt += '\n],'
    }   
    txt = txt.slice(0,-1);
    txt += ');\n';
	if (this.collisionData != null) {
		txt += mapName + '.collisionData = [\n';
		for (var i = 0, l = this.collisionData.length; i < l; i++) {
			txt += '    [';
			txt += this.collisionData[i].toString();
			txt += '],\n';
		}   
		txt = txt.slice(0,-2);
		txt += '\n];\n';
	}
	return txt;
};



// ExMap向け
enchant.extendMap.ExMap.prototype.fillType = function(index, x, y, paintNum) {          
	var game = enchant.Game.instance;
	var matrix = this._typeData;
	var fillnum = matrix[index][y][x];
	var searchNewPoint = function(matrix, index, x, y, leftX, rightX) {
		var inFillArea = false;
		while (leftX <= rightX || inFillArea) {
			if (matrix[index][y][leftX] == fillnum) {
				inFillArea = true;
			}
			else if (inFillArea == true) {
				searchLine(matrix, index, leftX-1, y);
				inFillArea = false;
			}
			leftX++;
		}
	}
	var searchLine = function(matrix, index, x, y) {
		var leftX = x;
		var rightX = x;
		if (matrix[index][y][x] != fillnum)
			return;
		while (1) {
			if (rightX < matrix[index][y].length - 1 && matrix[index][y][rightX+1] == fillnum) {
				rightX++;
				matrix[index][y][rightX] = "tmp";
			}
			else
				break;
		}
		while (1) {
			if (rightX > 0 && matrix[index][y][leftX-1] == fillnum) {
				leftX--;
				matrix[index][y][leftX] = "tmp";
			}
			else
				break;
		}
		matrix[index][y][x] = "tmp";
		if (typeof matrix[index][y+1] != "undefined")
			searchNewPoint(matrix, index, x, y+1, leftX, rightX);
		if (typeof matrix[index][y-1] != "undefined")
			searchNewPoint(matrix, index, x, y-1, leftX, rightX);
	}
	searchLine(matrix, index, x, y);
	for (var i = 0, l = matrix[0].length; i < l; i++) {
		for (var j = 0, ll = matrix[0][0].length; j < ll; j++) {
			if (matrix[index][i][j] == "tmp")
				matrix[index][i][j] = paintNum;
		}
	}
	this.type2data();
	this.redraw(0, 0, game.width, game.height);
};
enchant.extendMap.ExMap.prototype.changeType = function(index, x, y, paintNum) {
	var game = enchant.Game.instance;
	var xlen = this._typeData[0][0].length;
	var ylen = this._typeData[0].length;
	this._typeData[index][y][x] = paintNum;
	for (var i = -1; i < 2; i++) {
		for (var j = -1; j < 2; j++) {
			if (x + j >= 0 && x + j < xlen
				&& y + i >= 0 && y + i < ylen) {
				this._data[index][y+i][x+j] = this.searchPattern(index, x + j, y + i);
			}
		}
	}

	this.redraw(0, 0, game.width, game.height);
};
