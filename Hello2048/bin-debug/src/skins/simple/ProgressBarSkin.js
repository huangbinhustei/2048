var skins;
(function (skins) {
    var simple;
    (function (simple) {
        var ProgressBarSkin = (function (_super) {
            __extends(ProgressBarSkin, _super);
            function ProgressBarSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.height = 100;
                this.elementsContent = [this.__3_i(), this.thumb_i(), this.track_i(), this.labelDisplay_i()];
                this.states = [
                    new egret.gui.State("normal", []),
                    new egret.gui.State("disabled", [])
                ];
            }
            var __egretProto__ = ProgressBarSkin.prototype;
            Object.defineProperty(__egretProto__, "skinParts", {
                get: function () {
                    return ProgressBarSkin._skinParts;
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__.labelDisplay_i = function () {
                var t = new egret.gui.Label();
                this.labelDisplay = t;
                this.__s(t, ["left", "maxDisplayedLines", "right", "size", "textAlign", "textColor", "verticalAlign", "verticalCenter"], [5, 1, 5, 20, "center", 0x707070, "middle", 0]);
                return t;
            };
            __egretProto__.__3_i = function () {
                var t = new egret.gui.UIAsset();
                this.__s(t, ["percentHeight", "source", "percentWidth"], [100, "progressbar_track_png", 100]);
                return t;
            };
            __egretProto__.thumb_i = function () {
                var t = new egret.gui.UIAsset();
                this.thumb = t;
                t.source = "progressbar_fill_png";
                return t;
            };
            __egretProto__.track_i = function () {
                var t = new egret.gui.UIComponent();
                this.track = t;
                this.__s(t, ["percentHeight", "percentWidth"], [100, 100]);
                return t;
            };
            ProgressBarSkin._skinParts = ["thumb", "track", "labelDisplay"];
            return ProgressBarSkin;
        })(egret.gui.Skin);
        simple.ProgressBarSkin = ProgressBarSkin;
        ProgressBarSkin.prototype.__class__ = "skins.simple.ProgressBarSkin";
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
