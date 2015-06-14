/**
 * Created by 彬 on 2015/3/6.
 */
var Hello2048 = (function (_super) {
    __extends(Hello2048, _super);
    function Hello2048() {
        _super.call(this);
        this.score = 0;
        this.nowScore = new egret.TextField;
        this.bestScore = new egret.TextField;
        this.cell = new Array(16);
        this.dataGrid = new Array(4);
        this.onMoving = false;
        this.lockTimeForAnimation = 200;
        //UI
        this.desktopSide = 720; //界面宽度
        this.desktopGao = 950; //界面总高度
        this._titleBarHeight = 0; //96
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.startGame, this);
    }
    var __egretProto__ = Hello2048.prototype;
    __egretProto__.startGame = function () {
        //egret.Profiler.getInstance().run();//看帧率的？
        window["gameBoy"] = this; //和Android接口用的
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
        RES.loadGroup("preload");
    }; //以上都是固定代码
    __egretProto__.onResourceLoadComplete = function (event) {
        console.log("{\"action\":\"loadComplete\"}");
        this.uiStage = new egret.gui.UIStage(); //UI的容器
        this.addChild(this.uiStage);
        //this.titleBarDraw();
        this.application(); //申请dataGrid 和 cellID；
        this.desktopDraw();
        this.reStart();
        this.inputListener();
        var ua = navigator.userAgent.toLowerCase();
        this.isIphone = ua.indexOf("iphone") > 0 || ua.indexOf("ipad") > 0;
    };
    __egretProto__.application = function () {
        var dataI, dataJ, cellI;
        for (dataI = 0; dataI < 4; dataI++) {
            this.dataGrid[dataI] = new Array(4);
            for (dataJ = 0; dataJ < 4; dataJ++) {
                this.dataGrid[dataI][dataJ] = new Data();
            }
        }
        for (cellI = 0; cellI < 16; cellI++) {
            this.cell[cellI] = new Grid(false);
        }
        var wid = document.documentElement.clientWidth;
        var hei = document.documentElement.clientHeight;
        console.log("wid:" + wid + "  hei:" + hei);
    };
    __egretProto__.reStart = function () {
        this.hasGameOver = false;
        var dataI, dataJ, cellI;
        for (dataI = 0; dataI < 4; dataI++) {
            for (dataJ = 0; dataJ < 4; dataJ++) {
                this.dataGrid[dataI][dataJ].newSelf();
            }
        }
        for (cellI = 0; cellI < 16; cellI++) {
            this.cell[cellI].newSelf();
        }
        this.newGrid();
        this.newGrid();
        this.refresh();
    }; //初始化
    __egretProto__.setTopScore = function () {
        if (!this.hasRead) {
            var topScoreString = "0"; //本地存储只能存字符串，这个是总分的字符串形式
            if (this.getCookie("best")) {
                topScoreString = this.getCookie("best");
                var t = parseInt(topScoreString);
                this.topScore = (isNaN(t) ? 4 : t);
                this.hasRead = true;
            }
            else {
                this.topScore = 4;
            }
        }
        var i, j;
        this.score = this.dataGrid[0][0].value;
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                this.score = this.dataGrid[i][j].value > this.score ? this.dataGrid[i][j].value : this.score;
            }
        }
        if (this.score > this.topScore) {
            this.topScore = this.score;
            if (this.topScore == null || this.topScore == undefined) {
                this.topScore = 4;
            }
            topScoreString = this.topScore.toString();
            this.setCookie("best", topScoreString);
        }
        this.topScore = Math.max(this.topScore, this.score);
    }; //判断是否创纪录
    __egretProto__.refresh = function () {
        this.setTopScore();
        var nowLever, bestLevel, topScoreString;
        switch (this.score) {
            case 2:
                nowLever = "学渣";
                break;
            case 4:
                nowLever = "学沫";
                break;
            case 8:
                nowLever = "学残";
                break;
            case 16:
                nowLever = "学水";
                break;
            case 32:
                nowLever = "学弱";
                break;
            case 64:
                nowLever = "学民";
                break;
            case 128:
                nowLever = "学优";
                break;
            case 256:
                nowLever = "学帝";
                break;
            case 512:
                nowLever = "学霸";
                break;
            case 1024:
                nowLever = "学圣";
                break;
            case 2048:
                nowLever = "学神";
                break;
            case 4096:
                nowLever = "超神";
                break;
        }
        switch (this.topScore) {
            case 2:
                bestLevel = "学渣";
                break;
            case 4:
                bestLevel = "学沫";
                break;
            case 8:
                bestLevel = "学残";
                break;
            case 16:
                bestLevel = "学水";
                break;
            case 32:
                bestLevel = "学弱";
                break;
            case 64:
                bestLevel = "学民";
                break;
            case 128:
                bestLevel = "学优";
                break;
            case 256:
                bestLevel = "学帝";
                break;
            case 512:
                bestLevel = "学霸";
                break;
            case 1024:
                bestLevel = "学圣";
                break;
            case 2048:
                bestLevel = "学神";
                break;
            case 4096:
                bestLevel = "超神";
                break;
            default: {
                this.topScore = 4;
                topScoreString = this.topScore.toString();
                this.setCookie("best", topScoreString);
            }
        }
        this.nowScore.textFlow = [
            { text: nowLever, style: { "size": 60 } },
            { text: "\n当前段位", style: { "size": 24 } }
        ];
        this.bestScore.textFlow = [
            { text: bestLevel, style: { "textColor": 0xFFFFFF, "size": 60 } },
            { text: "\n最高段位", style: { "textColor": 0xFFFFFF, "size": 24 } }
        ];
    }; //刷新ui
    __egretProto__.newGrid = function () {
        var newbieLocation, nullCount, newbieNumber;
        var nullGroup;
        nullCount = 0;
        nullGroup = new Array(16);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.dataGrid[i][j].value == 0) {
                    nullGroup[nullCount] = i * 4 + j;
                    nullCount += 1;
                }
            }
        }
        newbieLocation = Math.random() * nullCount ^ 0; //挑一个=0的格子出来
        newbieNumber = (Math.random() > 0.5) ? 2 : 4; //随机一个2~4的数字
        var newRow = (nullGroup[newbieLocation] / 4) ^ 0; //row
        var newCol = nullGroup[newbieLocation] % 4; //col
        this.dataGrid[newRow][newCol].value = newbieNumber;
        //找一个空cell出来。
        var newCell;
        for (newCell = 0; newCell < 16; newCell++) {
            if (!this.cell[newCell].isFilled) {
                break;
            }
        }
        this.desktop.addChild(this.cell[newCell]);
        this.cell[newCell].isFilled = true;
        this.cell[newCell].col = newCol;
        this.cell[newCell].row = newRow;
        this.cell[newCell].x = newCol * 160 + 20;
        this.cell[newCell].y = newRow * 160 + 20;
        this.dataGrid[newRow][newCol].cellID = newCell;
        this.cell[newCell].drawSelfLatter(newbieNumber);
        var self = this;
        if (nullCount == 1 && this.judge()) {
            this.refresh();
            this.hasGameOver = true;
            setTimeout(function () {
                self.gameOver();
            }, this.lockTimeForAnimation);
        }
    }; //逻辑上出新单元格
    __egretProto__.gameOver = function () {
        if (this.isIphone) {
            alert("游戏结束，请再接再厉");
            this.reStart();
        }
        else {
            console.log("{\"action\":\"gameover\",\"score\":\"" + this.score + "\",\"score2\":\"" + this.topScore + "\",\"gameId\":\"2048\"}");
        }
    };
    __egretProto__.merge = function (dir, rule) {
        //dir = true ：向上or向左移动，dir=false：向下or向右移动
        //rule = true : 纵向，rule = false：横向
        var row, col, _row, _col, n, nStep, gridValue, gridCellID;
        var flag = false;
        var temp = new Array(4);
        var nMean;
        for (_col = 0; _col < 4; _col++) {
            // 不管怎么样，row都是行，col都是列
            if (rule) {
                col = _col;
                nMean = "row";
            }
            else {
                row = _col;
                nMean = "col";
            }
            n = dir ? 0 : 3;
            nStep = dir ? 1 : -1;
            for (var z = 0; z < 4; z++) {
                temp[z] = new Data();
            }
            for (_row = 0; _row < 4; _row++) {
                if (rule) {
                    row = dir ? _row : 3 - _row;
                }
                else {
                    col = dir ? _row : 3 - _row;
                }
                gridValue = this.dataGrid[row][col].value;
                gridCellID = this.dataGrid[row][col].cellID;
                if (gridValue == 0)
                    continue; //假如这个格子没有数字直接进入下一个格子
                switch (temp[n].value) {
                    case 0:
                        {
                            temp[n].value = gridValue;
                            temp[n].cellID = gridCellID;
                            this.cell[gridCellID][nMean] = n;
                        }
                        break;
                    case gridValue:
                        {
                            temp[n].value *= 2;
                            this.score = this.score + temp[n].value;
                            this.cell[gridCellID][nMean] = n;
                            this.cell[gridCellID].needDis = true;
                            this.cell[temp[n].cellID].needBig = true;
                            n = n + nStep;
                        }
                        break;
                    default: {
                        n = n + nStep;
                        temp[n].value = gridValue;
                        temp[n].cellID = gridCellID;
                        this.cell[gridCellID][nMean] = n;
                    }
                }
            }
            if (rule) {
                for (var l = 0; l < 4; l++) {
                    if (this.dataGrid[l][col].value != temp[l].value)
                        flag = true;
                    this.dataGrid[l][col].value = temp[l].value;
                    this.dataGrid[l][col].cellID = temp[l].cellID;
                }
            }
            else {
                for (var l = 0; l < 4; l++) {
                    if (this.dataGrid[row][l].value != temp[l].value)
                        flag = true;
                    this.dataGrid[row][l].value = temp[l].value;
                    this.dataGrid[row][l].cellID = temp[l].cellID;
                }
            }
        }
        this.cellMove();
        this.refresh();
        if (flag) {
            var selfAtMerge = this;
            setTimeout(function () {
                selfAtMerge.newGrid();
            }, selfAtMerge.lockTimeForAnimation); //先移动，然后再摧毁单元格
        }
        return flag;
    }; //合并单元格
    __egretProto__.cellMove = function () {
        var tempId, temp_col, temp_row, cellValue;
        for (tempId = 0; tempId < 16; tempId++) {
            if (this.cell[tempId].isFilled) {
                temp_row = this.cell[tempId].row;
                temp_col = this.cell[tempId].col;
                cellValue = this.dataGrid[temp_row][temp_col].value;
                this.cell[tempId].move();
                this.cell[tempId].drawSelf(cellValue);
            }
        }
    };
    __egretProto__.judge = function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.dataGrid[i][j].value == this.dataGrid[i][j + 1].value)
                    return false;
            }
        }
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.dataGrid[j][i].value == this.dataGrid[j + 1][i].value)
                    return false;
            }
        }
        return true;
    };
    __egretProto__.inputListener = function () {
        var tapListener = this.desktop;
        var src = this;
        tapListener.touchEnabled = true;
        tapListener.touchChildren = true;
        tapListener.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function forBiBao2(event) {
            src.onTouchBegin(event);
        }, this);
        tapListener.addEventListener(egret.TouchEvent.TOUCH_MOVE, function forBiBao3(event) {
            src.onTouchMove(event);
        }, this);
        if (egret.MainContext.deviceType != egret.MainContext.DEVICE_MOBILE) {
            document.addEventListener("keydown", function forBiBao(event) {
                src.onKeyDown(event);
            });
        }
    };
    __egretProto__.onTouchBegin = function (event) {
        if (this.onMoving)
            return;
        this.tempX = event.localX;
        this.tempY = event.localY;
        this.touchInProcess = true;
    }; //处理触摸屏
    __egretProto__.onTouchMove = function (event) {
        var xChange, yChange;
        var rule;
        var dir;
        var biggerChange;
        xChange = event.localX - this.tempX;
        yChange = event.localY - this.tempY;
        if (Math.abs(Math.abs(xChange) - Math.abs(yChange)) >= 8 && this.touchInProcess) {
            this.lockForAnimation();
            this.touchInProcess = false;
            biggerChange = (Math.abs(xChange) >= Math.abs(yChange)) ? xChange : yChange;
            rule = (Math.abs(yChange) >= Math.abs(xChange));
            dir = biggerChange < 0;
            this.merge(dir, rule);
        }
    }; //处理触摸屏
    __egretProto__.lockForAnimation = function () {
        this.onMoving = true;
        var self = this;
        setTimeout(function () {
            self.onMoving = false;
        }, this.lockTimeForAnimation); //锁定时间内不接收输入
    };
    __egretProto__.onKeyDown = function (event) {
        if (this.hasGameOver)
            return;
        if (this.onMoving)
            return;
        this.lockForAnimation();
        switch (event.keyCode) {
            case 38:
                this.merge(true, true);
                break;
            case 40:
                this.merge(false, true);
                break;
            case 37:
                this.merge(true, false);
                break;
            case 39:
                this.merge(false, false);
                break;
        }
    }; //处理键盘
    __egretProto__.titleBarDraw = function () {
        var titleHeight = this._titleBarHeight;
        this.title = new egret.Sprite;
        var titleBg = new egret.Bitmap;
        this.uiStage.addElement(this.title);
        titleBg.height = titleHeight;
        titleBg.width = this.desktopSide;
        //this.title.percentWidth = 100;
        //this.title.graphics.beginFill(0x00F000);
        //this.title.graphics.drawRect(0,0,this.desktopSide,this.desktopSide);
        //this.title.graphics.endFill();
        titleBg.texture = RES.getRes("titleBg");
        titleBg.fillMode = egret.BitmapFillMode.REPEAT;
        this.title.addChild(titleBg);
        var gameName = new egret.gui.Label();
        gameName.text = "2048";
        gameName.size = 36;
        gameName.height = titleHeight;
        gameName.verticalAlign = egret.VerticalAlign.MIDDLE;
        gameName.paddingLeft = 25;
        this.title.addChild(gameName);
    };
    __egretProto__.desktopDraw = function () {
        this.desktop = new egret.Sprite;
        this.desktop.graphics.beginFill();
        this.desktop.graphics.drawRect(0, 0, this.desktopSide, this.desktopSide);
        this.desktop.graphics.endFill();
        this.desktop.y = this._titleBarHeight;
        this.desktop.width = this.desktopSide;
        this.desktop.height = this.desktopGao - this._titleBarHeight;
        this.uiStage.addElement(this.desktop);
        this.nowScore.x = 25;
        this.nowScore.y = this.desktopSide;
        this.nowScore.lineSpacing = 10;
        this.nowScore.textColor = 0xFFFFFF;
        this.desktop.addChild(this.nowScore);
        this.bestScore.x = 100;
        this.bestScore.y = this.desktopSide;
        this.bestScore.lineSpacing = 10;
        this.nowScore.textColor = 0xFFFFFF;
        this.bestScore.width = this.desktopSide - 30 - 100;
        this.bestScore.textAlign = egret.HorizontalAlign.RIGHT;
        this.desktop.addChild(this.bestScore);
        //画0
        var i;
        var bgCell = new Array(16);
        for (i = 0; i < 16; i++) {
            bgCell[i] = new Grid(true);
            bgCell[i].x = (i % 4) * 160 + 20;
            bgCell[i].y = ((i / 4) ^ 0) * 160 + 20;
            this.desktop.addChild(bgCell[i]);
        }
    };
    __egretProto__.setCookie = function (key, value) {
        var date = new Date();
        date.setTime(date.getTime() + 1 * 1000 * 3600 * 24 * 365);
        document.cookie = key + "=" + encodeURI(value) + ";expires=" + date.toUTCString() + ";path=/";
    };
    __egretProto__.getCookie = function (key) {
        var cookie = document.cookie, regExp = new RegExp("[sS]*" + key + "=([^;]*)(;|$)"), ret = cookie.match(regExp);
        if (ret != null) {
            return ret[1];
        }
        return null;
    };
    return Hello2048;
})(egret.DisplayObjectContainer);
Hello2048.prototype.__class__ = "Hello2048";
