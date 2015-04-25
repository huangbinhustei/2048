/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var egret;
(function (egret) {
    var gui;
    (function (gui) {
        /**
         * @class egret.gui.DropDownListBase
         * @classdesc
         * 下拉列表控件基类
         * @extends egret.gui.List
         */
        var DropDownListBase = (function (_super) {
            __extends(DropDownListBase, _super);
            /**
             * 构造函数
             * @method egret.gui.DropDownListBase#constructor
             */
            function DropDownListBase() {
                _super.call(this);
                /**
                 * [SkinPart]下拉区域显示对象
                 * @member egret.gui.DropDownListBase#dropDown
                 */
                this.dropDown = null;
                /**
                 * [SkinPart]下拉触发按钮
                 * @member egret.gui.DropDownListBase#openButton
                 */
                this.openButton = null;
                /**
                 * 文本改变标志
                 */
                this._labelChanged = false;
                this._dropDownController = null;
                this._userProposedSelectedIndex = gui.ListBase.NO_SELECTION;
                this._captureItemRenderer = false;
                this.dropDownController = new gui.DropDownController();
            }
            var __egretProto__ = DropDownListBase.prototype;
            /**
             * @inheritDoc
             */
            __egretProto__._setDataProvider = function (value) {
                if (this.dataProvider === value)
                    return;
                _super.prototype._setDataProvider.call(this, value);
                this._labelChanged = true;
                this.invalidateProperties();
            };
            /**
             * @inheritDoc
             */
            __egretProto__._setLabelField = function (value) {
                if (this.labelField == value)
                    return;
                _super.prototype._setLabelField.call(this, value);
                this._labelChanged = true;
                this.invalidateProperties();
            };
            /**
             * @inheritDoc
             */
            __egretProto__._setLabelFunction = function (value) {
                if (this.labelFunction == value)
                    return;
                _super.prototype._setLabelFunction.call(this, value);
                this._labelChanged = true;
                this.invalidateProperties();
            };
            Object.defineProperty(__egretProto__, "dropDownController", {
                /**
                 * 下拉控制器
                 * @member egret.gui.DropDownListBase#dropDownController
                 */
                get: function () {
                    return this._dropDownController;
                },
                set: function (value) {
                    if (this._dropDownController == value)
                        return;
                    this._dropDownController = value;
                    this._dropDownController.addEventListener(gui.UIEvent.OPEN, this._dropDownController_openHandler, this);
                    this._dropDownController.addEventListener(gui.UIEvent.CLOSE, this.dropDownController_closeHandler, this);
                    if (this.openButton)
                        this._dropDownController.openButton = this.openButton;
                    if (this.dropDown)
                        this._dropDownController.dropDown = this.dropDown;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "isDropDownOpen", {
                /**
                 * 下拉列表是否已经已打开
                 * @member egret.gui.DropDownListBase#isDropDownOpen
                 */
                get: function () {
                    if (this.dropDownController)
                        return this.dropDownController.isOpen;
                    else
                        return false;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 处理对组件设置的属性
             * @method egret.gui.DropDownListBase#commitProperties
             */
            __egretProto__.commitProperties = function () {
                _super.prototype.commitProperties.call(this);
                if (this._labelChanged) {
                    this._labelChanged = false;
                    this.updateLabelDisplay();
                }
            };
            /**
             * 添加外观部件时调用
             * @method egret.gui.DropDownListBase#partAdded
             * @param partName {string}
             * @param instance {any}
             */
            __egretProto__.partAdded = function (partName, instance) {
                _super.prototype.partAdded.call(this, partName, instance);
                if (instance == this.openButton) {
                    if (this.dropDownController)
                        this.dropDownController.openButton = this.openButton;
                }
                else if (instance == this.dropDown && this.dropDownController) {
                    this.dropDownController.dropDown = this.dropDown;
                }
            };
            /**
             * 正删除外观部件的实例时调用
             * @method egret.gui.DropDownListBase#partRemoved
             * @param partName {string}
             * @param instance {any}
             */
            __egretProto__.partRemoved = function (partName, instance) {
                if (this.dropDownController) {
                    if (instance == this.openButton)
                        this.dropDownController.openButton = null;
                    if (instance == this.dropDown)
                        this.dropDownController.dropDown = null;
                }
                _super.prototype.partRemoved.call(this, partName, instance);
            };
            /**
             * 返回要应用到外观的状态的名称
             * @method egret.gui.DropDownListBase#getCurrentSkinState
             * @returns {string}
             */
            __egretProto__.getCurrentSkinState = function () {
                return !this.enabled ? "disabled" : this.isDropDownOpen ? "open" : "normal";
            };
            /**
             * @method egret.gui.DropDownListBase#commitSelection
             * @param dispatchChangedEvents {boolean}
             * @returns {boolean}
             */
            __egretProto__.commitSelection = function (dispatchChangedEvents) {
                if (dispatchChangedEvents === void 0) { dispatchChangedEvents = true; }
                var retVal = _super.prototype.commitSelection.call(this, dispatchChangedEvents);
                this.updateLabelDisplay();
                return retVal;
            };
            /**
             * @method egret.gui.DropDownListBase#_isItemIndexSelected
             * @param index {number}
             * @returns {boolean}
             */
            __egretProto__._isItemIndexSelected = function (index) {
                return this._userProposedSelectedIndex == index;
            };
            /**
             * 打开下拉列表并抛出UIEvent.OPEN事件。
             * @method egret.gui.DropDownListBase#openDropDown
             */
            __egretProto__.openDropDown = function () {
                this.dropDownController.openDropDown();
            };
            /**
             * 关闭下拉列表并抛出UIEvent.CLOSE事件。
             * @method egret.gui.DropDownListBase#closeDropDown
             * @param commit {boolean}
             */
            __egretProto__.closeDropDown = function (commit) {
                this.dropDownController.closeDropDown(commit);
            };
            /**
             * 更新选中项的提示文本
             * @method egret.gui.DropDownListBase#updateLabelDisplay
             * @param displayItem {any}
             */
            __egretProto__.updateLabelDisplay = function (displayItem) {
                if (displayItem === void 0) { displayItem = undefined; }
            };
            /**
             * 改变高亮的选中项
             * @param newIndex {number}
             * @param scrollToTop {boolean}
             */
            __egretProto__._changeHighlightedSelection = function (newIndex, scrollToTop) {
                if (scrollToTop === void 0) { scrollToTop = false; }
                this.itemSelected(this._userProposedSelectedIndex, false);
                this._userProposedSelectedIndex = newIndex;
                this.itemSelected(this._userProposedSelectedIndex, true);
            };
            __egretProto__.dataProvider_collectionChangeHandler = function (event) {
                _super.prototype.dataProvider_collectionChangeHandler.call(this, event);
                this._labelChanged = true;
                this.invalidateProperties();
            };
            /**
             * @method egret.gui.DropDownListBase#item_mouseDownHandler
             * @param event {TouchEvent}
             */
            __egretProto__._item_touchEndHandler = function (event) {
                _super.prototype._item_touchEndHandler.call(this, event);
                var itemRenderer = (event.currentTarget);
                if (itemRenderer != this._mouseDownItemRenderer)
                    return;
                this._dispatchListEvent(event, gui.ListEvent.ITEM_CLICK, itemRenderer);
                this._userProposedSelectedIndex = this.selectedIndex;
                this.closeDropDown(true);
            };
            /**
             * 控制器抛出打开列表事件
             */
            __egretProto__._dropDownController_openHandler = function (event) {
                this.addEventListener(gui.UIEvent.UPDATE_COMPLETE, this._open_updateCompleteHandler, this);
                this._userProposedSelectedIndex = this.selectedIndex;
                this.invalidateSkinState();
            };
            /**
             * 打开列表后组件一次失效验证全部完成
             */
            __egretProto__._open_updateCompleteHandler = function (event) {
                this.removeEventListener(gui.UIEvent.UPDATE_COMPLETE, this._open_updateCompleteHandler, this);
                gui.UIEvent.dispatchUIEvent(this, gui.UIEvent.OPEN);
            };
            /**
             * 控制器抛出关闭列表事件
             * @method egret.gui.DropDownListBase#dropDownController_closeHandler
             * @param event {UIEvent}
             */
            __egretProto__.dropDownController_closeHandler = function (event) {
                this.addEventListener(gui.UIEvent.UPDATE_COMPLETE, this.close_updateCompleteHandler, this);
                this.invalidateSkinState();
                if (!event.isDefaultPrevented()) {
                    this._setSelectedIndex(this._userProposedSelectedIndex, true);
                }
                else {
                    this._changeHighlightedSelection(this.selectedIndex);
                }
            };
            /**
             * 关闭列表后组件一次失效验证全部完成
             */
            __egretProto__.close_updateCompleteHandler = function (event) {
                this.removeEventListener(gui.UIEvent.UPDATE_COMPLETE, this.close_updateCompleteHandler, this);
                gui.UIEvent.dispatchUIEvent(this, gui.UIEvent.CLOSE);
            };
            /**
             * @constant egret.gui.DropDownListBase.PAGE_SIZE
             */
            DropDownListBase.PAGE_SIZE = 5;
            return DropDownListBase;
        })(gui.List);
        gui.DropDownListBase = DropDownListBase;
        DropDownListBase.prototype.__class__ = "egret.gui.DropDownListBase";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
