var skins;
(function (skins) {
    var simple;
    (function (simple) {
        var SkinnableContainerSkin = (function (_super) {
            __extends(SkinnableContainerSkin, _super);
            function SkinnableContainerSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["maxWidth", "minHeight", "minWidth"], [710, 230, 470]);
                this.elementsContent = [this.contentGroup_i()];
                this.states = [
                    new egret.gui.State("normal", []),
                    new egret.gui.State("disabled", [])
                ];
            }
            var __egretProto__ = SkinnableContainerSkin.prototype;
            Object.defineProperty(__egretProto__, "skinParts", {
                get: function () {
                    return SkinnableContainerSkin._skinParts;
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__.contentGroup_i = function () {
                var t = new egret.gui.Group();
                this.contentGroup = t;
                this.__s(t, ["percentHeight", "percentWidth"], [100, 100]);
                return t;
            };
            SkinnableContainerSkin._skinParts = ["contentGroup"];
            return SkinnableContainerSkin;
        })(egret.gui.Skin);
        simple.SkinnableContainerSkin = SkinnableContainerSkin;
        SkinnableContainerSkin.prototype.__class__ = "skins.simple.SkinnableContainerSkin";
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
