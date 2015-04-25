/**
 * Created by 彬 on 2015/3/6.
 */
var Hello2048 = (function (_super) {
    __extends(Hello2048, _super);
    function Hello2048() {
        _super.call(this);
        this.score = 0;
        this.key = "best";
        this.cell = new Array(4);
        //UI
        this.desktopSide = 480; //界面宽度
        this._titleBarHeight = 60;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.startGame, this);
    }
    var __egretProto__ = Hello2048.prototype;
    __egretProto__.startGame = function () {
        //egret.Profiler.getInstance().run();//看帧率的？
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
        RES.loadGroup("preload");
    }; //以上都是固定代码
    __egretProto__.onResourceLoadComplete = function (event) {
        this.uiStage = new egret.gui.UIStage(); //UI的容器
        this.addChild(this.uiStage);
        this.titleBarDraw();
        this.desktopDraw();
        this.cellFormat();
        this.init();
        this.inputListener();
    };
    __egretProto__.init = function () {
        this.hasGameOver = false;
        var i, j;
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                this.cell[i][j].valueNew = this.cell[i][j].valueOld = 0;
            }
        }
        this.score = 0;
        this.newGrid();
        this.newGrid();
        this.refresh();
    }; //初始化
    __egretProto__.setTopScore = function () {
        var topScoreString = "null"; //本地存储只能存字符串，这个是总分的字符串形式
        if (egret.localStorage.getItem(this.key)) {
            topScoreString = egret.localStorage.getItem(this.key);
            this.topScore = +topScoreString;
        }
        //this.score是即时计算出来的总分，我们不需要这个，直接看当前的最大数字（总分仍然在计算，但是被最大数字替换了）。
        var i, j;
        this.score = this.cell[0][0].valueNew;
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                this.score = this.cell[i][j].valueNew > this.score ? this.cell[i][j].valueNew : this.score;
            }
        }
        this.topScore = Math.max(this.topScore, this.score);
        topScoreString = this.topScore.toString();
        egret.localStorage.setItem("best", topScoreString);
    }; //判断是否创纪录
    __egretProto__.refresh = function () {
        var i, j;
        this.setTopScore();
        var nowLever, bestLevel;
        switch (this.score) {
            case 0:
                nowLever = "";
                break;
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
                nowLever = "";
                break;
        }
        switch (this.topScore) {
            case 0:
                bestLevel = "";
                break;
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
                bestLevel = "";
                break;
        }
        this.label.text = "当前成绩：" + nowLever + "\n最高成绩：" + bestLevel; //显示总分
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                this.cell[i][j].drawSelf();
            }
        }
    }; //刷新ui
    __egretProto__.newGrid = function () {
        var newbieLocation, nullCount, newbieNumber;
        var nullGroup;
        nullCount = 0;
        nullGroup = new Array(16);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.cell[i][j].valueOld == 0) {
                    nullGroup[nullCount] = i * 4 + j;
                    nullCount += 1;
                }
            }
        }
        newbieLocation = Math.random() * nullCount ^ 0; //挑一个=0的格子出来
        newbieNumber = ((Math.random() + 1.5) ^ 0) * 2; //随机一个2~4的数字
        var newRow = (nullGroup[newbieLocation] / 4) ^ 0; //row
        var newCol = nullGroup[newbieLocation] % 4; //col
        this.cell[newRow][newCol].valueNew = newbieNumber;
        var self = this;
        setTimeout(function () {
            self.cell[newRow][newCol].drawSelfLatter();
        }, 1); //延迟刷新新单元格
        if (nullCount == 1) {
            var self = this;
            if (this.judement()) {
                this.refresh();
                this.hasGameOver = true;
                setTimeout(function () {
                    self.lastAlert();
                }, 200);
            }
        }
    }; //逻辑上出新单元格
    __egretProto__.lastAlert = function () {
        alert("游戏结束");
        this.init();
    };
    __egretProto__.merge = function (dir, rule) {
        //dir = true ：向上or向左移动，dir=false：向下or向右移动
        //rule = true : 纵向，rule = false：横向
        var row, col, _row, _col, n, nStep;
        var flag = false;
        var temp;
        for (_col = 0; _col < 4; _col++) {
            if (rule) {
                col = _col;
            }
            else {
                row = _col;
            }
            n = dir ? 0 : 3;
            nStep = dir ? 1 : -1;
            temp = [0, 0, 0, 0];
            for (_row = 0; _row < 4; _row++) {
                if (rule) {
                    row = dir ? _row : 3 - _row;
                }
                else {
                    col = dir ? _row : 3 - _row;
                }
                if (this.cell[row][col].valueOld != 0) {
                    if (temp[n] == 0) {
                        temp[n] = this.cell[row][col].valueOld;
                    }
                    else if (temp[n] == this.cell[row][col].valueOld) {
                        temp[n] *= 2;
                        this.score = this.score + temp[n];
                        n = n + nStep;
                    }
                    else {
                        n = n + nStep;
                        temp[n] = this.cell[row][col].valueOld;
                    }
                }
            }
            if (rule) {
                for (var l = 0; l < 4; l++) {
                    if (this.cell[l][col].valueOld != temp[l])
                        flag = true;
                    this.cell[l][col].valueNew = temp[l];
                }
            }
            else {
                for (var l = 0; l < 4; l++) {
                    if (this.cell[row][l].valueOld != temp[l])
                        flag = true;
                    this.cell[row][l].valueNew = temp[l];
                }
            }
        }
        return flag;
    }; //合并单元格
    __egretProto__.judement = function () {
        //游戏结束之后的弹层也在这里
        //可以合成 false,不能合成：ture
        var flag = true;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.cell[i][j].valueNew == this.cell[i][j + 1].valueNew)
                    flag = false;
            }
        }
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.cell[j][i].valueNew == this.cell[j + 1][i].valueNew)
                    flag = false;
            }
        }
        return flag;
    };
    __egretProto__.inputListener = function () {
        var tapListener = this.desktop;
        var src = this;
        if (egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE) {
            //tapListener.addEventListener(egret.event.TouchEvent.TOUCH_BEGIN,this.onBegin,this);
            //tapListener.addEventListener(egret.TouchEvent.TOUCH_MOVE,(e)=>{},this);
            //tapListener.addEventListener(egret.TouchEvent.TOUCH_MOVE,(event:egret.event)=>{},this);
            tapListener.touchEnabled = true;
            tapListener.touchChildren = true;
            tapListener.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function forBibao2(event) {
                src.onTouchBegin(event);
            }, this);
            tapListener.addEventListener(egret.TouchEvent.TOUCH_MOVE, function forBibao3(event) {
                src.onTouchMove(event);
            }, this);
        }
        else {
            document.addEventListener("keydown", function forBibao(event) {
                src.onKeyDown(event);
            });
        }
    };
    __egretProto__.onTouchBegin = function (event) {
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
        if (Math.max(Math.abs(xChange), Math.abs(yChange)) >= 8 && this.touchInProcess) {
            this.touchInProcess = false;
            biggerChange = (Math.abs(xChange) >= Math.abs(yChange)) ? xChange : yChange;
            rule = (Math.abs(yChange) >= Math.abs(xChange));
            dir = biggerChange < 0;
            if (this.merge(dir, rule)) {
                this.afterMerge();
            }
        }
    }; //处理触摸屏
    __egretProto__.onKeyDown = function (event) {
        if (this.hasGameOver)
            return;
        switch (event.keyCode) {
            case 38:
                if (this.merge(true, true)) {
                    this.afterMerge();
                }
                break;
            case 40:
                if (this.merge(false, true)) {
                    this.afterMerge();
                }
                break;
            case 37:
                if (this.merge(true, false)) {
                    this.afterMerge();
                }
                break;
            case 39:
                if (this.merge(false, false)) {
                    this.afterMerge();
                }
                break;
        }
    }; //处理键盘
    __egretProto__.afterMerge = function () {
        this.refresh();
        this.newGrid();
    };
    __egretProto__.titleBarDraw = function () {
        var titleHeight = this._titleBarHeight;
        this.title = new egret.Sprite;
        var titleBg = new egret.Bitmap;
        this.uiStage.addElement(this.title);
        titleBg.height = titleHeight;
        titleBg.width = 480;
        titleBg.texture = RES.getRes("titleBg");
        this.title.addChild(titleBg);
        var gameName = new egret.gui.Label();
        gameName.text = "学霸成长记";
        gameName.size = 36;
        gameName.height = titleHeight;
        gameName.verticalAlign = egret.VerticalAlign.MIDDLE;
        gameName.paddingLeft = 25;
        this.title.addChild(gameName);
    };
    __egretProto__.desktopDraw = function () {
        var titleHeight = this._titleBarHeight;
        this.desktop = new egret.Sprite;
        var desktopBg = new egret.Bitmap;
        desktopBg.texture = RES.getRes("desktopBg");
        this.desktop.addChild(desktopBg);
        this.desktop.y = titleHeight;
        this.desktop.width = desktopBg.width = 480;
        this.desktop.height = desktopBg.height = 580;
        this.uiStage.addElement(this.desktop);
        this.label = new egret.gui.Label(); //总分
        this.label.x = 15;
        this.label.y = this.desktopSide - 15;
        this.label.padding = 10;
        this.label.lineSpacing = 10;
        this.label.size = 32;
        this.label.textColor = 0x3360B4;
        this.desktop.addChild(this.label);
    };
    __egretProto__.cellFormat = function () {
        var i, j;
        for (i = 0; i < 4; i++) {
            this.cell[i] = new Array(4);
            for (j = 0; j < 4; j++) {
                this.cell[i][j] = new Grid();
                this.cell[i][j].format(110, 5);
                this.cell[i][j].x = j * 110 + 20;
                this.cell[i][j].y = i * 110 + 20;
                this.desktop.addChild(this.cell[i][j]);
            }
        }
    };
    return Hello2048;
})(egret.DisplayObjectContainer);
Hello2048.prototype.__class__ = "Hello2048";
