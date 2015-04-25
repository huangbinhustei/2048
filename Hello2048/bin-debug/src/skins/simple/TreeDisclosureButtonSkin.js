var skins;
(function (skins) {
    var simple;
    (function (simple) {
        var TreeDisclosureButtonSkin = (function (_super) {
            __extends(TreeDisclosureButtonSkin, _super);
            function TreeDisclosureButtonSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.minHeight = 22;
                this.elementsContent = [this.__7_i()];
                this.states = [
                    new egret.gui.State("up", []),
                    new egret.gui.State("down", [
                        new egret.gui.SetProperty("__7", "source", "tree_btndown_png")
                    ]),
                    new egret.gui.State("disabled", [
                        new egret.gui.SetProperty("__7", "source", "tree_btndisabled_png")
                    ]),
                    new egret.gui.State("upAndSelected", [
                        new egret.gui.SetProperty("__7", "source", "tree_btnupselect_png")
                    ]),
                    new egret.gui.State("downAndSelected", [
                        new egret.gui.SetProperty("__7", "source", "tree_btndownselect_png")
                    ]),
                    new egret.gui.State("disabledAndSelected", [
                        new egret.gui.SetProperty("__7", "source", "tree_btndisabledselect_png")
                    ])
                ];
            }
            var __egretProto__ = TreeDisclosureButtonSkin.prototype;
            __egretProto__.__7_i = function () {
                var t = new egret.gui.UIAsset();
                this.__7 = t;
                this.__s(t, ["percentHeight", "source", "percentWidth"], [100, "tree_btnup_png", 100]);
                return t;
            };
            return TreeDisclosureButtonSkin;
        })(egret.gui.Skin);
        simple.TreeDisclosureButtonSkin = TreeDisclosureButtonSkin;
        TreeDisclosureButtonSkin.prototype.__class__ = "skins.simple.TreeDisclosureButtonSkin";
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
