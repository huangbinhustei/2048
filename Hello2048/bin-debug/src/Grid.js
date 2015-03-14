/**
 * Created by 彬 on 2015/3/13.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        _super.apply(this, arguments);
        this.pic = new egret.Bitmap();
    }
    Grid.prototype.format = function (len, gap) {
        this.width = this.height = len;
        this.pic.height = this.pic.width = len - 2 * gap;
        this.pic.y = this.pic.x = gap;
        this.valueOld = 0;
        this.pic.texture = RES.getRes(this.valueOld.toString());
        this.pic.texture = RES.getRes(this.valueOld.toString());
        this.addChild(this.pic);
    };
    Grid.prototype.drawSelf = function () {
        if (this.valueNew != this.valueOld) {
            this.pic.texture = RES.getRes(this.valueNew.toString());
            this.valueOld = this.valueNew;
        }
    };
    Grid.prototype.drawSelfLatter = function () {
        this.pic.texture = RES.getRes(this.valueNew.toString());
        this.valueOld = this.valueNew;
        egret.Tween.get(this.pic.texture, { loop: false }).to({ alpha: 0 }, 1000).to({ alpha: 1 }, 1000);
    }; //没有实现渐入渐出。
    return Grid;
})(egret.Sprite);
Grid.prototype.__class__ = "Grid";
