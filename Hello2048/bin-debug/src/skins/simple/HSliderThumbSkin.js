var skins;
(function (skins) {
    var simple;
    (function (simple) {
        var HSliderThumbSkin = (function (_super) {
            __extends(HSliderThumbSkin, _super);
            function HSliderThumbSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.elementsContent = [this.__4_i()];
                this.states = [
                    new egret.gui.State("up", []),
                    new egret.gui.State("down", []),
                    new egret.gui.State("disabled", [])
                ];
            }
            var __egretProto__ = HSliderThumbSkin.prototype;
            __egretProto__.__4_i = function () {
                var t = new egret.gui.UIAsset();
                this.__s(t, ["fillMode", "percentHeight", "source", "percentWidth"], ["scale", 100, "hslider_thumb_png", 100]);
                return t;
            };
            return HSliderThumbSkin;
        })(egret.gui.Skin);
        simple.HSliderThumbSkin = HSliderThumbSkin;
        HSliderThumbSkin.prototype.__class__ = "skins.simple.HSliderThumbSkin";
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
