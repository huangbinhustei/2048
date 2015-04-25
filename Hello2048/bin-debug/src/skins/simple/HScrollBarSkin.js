var skins;
(function (skins) {
    var simple;
    (function (simple) {
        var HScrollBarSkin = (function (_super) {
            __extends(HScrollBarSkin, _super);
            function HScrollBarSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["minHeight", "minWidth"], [10, 20]);
                this.elementsContent = [this.track_i(), this.thumb_i()];
                this.states = [
                    new egret.gui.State("normal", []),
                    new egret.gui.State("disabled", [])
                ];
            }
            var __egretProto__ = HScrollBarSkin.prototype;
            Object.defineProperty(__egretProto__, "skinParts", {
                get: function () {
                    return HScrollBarSkin._skinParts;
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__.thumb_i = function () {
                var t = new egret.gui.Button();
                this.thumb = t;
                this.__s(t, ["height", "skinName", "verticalCenter", "width"], [10, skins.simple.HScrollBarThumbSkin, 0, 24]);
                return t;
            };
            __egretProto__.track_i = function () {
                var t = new egret.gui.UIAsset();
                this.track = t;
                this.__s(t, ["height", "left", "right", "source", "verticalCenter", "percentWidth"], [10, 10, 10, "hscrolltrack_png", 0, 100]);
                return t;
            };
            HScrollBarSkin._skinParts = ["track", "thumb"];
            return HScrollBarSkin;
        })(egret.gui.Skin);
        simple.HScrollBarSkin = HScrollBarSkin;
        HScrollBarSkin.prototype.__class__ = "skins.simple.HScrollBarSkin";
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
