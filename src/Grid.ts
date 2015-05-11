/**
 * Created by 彬 on 2015/3/13.
 */

class Grid extends egret.Sprite {
    public value :number;
    public pic : egret.Bitmap = new egret.Bitmap();

    public format(len:number,gap:number) {
        this.width = this.height = len;
        this.pic.height = this.pic.width = len - 2 * gap;
        this.pic.y =  this.pic.x = gap;
        this.value = 0;
        this.pic.texture = RES.getRes(this.value.toString());
        this.addChild(this.pic);
    }

    public drawSelf() {
        this.pic.texture = RES.getRes("2048."+this.value.toString());
    }

    public drawSelfLater() {
        this.pic.texture = RES.getRes("2048."+this.value.toString());
        egret.Tween.get(this,{ loop: false }).to({ alpha: 0.5 }, 0).to({ alpha: 1 }, 500);
    }
}
