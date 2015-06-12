/**
 * Created by baidu on 15/6/12.
 */

class Interface extends egret.DisplayObjectContainer {
    public constructor() {
        super();
    }

    private titleBar : egret.Sprite;

    private scoreRefresh() {

    }

    public desktopDraw(width,height,offsetX,offsetY,uiStage) {
        var desktop : egret.Sprite = new egret.Sprite;

        desktop.graphics.beginFill();
        desktop.graphics.drawRect(0,0,width,height);
        desktop.graphics.endFill();
        desktop.x = offsetX;
        desktop.y = offsetY;
        desktop.width = width;
        desktop.height = height;
        uiStage.addElement(desktop);

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
            bgCell[i] = new Grid();
            bgCell[i].pic.texture = RES.getRes("2048.0");
            bgCell[i].x = (i % 4) * 160 + 20;
            bgCell[i].y = ((i / 4) ^ 0) * 160 + 20;
            this.desktop.addChild(bgCell[i]);
        }
    }


}
