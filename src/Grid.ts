/**
 * Created by 彬 on 2015/3/13.
 */

class Grid extends egret.Sprite {

    public isFilled : boolean;
    public needDis : boolean;
    public needBig : boolean;
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
        this.needBig = false;
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
        if (!this.needBig) return;
        var moveTime_1 :number = this.moveTime*0.7;
        var moveTime_2 :number = this.moveTime - moveTime_1;
        var self = this;
        setTimeout(function () {
            egret.Tween.get(self,{loop :false})
                .to({scaleX:1.2,scaleY:1.2},moveTime_1)
                .to({scaleX:1.0,scaleY:1.0},moveTime_2)
                .call(self.pic.texture = RES.getRes("2048."+value.toString()),self);
            egret.Tween.get(self,{loop :false})
                .to({x : self.x - 16,y:self.y - 16}, moveTime_1)
                .to({x : self.x,y:self.y}, moveTime_2)
                .call(function (){self.needBig = false },self);
        }, this.moveTime);//先移动，然后再摧毁单元格
    }

    public move() {
        if (!this.isFilled) return;
        egret.Tween.get(this,{loop :false})
            .to({x:this.col * 160 + 20,y:this.row * 160 + 20},this.moveTime)
            .call(this.disSelf,this);
    }

    private disSelf() {
        if (!this.needDis) return;
        this.parent.removeChild(this);
        this.needDis = false;
        this.isFilled = false;
        this.scaleX = this.scaleY = 0;
    }

    public drawSelfLatter(value:number) {
        this.alpha = 0;
        this.pic.texture = RES.getRes("2048." +value.toString());
        egret.Tween.get(this, { loop:false }).to({alpha:1}, this.moveTime);
        egret.Tween.get(this, { loop:false }).to({scaleX:1,scaleY:1},this.moveTime)
    }
}