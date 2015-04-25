var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by 彬 on 2015/3/6.
 */
var HelloGUI = (function (_super) {
    __extends(HelloGUI, _super);
    function HelloGUI() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.startGame, this);
    }
    HelloGUI.prototype.startGame = function () {
        this.loadResource();
    };
    HelloGUI.prototype.loadResource = function () {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
        RES.loadGroup("preload");
    };
    HelloGUI.prototype.onResourceLoadComplete = function (event) {
        //注入自定义的素材解析器
        egret.Injector.mapClass("egret.gui.IAssetAdapter", AssetAdapter);
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        egret.gui.Theme.load("resource/theme.thm");
        //图片
        egret.Injector.mapClass("egret.gui.IAssetAdapter", AssetAdapter);
        egret.gui.Theme.load("resource/theme.thm");
        RES.loadConfig("resource/resource.json", "resource/");
        var bg;
        bg = new egret.Bitmap();
        bg.texture = RES.getRes("bgImage");
        this.addChild(bg);
        bg.scaleX = 3;
        bg.scaleY = 0.5;
        //bg.rotation=20;
        bg.touchEnabled = true;
        //bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tupianTouchHander,this);
        this.wjIcon = new egret.Bitmap(RES.getRes("wj"));
        this.baiIcon = new egret.Bitmap(RES.getRes("bai"));
        this.uiStage = new egret.gui.UIStage(); //UI的容器
        this.addChild(this.uiStage);
        //文本
        //        var label:egret.gui.Label;
        //        label = new egret.gui.Label();
        //        label.text = "hello world";
        //        label.x = 192;
        //        label.y = 192;
        //        label.size = 28;
        //        this.uiStage.addElement(label);
        //按钮
        var init;
        init = new egret.gui.Button();
        init.label = "init";
        init.x = 0;
        init.y = 400;
        init.width = 60;
        init.height = 60;
        this.uiStage.addElement(init);
        //inti.addEventListener(egret.TouchEvent.TOUCH_TAP,this.initTouchHander,this);
        init.addEventListener(egret.TouchEvent.TOUCH_TAP, this.initTouchHander, this);
    };
    //响应背景图的点击
    //    private tupianTouchHander(event:egret.TouchEvent):void {
    //        alert("点到背景图啦");
    //    }
    HelloGUI.prototype.initTouchHander = function (event) {
        // 这里，Alert之外的this是对的（指向hellogui），但是在alert.show中，this就变成了alert。
        //所以要在this还是对的时候，把this存起来（当作self）
        //只有在调用（比如listener、alert）等情况下，this才可能出问题
        //functions之间的直接跳转，如下文的“self.myshow”,this并没有变化，就和initTouchHander的this是一样的。
        var self = this;
        egret.gui.Alert.show("据说这里是对话框提示文字", "这里是标题", function (event) {
            self.myShow(event);
        }, "ok", "cancel");
    };
    HelloGUI.prototype.myShow = function (event) {
        switch (event.detail) {
            case egret.gui.Alert.FIRST_BUTTON:
                this.init2048();
                break;
            case egret.gui.Alert.SECOND_BUTTON:
                console.log("Cancel");
                break;
            case egret.gui.Alert.CLOSE_BUTTON:
                console.log("Close");
                break;
        }
    };
    HelloGUI.prototype.init2048 = function () {
        //enum  Style {
        //    a,
        //    b,
        //
        //};
        var deskTop;
        deskTop = new egret.Sprite;
        deskTop.graphics.beginFill(0x123489);
        deskTop.graphics.drawRect(0, 0, 400, 400);
        deskTop.graphics.endFill();
        this.uiStage.addElement(deskTop);
        var arr2d = [
            [0, 0, 0, 512],
            [0, 2, 256, 1024],
            [128, 16, 8, 2048],
            [64, 32, 4, 0]
        ];
        //for (var i=0;i<4;i=i+1) {
        //    for (var j=0;j<4;j++) {
        //        arr2d[i][j] = 1;
        //    }
        //}
        //alert(arr2d[1][2]);
        var i, j;
        var map2d = [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ];
        var tarNum = [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ];
        for (i = 0; i < 4; i = i + 1) {
            for (j = 0; j < 4; j++) {
                map2d[i][j] = new egret.Sprite();
                tarNum[i][j] = new egret.TextField();
                map2d[i][j].x = 100 * j; //j是第几列，所以是x的偏移量
                map2d[i][j].y = tarNum[i][j].y = 100 * i;
                tarNum[i][j].x = map2d[i][j].x + 2;
                tarNum[i][j].y = map2d[i][j].y + 40;
                switch (arr2d[i][j]) {
                    case 0:
                        map2d[i][j].graphics.beginFill(0x23459a);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = "";
                        break;
                    case 2:
                        map2d[i][j].graphics.beginFill(0x345678);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = arr2d[i][j];
                        break;
                    case 4:
                        map2d[i][j].graphics.beginFill(0x006600);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = arr2d[i][j];
                        break;
                    case 8:
                        map2d[i][j].graphics.beginFill(0x008800);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = arr2d[i][j];
                        break;
                    case 16:
                        map2d[i][j].graphics.beginFill(0x00aa00);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = arr2d[i][j];
                        break;
                    case 32:
                        map2d[i][j].graphics.beginFill(0x00cc00);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = arr2d[i][j];
                        break;
                    case 64:
                        map2d[i][j].graphics.beginFill(0x000066);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = arr2d[i][j];
                        break;
                    case 128:
                        map2d[i][j].graphics.beginFill(0x000088);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = arr2d[i][j];
                        break;
                    case 256:
                        map2d[i][j].graphics.beginFill(0x0000aa);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = arr2d[i][j];
                        break;
                    case 512:
                        map2d[i][j].graphics.beginFill(0x0000cc);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = arr2d[i][j];
                        break;
                    case 1024:
                        map2d[i][j].graphics.beginFill(0x0000e0);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = arr2d[i][j];
                        break;
                    case 2048:
                        map2d[i][j].graphics.beginFill(0x0000FF);
                        map2d[i][j].graphics.drawRect(2, 2, 98, 98);
                        map2d[i][j].graphics.endFill();
                        tarNum[i][j].text = arr2d[i][j];
                        break;
                }
                tarNum[i][j].width = tarNum[i][j].height = 96;
                tarNum[i][j].textAlign = "center";
                this.uiStage.addElement(map2d[i][j]);
                this.uiStage.addElement(tarNum[i][j]);
                console.log(map2d[i][j].label);
            }
        }
    };
    return HelloGUI;
})(egret.DisplayObjectContainer);
HelloGUI.prototype.__class__ = "HelloGUI";
