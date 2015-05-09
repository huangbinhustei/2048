/**
 * Created by 彬 on 2015/3/13.
 */

class Grid extends egret.Sprite {
    public valueOld :number;
    public valueNew :number;
    public pic : egret.Bitmap = new egret.Bitmap();

    public format(len:number,gap:number) {
        this.width = this.height = len;
        this.pic.height = this.pic.width = len - 2 * gap;
        this.pic.y =  this.pic.x = gap;
        this.valueOld = 0;
        this.pic.texture = RES.getRes(this.valueOld.toString());
        this.pic.texture = RES.getRes(this.valueOld.toString());
        this.addChild(this.pic);
    }

    public drawSelf() {
        if (this.valueNew != this.valueOld) {
            this.pic.texture = RES.getRes("2048."+this.valueNew.toString());
            this.valueOld = this.valueNew;
        }
    }

    public drawSelfLater() {
        this.pic.texture = RES.getRes("2048."+this.valueNew.toString());
        this.valueOld = this.valueNew;
        egret.Tween.get(this,{ loop: false }).to({ alpha: 0.2 }, 0).to({ alpha: 1 }, 500);
    }
}
