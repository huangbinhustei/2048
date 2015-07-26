//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var gui;
    (function (gui) {
        /**
         * @class egret.gui.TabBar
         * @classdesc
         * 选项卡组件
         * @extends egret.gui.ListBase
         */
        var TabBar = (function (_super) {
            __extends(TabBar, _super);
            /**
             * 构造函数
             * @method egret.gui.TabBar#constructor
             */
            function TabBar() {
                _super.call(this);
                /**
                 * requireSelection改变标志
                 */
                this.requireSelectionChanged_tabBar = false;
                this.requireSelection = true;
            }
            var __egretProto__ = TabBar.prototype;
            /**
             * 创建容器的子元素
             */
            __egretProto__.createChildren = function () {
                gui.ListBase.prototype.createChildren.call(this);
            };
            Object.defineProperty(__egretProto__, "requireSelection", {
                get: function () {
                    return this._requireSelection;
                },
                /**
                 * @method egret.gui.TabBar#requireSelection
                 * @param value {boolean}
                 */
                set: function (value) {
                    if (value == this._requireSelection)
                        return;
                    _super.prototype._setRequireSelection.call(this, value);
                    this.requireSelectionChanged_tabBar = true;
                    this.invalidateProperties();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            __egretProto__._setDataProvider = function (value) {
                if (this.dataProvider instanceof gui.ViewStack) {
                    this.dataProvider.removeEventListener("IndexChanged", this.onViewStackIndexChange, this);
                    this.removeEventListener(gui.IndexChangeEvent.CHANGE, this.onIndexChanged, this);
                }
                if (value instanceof gui.ViewStack) {
                    value.addEventListener("IndexChanged", this.onViewStackIndexChange, this);
                    this.addEventListener(gui.IndexChangeEvent.CHANGE, this.onIndexChanged, this);
                }
                _super.prototype._setDataProvider.call(this, value);
            };
            /**
             * 鼠标点击的选中项改变
             */
            __egretProto__.onIndexChanged = function (event) {
                (this.dataProvider)._setSelectedIndex(event.newIndex, false);
            };
            /**
             * ViewStack选中项发生改变
             */
            __egretProto__.onViewStackIndexChange = function (event) {
                this._setSelectedIndex((this.dataProvider).selectedIndex, false);
            };
            /**
             * 处理对组件设置的属性
             */
            __egretProto__.commitProperties = function () {
                _super.prototype.commitProperties.call(this);
                if (this.requireSelectionChanged_tabBar && this.dataGroup) {
                    this.requireSelectionChanged_tabBar = false;
                    var n = this.dataGroup.numElements;
                    for (var i = 0; i < n; i++) {
                        var renderer = (this.dataGroup.getElementAt(i));
                        if (renderer)
                            renderer.allowDeselection = !this.requireSelection;
                    }
                }
            };
            __egretProto__.dataGroup_rendererAddHandler = function (event) {
                _super.prototype.dataGroup_rendererAddHandler.call(this, event);
                if (event.renderer == null)
                    return;
                if (event.renderer instanceof gui.TabBarButton)
                    event.renderer.allowDeselection = !this.requireSelection;
            };
            /**
             * 鼠标在项呈示器上弹起，抛出ItemClick事件。
             */
            __egretProto__._item_touchEndHandler = function (event) {
                var itemRenderer = (event.currentTarget);
                if (itemRenderer != this._mouseDownItemRenderer)
                    return;
                var newIndex;
                if (itemRenderer)
                    newIndex = itemRenderer.itemIndex;
                else
                    newIndex = this.dataGroup.getElementIndex((event.currentTarget));
                if (newIndex == this.selectedIndex) {
                    if (!this.requireSelection)
                        this._setSelectedIndex(gui.ListBase.NO_SELECTION, true);
                }
                else
                    this._setSelectedIndex(newIndex, true);
                if (!this._captureItemRenderer)
                    return;
                this._dispatchListEvent(event, gui.ListEvent.ITEM_CLICK, itemRenderer);
            };
            return TabBar;
        })(gui.List);
        gui.TabBar = TabBar;
        TabBar.prototype.__class__ = "egret.gui.TabBar";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
