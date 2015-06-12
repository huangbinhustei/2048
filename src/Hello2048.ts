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
        window["gameBoy"] = this;//和Android接口用的
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
    private cell:Grid[] = new Array(16);
    private dataGrid : Data[][] = new Array(4);
    private onMoving :boolean = false;
    private lockTimeForAnimation : number = 200;

//UI
    private desktopSide : number = 720;   //界面宽度
    private desktopGao : number = 950;     //界面总高度
    private title;  //标题栏
    private _titleBarHeight : number = 96; //0
    private desktop;    //绘制区域,也是触摸区域
    private hasGameOver : boolean;           //判断游戏是否结束
    private hasRead : boolean;//这一把是否已经读取过数据了。
    private isIphone : boolean;

    private onResourceLoadComplete(event:RES.ResourceEvent):void {

        console.log("{\"action\":\"loadComplete\"}");

        this.uiStage = new egret.gui.UIStage();  //UI的容器
        this.addChild(this.uiStage);
        this.titleBarDraw();
        this.application();//申请dataGrid 和 cellID；
        this.desktopDraw();
        this.reStart();
        this.inputListener();
        var ua = navigator.userAgent.toLowerCase();
        this.isIphone = ua.indexOf("iphone")>0 || ua.indexOf("ipad")>0;
    }

    private application() {
        var dataI, dataJ , cellI:number;
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
        console.log("wid:" + wid+"  hei:"  +hei);
    }

    private reStart() {
        this.hasGameOver = false;
        var dataI, dataJ , cellI:number;
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
    }   //初始化

    private setTopScore() {
        if (!this.hasRead) {
            var topScoreString : string = "0"; //本地存储只能存字符串，这个是总分的字符串形式
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
        this.score = this.dataGrid[0][0].value;
        for (i = 0; i < 4; i ++) {
            for (j = 0; j < 4; j ++) {
                this.score = this.dataGrid[i][j].value > this.score ? this.dataGrid[i][j].value:this.score
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
        this.setTopScore();

        var nowLever,bestLevel,topScoreString :string;

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
                this.topScore = 4;
                topScoreString = this.topScore.toString();
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
                if (this.dataGrid[i][j].value == 0) {
                    nullGroup[nullCount] = i * 4 + j;
                    nullCount += 1;
                }
            }
        }
        newbieLocation = Math.random() * nullCount ^ 0;   //挑一个=0的格子出来
        newbieNumber = (Math.random() > 0.5) ? 2 : 4;  //随机一个2~4的数字
        var newRow = (nullGroup[newbieLocation] / 4) ^ 0;//row
        var newCol = nullGroup[newbieLocation] % 4;//col
        this.dataGrid[newRow][newCol].value  = newbieNumber;

        //找一个空cell出来。
        var newCell : number;
        for ( newCell = 0 ; newCell < 16 ; newCell ++ ) {
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

        var self = this;
        self.cell[newCell].drawSelfLatter(newbieNumber);

        if (nullCount == 1 && this.judge()) {
            this.refresh();
            this.hasGameOver = true;
            setTimeout(function () {
                self.gameOver();
            },this.lockTimeForAnimation);
        }
    }   //逻辑上出新单元格

    private gameOver() {
        if (this.isIphone) {
            alert("游戏结束，请再接再厉");
            this.reStart();
        } else {
            console.log("{\"action\":\"gameover\",\"score\":\""+this.score+"\",\"score2\":\""+this.topScore+"\",\"gameId\":\"2048\"}");
        }
    }

    private merge(dir:boolean, rule:boolean):boolean {
        //dir = true ：向上or向左移动，dir=false：向下or向右移动
        //rule = true : 纵向，rule = false：横向
        var row, col, _row, _col, n, nStep, gridValue, gridCellID :number;
        var flag:boolean = false;
        var temp:Data[] = new Array(4);
        var nMean :string;

        for (_col = 0; _col < 4; _col++) {//纵向移动 → 先遍历列，横向移动 → 先遍历行
            // 不管怎么样，row都是行，col都是列
            if (rule) {
                col = _col;
                nMean = "row";
            } else {
                row = _col;
                nMean = "col";
            }
            n = dir ? 0 : 3;
            nStep = dir ? 1 : -1;

            for (var z = 0; z < 4; z++) {
                temp[z] = new Data();
            }

            //var nMean:string = rule ? "row" : "col"; //纵向移动 → n是新行号,横向移动 → n是新列号
            for (_row = 0; _row < 4; _row++) {  //纵向移动 → 先遍历列，横向移动 → 先遍历行
                if (rule) {
                    row = dir ? _row : 3 - _row;
                } else {
                    col = dir ? _row : 3 - _row;
                }

                gridValue = this.dataGrid[row][col].value;
                gridCellID = this.dataGrid[row][col].cellID;

                if (gridValue == 0 ) continue; //假如这个格子没有数字直接进入下一个格子

                switch  (temp[n].value) {
                    case 0: {//假如目标位没有数字，就存进去
                        temp[n].value = gridValue;
                        temp[n].cellID = gridCellID;
                        this.cell[gridCellID][nMean] = n;
                    } break;

                    case gridValue : {//目标位有数字且和当前遍历的数字相同，就把目标位的数字放大，同时目标位后移
                        temp[n].value *= 2;
                        this.score = this.score + temp[n].value;
                        this.cell[gridCellID][nMean] = n;
                        this.cell[gridCellID].needDis = true;
                        n = n + nStep;
                    } break;

                    default : {//目标位有数字，且和遍历的数字不等，那么直接存到下一个目标位，
                        n = n + nStep;
                        temp[n].value = gridValue;
                        temp[n].cellID = gridCellID;
                        this.cell[gridCellID][nMean] = n;
                    }
                }
            }

            if (rule) { //如果是纵向移动，此时是列在外围就被遍历了，此时处理的是特定某一列，l是行号
                for (var l = 0; l < 4; l++) {
                    if (this.dataGrid[l][col].value != temp[l].value) flag = true;
                    this.dataGrid[l][col].value = temp[l].value;
                    this.dataGrid[l][col].cellID = temp[l].cellID;
                }
            } else {   //如果是横向移动，此时是行在外围就被遍历了，此时处理的是特定某一行，l是列号
                for (var l = 0; l < 4; l++) {
                    if (this.dataGrid[row][l].value != temp[l].value) flag = true;
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
            }, selfAtMerge.lockTimeForAnimation);//先移动，然后再摧毁单元格
        }

        return flag;
    }   //合并单元格

    private cellMove() {
        var tempId ,temp_col ,temp_row ,cellValue :number;
        for (tempId = 0 ; tempId < 16 ; tempId ++ ) {
            if (this.cell[tempId].isFilled) {
                temp_row = this.cell[tempId].row;
                temp_col = this.cell[tempId].col;
                cellValue = this.dataGrid[temp_row][temp_col].value;
                this.cell[tempId].move();
                this.cell[tempId].drawSelf(cellValue);
            }
        }

    }

    private judge():boolean {
        //可以合成 false,不能合成：true
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.dataGrid[i][j].value == this.dataGrid[i][j + 1].value) return false;
            }
        }   //用来判断是否可以合成
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.dataGrid[j][i].value == this.dataGrid[j + 1][i].value) return false;
            }
        }   //用来判断是否可以合成
        return true;
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
        if (this.onMoving) return;
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
            this.lockForAnimation();
            this.touchInProcess = false;
            biggerChange = (Math.abs(xChange) >= Math.abs(yChange)) ? xChange : yChange;
            rule = (Math.abs(yChange) >= Math.abs(xChange));
            dir = biggerChange < 0;
            this.merge(dir, rule)
        }
    }   //处理触摸屏

    private lockForAnimation(){
        this.onMoving = true;
        var self = this;
        setTimeout(function () {
            self.onMoving = false;
        }, this.lockTimeForAnimation);//锁定时间内不接收输入
    }

    private onKeyDown(event:KeyboardEvent) {
        if (this.hasGameOver) return;
        if (this.onMoving) return;
        this.lockForAnimation();
        switch (event.keyCode) {
            case 38 ://上
                this.merge(true, true);
                break;
            case 40://下
                this.merge(false, true);
                break;
            case 37://左
                this.merge(true, false);
                break;
            case 39://右
                this.merge(false, false);
                break;
        }
    }   //处理键盘

    public titleBarDraw() {   //绘制主界面，摆放元素位置。
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
    }

    public desktopDraw() {
        this.desktop = new egret.Sprite;

        this.desktop.graphics.beginFill();
        this.desktop.graphics.drawRect(0,0,this.desktopSide,this.desktopSide);
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
        var i:number;
        var bgCell : Grid[] = new Array(16);
        for (i = 0; i < 16; i++) {
            bgCell[i] = new Grid(true);
            bgCell[i].x = (i % 4) * 160 + 20;
            bgCell[i].y = ((i / 4) ^ 0) * 160 + 20;
            this.desktop.addChild(bgCell[i]);
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
