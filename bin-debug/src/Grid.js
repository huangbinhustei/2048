/**
 * Created by 彬 on 2015/3/13.
 */
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        _super.apply(this, arguments);
        this.pic = new egret.Bitmap();
    }
    var __egretProto__ = Grid.prototype;
    __egretProto__.format = function (len, gap) {
        this.width = this.height = len;
        this.pic.height = this.pic.width = len - 2 * gap;
        this.pic.y = this.pic.x = gap;
        this.valueOld = 0;
        this.pic.texture = RES.getRes(this.valueOld.toString());
        this.pic.texture = RES.getRes(this.valueOld.toString());
        this.addChild(this.pic);
    };
    __egretProto__.drawSelf = function () {
        if (this.valueNew != this.valueOld) {
            this.pic.texture = RES.getRes("2048." + this.valueNew.toString());
            this.valueOld = this.valueNew;
        }
    };
    __egretProto__.drawSelfLater = function () {
        this.pic.texture = RES.getRes("2048." + this.valueNew.toString());
        this.valueOld = this.valueNew;
        egret.Tween.get(this, { loop: false }).to({ alpha: 0.2 }, 0).to({ alpha: 1 }, 500);
    };
    return Grid;
})(egret.Sprite);
Grid.prototype.__class__ = "Grid";
