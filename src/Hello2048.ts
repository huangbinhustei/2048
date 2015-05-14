/**
 * Created by 彬 on 2015/3/6.
 */
class Hello2048 extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.startGame, this);
    }

    public startGame():void {
        window["gameBoy"] = this;
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
        RES.loadGroup("preload");
    }//以上都是固定代码

    private uiStage : egret.gui.UIStage;  //主舞台
    private score : number = 0;
    private topScore : number;

    private nowScore : egret.TextField = new egret.TextField;
    private bestScore : egret.TextField = new egret.TextField;

    private tempX : number;
    private tempY : number;
    private touchInProcess : boolean;
    private cell : Grid[][] = new Array(4);
//UI
    private desktopSide : number = 720;   //界面宽度
    private desktopGao : number = 950;     //界面总高度
    private title;  //标题栏
    private _titleBarHeight : number = 0; //96
    private _gridWidth = 160;
    private _gridGap = 10;
    private desktop;    //绘制区域,也是触摸区域
    private hasGameOver : boolean;           //判断游戏是否结束

    private hasRead : boolean;//这一把是否已经读取过数据了。

    private onResourceLoadComplete(event:RES.ResourceEvent):void {

        console.log("{\"action\":\"loadComplete\"}");

        this.uiStage = new egret.gui.UIStage();  //UI的容器
        this.addChild(this.uiStage);

        //this.titleBarDraw();
        this.desktopDraw();
        this.cellFormat();

        this.reStart();
        this.inputListener();
    }

    private reStart() {
        this.hasGameOver = false;
        var i, j:number;
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                this.cell[i][j].value = 0;
            }
        }
        this.score = 0;
        this.newGrid();
        this.newGrid();
        this.refresh();
    }   //初始化

    private setTopScore() {
        if (!this.hasRead) {
            var topScoreString:string = "0"; //本地存储只能存字符串，这个是总分的字符串形式
            if (this.getCookie("best")) { //本地存着有数据
                topScoreString = this.getCookie("best");
                var t : number = parseInt(topScoreString);
                this.topScore = (isNaN(t) ? 4 : t);
                this.hasRead = true;
            } else {
                this.topScore = 4;
            }
        }

        var i,j :number;
        this.score = this.cell[0][0].value;
        for (i = 0; i < 4; i ++) {
            for (j = 0; j < 4; j ++) {
                this.score = this.cell[i][j].value > this.score ? this.cell[i][j].value:this.score
            }
        }

        if (this.score > this.topScore) {
            this.topScore = this.score;
            if (this.topScore == null || this.topScore == undefined) {this.topScore = 4}
            topScoreString = this.topScore.toString();
            this.setCookie("best", topScoreString);
        }
        this.topScore = Math.max(this.topScore , this.score);

    }   //判断是否创纪录

    private refresh():void {
        var i, j:number;
        this.setTopScore();

        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                this.cell[i][j].drawSelf();
            }
        }

        var nowLever,bestLevel :string;
        switch (this.score) {
            case 2: nowLever = "学渣";break;
            case 4: nowLever = "学沫";break;
            case 8: nowLever = "学残";break;
            case 16: nowLever = "学水";break;
            case 32: nowLever = "学弱";break;
            case 64: nowLever = "学民";break;
            case 128: nowLever = "学优";break;
            case 256: nowLever = "学帝";break;
            case 512: nowLever = "学霸";break;
            case 1024: nowLever = "学圣";break;
            case 2048: nowLever = "学神";break;
            case 4096: nowLever = "超神";break;
        }
        switch (this.topScore) {
            case 2: bestLevel = "学渣";break;
            case 4: bestLevel = "学沫";break;
            case 8: bestLevel = "学残";break;
            case 16: bestLevel = "学水";break;
            case 32: bestLevel = "学弱";break;
            case 64: bestLevel = "学民";break;
            case 128: bestLevel = "学优";break;
            case 256: bestLevel = "学帝";break;
            case 512: bestLevel = "学霸";break;
            case 1024: bestLevel = "学圣";break;
            case 2048: bestLevel = "学神";break;
            case 4096: bestLevel = "超神";break;
            default : {
                this.topScore = this.score;
                if (!this.topScore) {this.topScore = 4}
                var topScoreString:string = this.topScore.toString();
                this.setCookie("best", topScoreString);
            }
        }

        this.nowScore.textFlow = <Array<egret.ITextElement>>[
            {text:nowLever,style:{"size":60}},
            {text:"\n当前段位",style:{"size":24}}
        ];

        this.bestScore.textFlow = <Array<egret.ITextElement>>[
            {text:bestLevel,style:{"textColor":0xFFFFFF,"size":60}},
            {text:"\n最高段位",style:{"textColor":0xFFFFFF,"size":24}}
        ];

    }   //刷新ui

    private newGrid():void {
        var newbieLocation, nullCount, newbieNumber:number;
        var nullGroup:number[];

        nullCount = 0;
        nullGroup = new Array(16);

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.cell[i][j].value == 0) {
                    nullGroup[nullCount] = i * 4 + j;
                    nullCount += 1;
                }
            }
        }

        newbieLocation = Math.random() * nullCount ^ 0;   //挑一个=0的格子出来
        newbieNumber = ((Math.random() + 1.5) ^ 0) * 2;  //随机一个2~4的数字

        var newRow = (nullGroup[newbieLocation] / 4) ^ 0;//row
        var newCol = nullGroup[newbieLocation] % 4;//col
        this.cell[newRow][newCol].value = newbieNumber;

        //var self = this;
        //setTimeout(function () {
        //    self.cell[newRow][newCol].drawSelf();
        //}, 100);//延迟刷新新单元格

        this.cell[newRow][newCol].drawSelfLater();

        if (nullCount == 1) {
            var self = this;
            if (this.judgement()) {
                this.refresh();
                this.hasGameOver = true;
                setTimeout(function () {
                    self.gameOver();
                }, 600);
            }
        }
    }   //逻辑上出新单元格

    private gameOver() {
        //alert("游戏结束");
        //this.reStart();
        console.log("{\"action\":\"gameover\",\"score\":\""+this.score+"\",\"score2\":\""+this.topScore+"\",\"gameId\":\"2048\"}");
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
                if (this.cell[row][col].value != 0) {    //假如这个格子有数字
                    if (temp[n] == 0) {     //假如目标位没有数字，就存进去
                        temp[n] = this.cell[row][col].value;
                    }
                    else if (temp[n] == this.cell[row][col].value) { //目标位有数字且和当前遍历的数字相同，就把目标位的数字放大，同时目标位后移
                        temp[n] *= 2;
                        //this.score = this.score + temp[n];
                        n = n + nStep;
                    }
                    else {  //目标位有数字，且和遍历的数字不等，那么直接存到下一个目标位，
                        n = n + nStep;
                        temp[n] = this.cell[row][col].value;
                    }
                }
            }
            if (rule) {
                for (var l = 0; l < 4; l++) {
                    if (this.cell[l][col].value != temp[l]) flag = true;
                    this.cell[l][col].value = temp[l];
                }
            } else {
                for (var l = 0; l < 4; l++) {
                    if (this.cell[row][l].value != temp[l]) flag = true;
                    this.cell[row][l].value = temp[l];
                }
            }
        }
        return flag;
    }   //合并单元格

    private judgement():boolean {
        //游戏结束之后的弹层也在这里
        //可以合成 false,不能合成：ture
        var flag:boolean = true;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.cell[i][j].value == this.cell[i][j + 1].value) flag = false;
            }
        }   //用来判断是否可以合成
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.cell[j][i].value == this.cell[j + 1][i].value) flag = false;
            }
        }   //用来判断是否可以合成
        return flag;
    }

    public inputListener() {
        var tapListener = this.desktop;
        var src = this;

        tapListener.touchEnabled = true;
        tapListener.touchChildren = true;
        tapListener.addEventListener(
            egret.TouchEvent.TOUCH_BEGIN,
            function forBiBao2(event:egret.TouchEvent) {
                src.onTouchBegin(event);
            },
            this
        );
        tapListener.addEventListener(
            egret.TouchEvent.TOUCH_MOVE,
            function forBiBao3(event:egret.TouchEvent) {
                src.onTouchMove(event);
            },
            this
            );

        if (egret.MainContext.deviceType != egret.MainContext.DEVICE_MOBILE) {
            document.addEventListener(
                "keydown",
                function forBiBao(event:KeyboardEvent) {
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

        this.title = new egret.Sprite;
        this.title.height = this._titleBarHeight;
        this.title.width = this.desktopSide;
        this.title.graphics.beginFill(0x003366);
        this.title.graphics.drawRect(0,0,this.desktopSide,this._titleBarHeight);
        this.title.graphics.endFill();
        this.uiStage.addElement(this.title);

        var gameName = new egret.gui.Label();
        gameName.text = "← 学霸成长记";
        gameName.size = 36;
        gameName.height = this._titleBarHeight;
        gameName.verticalAlign = egret.VerticalAlign.MIDDLE;
        gameName.paddingLeft = 25;
        this.title.addChild(gameName);
    }

    public desktopDraw() {
        var titleHeight = this._titleBarHeight;
        this.desktop = new egret.Sprite;

        this.desktop.graphics.beginFill();
        this.desktop.graphics.drawRect(0,0,this.desktopSide,this.desktopSide);
        this.desktop.graphics.endFill();
        //this.desktop.cacheAsBitmap = true;

        this.desktop.y = titleHeight;
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
    }

    public cellFormat() {
        var i, j:number;
        for (i = 0; i < 4; i++) {
            this.cell[i] = new Array(4);
            for (j = 0; j < 4; j++) {
                this.cell[i][j] = new Grid();
                this.cell[i][j].format(this._gridWidth + this._gridGap, this._gridGap);
                this.cell[i][j].x = j * (this._gridWidth + this._gridGap) + 20;
                this.cell[i][j].y = i * (this._gridWidth + this._gridGap) + 20;
                this.desktop.addChild(this.cell[i][j]);
            }
        }
    }
    
	private setCookie(key, value):void {
        var date = new Date();
        date.setTime(date.getTime() + 1 * 1000 * 3600 * 24 * 365);
        document.cookie = key + "=" + encodeURI(value) + ";expires=" + date.toUTCString() + ";path=/";
    }

    private getCookie(key):string {
        var cookie = document.cookie,
            regExp = new RegExp("[sS]*" + key + "=([^;]*)(;|$)"),
            ret = cookie.match(regExp);

        if (ret != null) {
            return ret[1];
        }
        return null;
    }

}