var skins;
(function (skins) {
    var simple;
    (function (simple) {
        var AlertSkin = (function (_super) {
            __extends(AlertSkin, _super);
            function AlertSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["maxWidth", "minHeight", "minWidth"], [710, 230, 370]);
                this.elementsContent = [this.__1_i(), this.moveArea_i(), this.contentDisplay_i(), this.__4_i()];
            }
            var __egretProto__ = AlertSkin.prototype;
            Object.defineProperty(__egretProto__, "skinParts", {
                get: function () {
                    return AlertSkin._skinParts;
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__.__2_i = function () {
                var t = new egret.gui.UIAsset();
                this.__s(t, ["percentHeight", "source", "percentWidth"], [100, "panel_headeback_png", 100]);
                return t;
            };
            __egretProto__.__3_i = function () {
                var t = new egret.gui.HorizontalLayout();
                this.__s(t, ["gap", "horizontalAlign", "paddingLeft", "paddingRight"], [10, "center", 20, 20]);
                return t;
            };
            __egretProto__.__4_i = function () {
                var t = new egret.gui.Group();
                this.__s(t, ["bottom", "horizontalCenter"], [25, 0]);
                t.layout = this.__3_i();
                t.elementsContent = [this.firstButton_i(), this.secondButton_i()];
                return t;
            };
            __egretProto__.closeButton_i = function () {
                var t = new egret.gui.Button();
                this.closeButton = t;
                this.__s(t, ["right", "skinName", "verticalCenter"], [10, skins.simple.CloseButtonSkin, 0]);
                return t;
            };
            __egretProto__.contentDisplay_i = function () {
                var t = new egret.gui.Label();
                this.contentDisplay = t;
                this.__s(t, ["bottom", "fontFamily", "left", "padding", "right", "size", "textAlign", "textColor", "top", "verticalAlign"], [45, "Tahoma", 1, 10, 1, 22, "center", 0x727070, 36, "middle"]);
                return t;
            };
            __egretProto__.firstButton_i = function () {
                var t = new egret.gui.Button();
                this.firstButton = t;
                this.__s(t, ["height", "label", "width"], [50, "确定", 115]);
                return t;
            };
            __egretProto__.moveArea_i = function () {
                var t = new egret.gui.Group();
                this.moveArea = t;
                this.__s(t, ["height", "left", "right"], [55, 3, 9]);
                t.elementsContent = [this.__2_i(), this.titleDisplay_i(), this.closeButton_i()];
                return t;
            };
            __egretProto__.secondButton_i = function () {
                var t = new egret.gui.Button();
                this.secondButton = t;
                this.__s(t, ["height", "label", "width"], [50, "取消", 115]);
                return t;
            };
            __egretProto__.__1_i = function () {
                var t = new egret.gui.UIAsset();
                this.__s(t, ["percentHeight", "source", "percentWidth"], [100, "panel_back_png", 100]);
                return t;
            };
            __egretProto__.titleDisplay_i = function () {
                var t = new egret.gui.Label();
                this.titleDisplay = t;
                this.__s(t, ["fontFamily", "left", "maxDisplayedLines", "minHeight", "right", "size", "textAlign", "textColor", "verticalAlign", "verticalCenter"], ["Tahoma", 5, 1, 28, 5, 26, "center", 0x727070, "middle", 0]);
                return t;
            };
            AlertSkin._skinParts = ["titleDisplay", "closeButton", "moveArea", "contentDisplay", "firstButton", "secondButton"];
            return AlertSkin;
        })(egret.gui.Skin);
        simple.AlertSkin = AlertSkin;
        AlertSkin.prototype.__class__ = "skins.simple.AlertSkin";
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
