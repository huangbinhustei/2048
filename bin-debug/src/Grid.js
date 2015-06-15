/**
 * Created by 彬 on 2015/3/13.
 */
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid(isBg) {
        _super.call(this);
        this.pic = new egret.Bitmap();
        this.moveTime = 80;
        this.format(160, 5, isBg);
    }
    var __egretProto__ = Grid.prototype;
    __egretProto__.newSelf = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.needDis = false;
        this.isFilled = false;
        this.needBig = false;
    };
    __egretProto__.format = function (len, gap, isBackground) {
        this.width = this.height = len;
        this.pic.height = this.pic.width = len - 2 * gap;
        this.pic.y = this.pic.x = gap;
        if (isBackground)
            this.pic.texture = RES.getRes("2048.0");
        this.isFilled = false;
        this.needDis = false;
        this.addChild(this.pic);
    };
    __egretProto__.drawSelf = function (value) {
        if (!this.isFilled)
            return;
        if (this.needDis)
            return;
        if (!this.needBig)
            return;
        var self = this;
        setTimeout(function () {
            egret.Tween.get(self, { loop: false }).to({ scaleX: 1.1, scaleY: 1.1 }, 80).to({ scaleX: 1.0, scaleY: 1.0 }, 40).call(self.pic.texture = RES.getRes("2048." + value.toString()), self);
            egret.Tween.get(self, { loop: false }).to({ x: self.x - 8, y: self.y - 8 }, 80).to({ x: self.x, y: self.y }, 40).call(function () {
                self.needBig = false;
            }, self);
        }, this.moveTime); //先移动，然后再摧毁单元格
    };
    __egretProto__.move = function () {
        if (!this.isFilled)
            return;
        egret.Tween.get(this, { loop: false }).to({ x: this.col * 160 + 20, y: this.row * 160 + 20 }, this.moveTime).call(function () {
            if (this.needDis) {
                this.disSelf();
            }
        });
    };
    __egretProto__.disSelf = function () {
        this.parent.removeChild(this);
        this.needDis = false;
        this.isFilled = false;
        this.scaleX = this.scaleY = 0;
    };
    __egretProto__.drawSelfLatter = function (value) {
        this.alpha = 0;
        this.pic.texture = RES.getRes("2048." + value.toString());
        egret.Tween.get(this, { loop: false }).to({ alpha: 1 }, 120);
        egret.Tween.get(this, { loop: false }).to({ scaleX: 1, scaleY: 1 }, 120);
    };
    return Grid;
})(egret.Sprite);
Grid.prototype.__class__ = "Grid";
