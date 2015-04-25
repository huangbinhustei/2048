var skins;
(function (skins) {
    var simple;
    (function (simple) {
        var DropDownListSkin = (function (_super) {
            __extends(DropDownListSkin, _super);
            function DropDownListSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.elementsContent = [this.openButton_i(), this.labelDisplay_i(), this.popUp_i()];
                this.states = [
                    new egret.gui.State("normal", [
                        new egret.gui.SetProperty("labelDisplay", "textColor", 0x111111)
                    ]),
                    new egret.gui.State("open", [
                        new egret.gui.SetProperty("labelDisplay", "textColor", 0x222222),
                        new egret.gui.SetProperty("popUp", "displayPopUp", true)
                    ]),
                    new egret.gui.State("disabled", [])
                ];
            }
            var __egretProto__ = DropDownListSkin.prototype;
            Object.defineProperty(__egretProto__, "skinParts", {
                get: function () {
                    return DropDownListSkin._skinParts;
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__.dataGroup_i = function () {
                var t = new egret.gui.DataGroup();
                this.dataGroup = t;
                this.__s(t, ["percentHeight", "itemRendererSkinName", "percentWidth"], [100, skins.simple.DropDownListItemRendererSkin, 100]);
                t.layout = this.__4_i();
                return t;
            };
            __egretProto__.dropDown_i = function () {
                var t = new egret.gui.Group();
                this.dropDown = t;
                this.__s(t, ["height", "visible"], [400, true]);
                t.elementsContent = [this.scroller_i()];
                return t;
            };
            __egretProto__.labelDisplay_i = function () {
                var t = new egret.gui.Label();
                this.labelDisplay = t;
                this.__s(t, ["fontFamily", "paddingLeft", "touchChildren", "touchEnabled", "verticalAlign", "verticalCenter"], ["Tahoma", 10, false, false, "middle", 0]);
                return t;
            };
            __egretProto__.openButton_i = function () {
                var t = new egret.gui.Button();
                this.openButton = t;
                this.__s(t, ["percentHeight", "skinName", "percentWidth"], [100, skins.simple.DropDownListOpenButtonSkin, 100]);
                return t;
            };
            __egretProto__.popUp_i = function () {
                var t = new egret.gui.PopUpAnchor();
                this.popUp = t;
                this.__s(t, ["displayPopUp", "percentHeight", "popUpPosition", "popUpWidthMatchesAnchorWidth", "percentWidth"], [false, 100, "below", true, 100]);
                t.popUp = this.dropDown_i();
                return t;
            };
            __egretProto__.scroller_i = function () {
                var t = new egret.gui.Scroller();
                this.scroller = t;
                this.__s(t, ["percentHeight", "percentWidth"], [100, 100]);
                t.viewport = this.dataGroup_i();
                return t;
            };
            __egretProto__.__4_i = function () {
                var t = new egret.gui.VerticalLayout();
                this.__s(t, ["gap", "horizontalAlign"], [0, "justify"]);
                return t;
            };
            DropDownListSkin._skinParts = ["openButton", "labelDisplay", "dataGroup", "scroller", "dropDown", "popUp"];
            return DropDownListSkin;
        })(egret.gui.Skin);
        simple.DropDownListSkin = DropDownListSkin;
        DropDownListSkin.prototype.__class__ = "skins.simple.DropDownListSkin";
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
