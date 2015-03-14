var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by 彬 on 2015/3/13.
 */
var MainUI = (function (_super) {
    __extends(MainUI, _super);
    function MainUI() {
        _super.call(this);
        this.score = 0;
        this.key = "best";
        this.cell = new Array(4);
        //UI
        this.desktopSide = 480; //界面宽度
        this._titleBarHeight = 60;
        this.create();
    }
    MainUI.prototype.create = function () {
        this.uiStage = new egret.gui.UIStage(); //UI的容器
        this.addChild(this.uiStage);
        this.titleBarDraw();
        this.desktopDraw();
        this.cellFormat();
    };
    MainUI.prototype.titleBarDraw = function () {
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
    };
    MainUI.prototype.desktopDraw = function () {
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
    MainUI.prototype.cellFormat = function () {
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
    return MainUI;
})(egret.Sprite);
MainUI.prototype.__class__ = "MainUI";
