/**
 * Created by 彬 on 2015/3/6.
 */

class Hello2048 extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.startGame, this);
    }

    public startGame():void {
        egret.Profiler.getInstance().run();//看帧率的？

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
        RES.loadGroup("preload");
    }//以上都是固定代码

    private uiStage:egret.gui.UIStage;  //主舞台
    private score:number = 0;
    private topScore:number;               //这个是真正的总分
    private label:egret.gui.Label;
    private key:string = "best";

    private tempX:number;
    private tempY:number;
    private touchInProcess:boolean;
    private cell:Grid[][] = new Array(4);

//UI
    private desktopSide:number = 480;   //界面宽度
    private title;  //标题栏
    private _titleBarHeight:number = 60;
    private desktop;    //绘制区域,也是触摸区域
    private hasGameOver:boolean;           //判断游戏是否结束

    private onResourceLoadComplete(event:RES.ResourceEvent):void {

        this.uiStage = new egret.gui.UIStage();  //UI的容器
        this.addChild(this.uiStage);

        this.titleBarDraw();
        this.desktopDraw();
        this.cellFormat();

        this.init();
        this.inputListener();
    }

    private init() {
        this.hasGameOver = false;
        var i, j:number;
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                this.cell[i][j].valueNew = this.cell[i][j].valueOld = 0;
            }
        }
        this.score = 0;
        this.newGrid();
        this.newGrid();
        this.refresh();
    }   //初始化

    private setTopScore() {
        var topScoreString:string = "null"; //本地存储只能存字符串，这个是总分的字符串形式
        if (egret.localStorage.getItem(this.key)) { //本地存着有数据
            topScoreString = egret.localStorage.getItem(this.key);
            this.topScore = +topScoreString;
        }
        this.topScore = this.topScore > this.score ? this.topScore : this.score;
        topScoreString = this.topScore.toString();
        egret.localStorage.setItem("best", topScoreString);
    }   //判断是否创纪录

    private refresh():void {
        var i, j:number;
        this.setTopScore();
        this.label.text = "总  分：" + this.score + "\n最高分：" + this.topScore;  //显示总分
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                this.cell[i][j].drawSelf();
            }
        }
    }   //刷新ui

    private newGrid():void {
        var newbieLocation, nullCount, newbieNumber:number;
        var nullGroup:number[];

        nullCount = 0;
        nullGroup = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.cell[i][j].valueOld == 0) {
                    nullGroup[nullCount] = i * 4 + j;
                    nullCount += 1;
                }
            }
        }

        newbieLocation = Math.random() * nullCount ^ 0;   //挑一个=0的格子出来
        newbieNumber = ((Math.random() + 1.5) ^ 0) * 2;  //随机一个2~4的数字

        var newRow = (nullGroup[newbieLocation] / 4) ^ 0;//row
        var newcol = nullGroup[newbieLocation] % 4;//col
        this.cell[newRow][newcol].valueNew = newbieNumber;

        var self = this;
        setTimeout(function () {
            self.cell[newRow][newcol].drawSelfLatter();
        }, 1);//延迟刷新新单元格

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
    }   //逻辑上出新单元格

    private lastAlert() {
        alert("游戏结束");
        this.init();
    }

    private merge(dir:boolean, rule:boolean):boolean {
        //dir = true ：向上or向左移动，dir=false：向下or向右移动
        //rule = true : 纵向，rule = false：横向
        var row, col, _row, _col, n, nStep:number;
        var flag:boolean = false;
        var temp:number[];

        for (_col = 0; _col < 4; _col++) {
            if (rule) {
                col = _col;
            } else {
                row = _col;
            }
            n = dir ? 0 : 3;
            nStep = dir ? 1 : -1;
            temp = [0, 0, 0, 0];

            for (_row = 0; _row < 4; _row++) {
                if (rule) {
                    row = dir ? _row : 3 - _row;
                } else {
                    col = dir ? _row : 3 - _row;
                }
                if (this.cell[row][col].valueOld != 0) {    //假如这个格子有数字
                    if (temp[n] == 0) {     //假如目标位没有数字，就存进去
                        temp[n] = this.cell[row][col].valueOld;
                    }
                    else if (temp[n] == this.cell[row][col].valueOld) { //目标位有数字且和当前遍历的数字相同，就把目标位的数字放大，同时目标位后移
                        temp[n] *= 2;
                        this.score = this.score + temp[n];
                        n = n + nStep;
                    }
                    else {  //目标位有数字，且和遍历的数字不等，那么直接存到下一个目标位，
                        n = n + nStep;
                        temp[n] = this.cell[row][col].valueOld;
                    }
                }
            }
            if (rule) {
                for (var l = 0; l < 4; l++) {
                    if (this.cell[l][col].valueOld != temp[l]) flag = true;
                    this.cell[l][col].valueNew = temp[l];
                }
            } else {
                for (var l = 0; l < 4; l++) {
                    if (this.cell[row][l].valueOld != temp[l]) flag = true;
                    this.cell[row][l].valueNew = temp[l];
                }
            }
        }
        return flag;
    }   //合并单元格

    private judement():boolean {
        //游戏结束之后的弹层也在这里
        //可以合成 false,不能合成：ture
        var flag:boolean = true;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.cell[i][j].valueNew == this.cell[i][j + 1].valueNew) flag = false;
            }
        }   //用来判断是否可以合成
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.cell[j][i].valueNew == this.cell[j + 1][i].valueNew) flag = false;
            }
        }   //用来判断是否可以合成
        return flag;
    }

    public inputListener() {
        var tapListener = this.desktop;
        var src = this;
        if (egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE) {
            //tapListener.addEventListener(egret.event.TouchEvent.TOUCH_BEGIN,this.onBegin,this);
            //tapListener.addEventListener(egret.TouchEvent.TOUCH_MOVE,(e)=>{},this);
            //tapListener.addEventListener(egret.TouchEvent.TOUCH_MOVE,(event:egret.event)=>{},this);
            tapListener.touchEnabled = true;
            tapListener.touchChildren = true;
            tapListener.addEventListener(
                egret.TouchEvent.TOUCH_BEGIN,
                function forBibao2(event:egret.TouchEvent) {
                    src.onTouchBegin(event);
                },
                this
            );
            tapListener.addEventListener(
                egret.TouchEvent.TOUCH_MOVE,
                function forBibao3(event:egret.TouchEvent) {
                    src.onTouchMove(event);
                },
                this
            );
        } else {
            document.addEventListener(
                "keydown",
                function forBibao(event:KeyboardEvent) {
                    src.onKeyDown(event);
                }
            );
        }
    }

    private onTouchBegin(event:egret.TouchEvent):void {
        this.tempX = event.localX;
        this.tempY = event.localY;
        this.touchInProcess = true;
    }   //处理触摸屏

    private onTouchMove(event:egret.TouchEvent):void {
        var xChange, yChange:number;
        var rule:boolean;
        var dir:boolean;
        var biggerChange:number;

        xChange = event.localX - this.tempX;
        yChange = event.localY - this.tempY;
        if (Math.max(Math.abs(xChange), Math.abs(yChange)) >= 8 && this.touchInProcess) {
            this.touchInProcess = false;
            biggerChange = (Math.abs(xChange) >= Math.abs(yChange)) ? xChange : yChange;
            rule = (Math.abs(yChange) >= Math.abs(xChange));
            dir = biggerChange < 0;
            if (this.merge(dir, rule)) {      //this.merge = false 只是表示不能移动
                this.afterMerge();
            }
        }
    }   //处理触摸屏

    private onKeyDown(event:KeyboardEvent) {
        if (this.hasGameOver) return;

        switch (event.keyCode) {
            case 38 ://上
                if (this.merge(true, true)) {      //this.merge = false 只是表示不能移动
                    this.afterMerge();
                }
                break;
            case 40://下
                if (this.merge(false, true)) {
                    this.afterMerge();
                }
                break;
            case 37://左
                if (this.merge(true, false)) {
                    this.afterMerge();
                }
                break;
            case 39://右
                if (this.merge(false, false)) {
                    this.afterMerge();
                }
                break;
        }
    }   //处理键盘

    private afterMerge():void {
        this.refresh();
        this.newGrid();
    }

    public titleBarDraw() {   //绘制主界面，摆放元素位置。
        var titleHeight = this._titleBarHeight;
        this.title = new egret.Sprite;

        var titleBg = new egret.Bitmap;
        this.uiStage.addElement(this.title);

        titleBg.height = titleHeight;
        titleBg.width = 480;
        titleBg.texture = RES.getRes("titleBg");
        this.title.addChild(titleBg);

        var gameName = new egret.gui.Label();
        gameName.text = "2048";
        gameName.size = 36;
        gameName.height = titleHeight;
        gameName.verticalAlign = egret.VerticalAlign.MIDDLE;
        gameName.paddingLeft = 25;
        this.title.addChild(gameName);
    }

    public desktopDraw() {
        var titleHeight = this._titleBarHeight;
        this.desktop = new egret.Sprite;
        var desktopBg = new egret.Bitmap;
        desktopBg.texture = RES.getRes("desktopBg");
        this.desktop.addChild(desktopBg);
        this.desktop.y = titleHeight;
        this.desktop.width = desktopBg.width = 480;
        this.desktop.height = desktopBg.height = 580;
        this.uiStage.addElement(this.desktop);

        this.label = new egret.gui.Label();//总分
        this.label.x = 15;
        this.label.y = this.desktopSide - 15;
        this.label.padding = 10;
        this.label.lineSpacing = 10;
        this.label.size = 32;
        this.label.textColor = 0x3360B4;
        this.desktop.addChild(this.label);
    }

    public cellFormat() {
        var i, j:number;
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
    }
}