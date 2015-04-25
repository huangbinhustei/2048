var skins;
(function (skins) {
    var simple;
    (function (simple) {
        var ButtonSkin = (function (_super) {
            __extends(ButtonSkin, _super);
            function ButtonSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["minHeight", "minWidth"], [60, 140]);
                this.elementsContent = [this.__4_i(), this.__6_i()];
                this.states = [
                    new egret.gui.State("up", [
                        new egret.gui.SetProperty("labelDisplay", "textColor", 0x111111)
                    ]),
                    new egret.gui.State("down", [
                        new egret.gui.SetProperty("__4", "source", "button_down_png"),
                        new egret.gui.SetProperty("labelDisplay", "textColor", 0x222222)
                    ]),
                    new egret.gui.State("disabled", [
                        new egret.gui.SetProperty("__4", "source", "button_disabled_png"),
                        new egret.gui.SetProperty("labelDisplay", "textColor", 0xcccccc)
                    ])
                ];
            }
            var __egretProto__ = ButtonSkin.prototype;
            Object.defineProperty(__egretProto__, "skinParts", {
                get: function () {
                    return ButtonSkin._skinParts;
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__.__5_i = function () {
                var t = new egret.gui.HorizontalLayout();
                this.__s(t, ["gap", "horizontalAlign", "verticalAlign"], [0, "center", "middle"]);
                return t;
            };
            __egretProto__.__6_i = function () {
                var t = new egret.gui.Group();
                this.__s(t, ["bottom", "left", "right", "top"], [10, 10, 10, 10]);
                t.layout = this.__5_i();
                t.elementsContent = [this.iconDisplay_i(), this.labelDisplay_i()];
                return t;
            };
            __egretProto__.iconDisplay_i = function () {
                var t = new egret.gui.UIAsset();
                this.iconDisplay = t;
                return t;
            };
            __egretProto__.labelDisplay_i = function () {
                var t = new egret.gui.Label();
                this.labelDisplay = t;
                this.__s(t, ["fontFamily", "paddingLeft", "paddingRight", "size", "textAlign", "verticalAlign"], ["Tahoma", 5, 5, 20, "center", "middle"]);
                return t;
            };
            __egretProto__.__4_i = function () {
                var t = new egret.gui.UIAsset();
                this.__4 = t;
                this.__s(t, ["percentHeight", "source", "percentWidth"], [100, "button_normal_png", 100]);
                return t;
            };
            ButtonSkin._skinParts = ["iconDisplay", "labelDisplay"];
            return ButtonSkin;
        })(egret.gui.Skin);
        simple.ButtonSkin = ButtonSkin;
        ButtonSkin.prototype.__class__ = "skins.simple.ButtonSkin";
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
