/**
 * Created by 彬 on 2015/3/13.
 */

class Grid extends egret.Sprite {

    public isFilled : boolean;
    public needDis : boolean;
    public row : number;
    public col : number;

    public constructor(isBg:boolean) {
        super();
        this.format(160,5,isBg);
    }

    private pic : egret.Bitmap = new egret.Bitmap();

    private moveTime : number = 80;

    public newSelf() {
        if (this.parent) {this.parent.removeChild(this);}
        this.needDis = false;
        this.isFilled = false;
    }

    public format(len:number,gap:number,isBackground:boolean) {
        this.width = this.height =len;
        this.pic.height = this.pic.width = len - 2 * gap;
        this.pic.y =  this.pic.x = gap;
        if (isBackground) this.pic.texture = RES.getRes("2048.0");
        this.isFilled = false;
        this.needDis = false;
        this.addChild(this.pic);
    }

    public drawSelf(value) {
        if (!this.isFilled) return;
        if (this.needDis) return;
        this.pic.texture = RES.getRes("2048."+value.toString());
    }

    public move() {
        if (!this.isFilled) return;
        egret.Tween.get(this,{loop :false}).to({x:this.col * 160 + 20,y:this.row * 160 + 20},this.moveTime);

        var self = this;
        if (this.needDis) {
            setTimeout(function () {
                self.disSelf();
            }, this.moveTime);//先移动，然后再摧毁单元格
        }
    }

    private disSelf() {
        this.parent.removeChild(this);
        this.needDis = false;
        this.isFilled = false;
    }

    public drawSelfLatter(value) {
        this.pic.alpha = 0;
        this.pic.texture = RES.getRes("2048." +value.toString());
        egret.Tween.get(this.pic, { loop:false })
        .to (
            {alpha:1},
            300
        )
    }
}
