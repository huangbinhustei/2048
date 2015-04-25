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
         * @class egret.gui.TreeItemRenderer
         * @classdesc
         * Tree组件的项呈示器基类
         * @extends egret.gui.ItemRenderer
         * @implements egret.gui.ITreeItemRenderer
         */
        var TreeItemRenderer = (function (_super) {
            __extends(TreeItemRenderer, _super);
            /**
             * 构造函数
             * @method egret.gui.TreeItemRenderer#constructor
             */
            function TreeItemRenderer() {
                _super.call(this);
                /**
                 * [SkinPart]图标显示对象
                 * @member egret.gui.TreeItemRenderer#iconDisplay
                 */
                this.iconDisplay = null;
                /**
                 * [SkinPart]子节点开启按钮
                 * @member egret.gui.TreeItemRenderer#disclosureButton
                 */
                this.disclosureButton = null;
                /**
                 * [SkinPart]用于调整缩进值的容器对象。
                 * @member egret.gui.TreeItemRenderer#contentGroup
                 */
                this.contentGroup = null;
                /**
                 *
                 * @type {number}
                 * @private
                 */
                this._indentation = 17;
                /**
                 *
                 * @type {null}
                 * @private
                 */
                this._iconSkinName = null;
                /**
                 *
                 * @type {number}
                 * @private
                 */
                this._depth = 0;
                /**
                 *
                 * @type {boolean}
                 * @private
                 */
                this._hasChildren = false;
                /**
                 *
                 * @type {boolean}
                 * @private
                 */
                this._isOpen = false;
                this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onItemMouseDown, this, false, 1000);
            }
            var __egretProto__ = TreeItemRenderer.prototype;
            __egretProto__.onItemMouseDown = function (event) {
                if (event.target == this.disclosureButton) {
                    event.stopImmediatePropagation();
                }
            };
            Object.defineProperty(__egretProto__, "indentation", {
                /**
                 * 子节点相对父节点的缩进值，以像素为单位。默认17。
                 * @member egret.gui.TreeItemRenderer#indentation
                 */
                get: function () {
                    return this._indentation;
                },
                set: function (value) {
                    this._indentation = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "iconSkinName", {
                /**
                 * @member egret.gui.TreeItemRenderer#iconSkinName
                 */
                get: function () {
                    return this._iconSkinName;
                },
                set: function (value) {
                    if (this._iconSkinName == value)
                        return;
                    this._iconSkinName = value;
                    if (this.iconDisplay) {
                        this.iconDisplay.source = this._iconSkinName;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "depth", {
                /**
                 * @member egret.gui.TreeItemRenderer#depth
                 */
                get: function () {
                    return this._depth;
                },
                set: function (value) {
                    if (value == this._depth)
                        return;
                    this._depth = value;
                    if (this.contentGroup) {
                        this.contentGroup.x = this._depth * this._indentation;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "hasChildren", {
                /**
                 * @member egret.gui.TreeItemRenderer#hasChildren
                 */
                get: function () {
                    return this._hasChildren;
                },
                set: function (value) {
                    if (this._hasChildren == value)
                        return;
                    this._hasChildren = value;
                    if (this.disclosureButton) {
                        this.disclosureButton.visible = this._hasChildren;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "opened", {
                /**
                 * @member egret.gui.TreeItemRenderer#opened
                 */
                get: function () {
                    return this._isOpen;
                },
                set: function (value) {
                    if (this._isOpen == value)
                        return;
                    this._isOpen = value;
                    if (this.disclosureButton) {
                        this.disclosureButton.selected = this._isOpen;
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 添加外观部件时调用
             * @method egret.gui.TreeItemRenderer#partAdded
             * @param partName {string}
             * @param instance {any}
             */
            __egretProto__.partAdded = function (partName, instance) {
                _super.prototype.partAdded.call(this, partName, instance);
                if (instance == this.iconDisplay) {
                    this.iconDisplay.source = this._iconSkinName;
                }
                else if (instance == this.disclosureButton) {
                    this.disclosureButton.visible = this._hasChildren;
                    this.disclosureButton.selected = this._isOpen;
                    this.disclosureButton._autoSelected = false;
                    this.disclosureButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.disclosureButton_mouseDownHandler, this);
                }
                else if (instance == this.contentGroup) {
                    this.contentGroup.x = this._depth * this._indentation;
                }
            };
            /**
             * 删除外观部件的实例时调用
             * @method egret.gui.TreeItemRenderer#partRemoved
             * @param partName {string}
             * @param instance {any}
             */
            __egretProto__.partRemoved = function (partName, instance) {
                _super.prototype.partRemoved.call(this, partName, instance);
                if (instance == this.iconDisplay) {
                    this.iconDisplay.source = null;
                }
                else if (instance == this.disclosureButton) {
                    this.disclosureButton.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.disclosureButton_mouseDownHandler, this);
                    this.disclosureButton._autoSelected = true;
                    this.disclosureButton.visible = true;
                }
            };
            /**
             * 鼠标在disclosureButton上按下
             * @method egret.gui.TreeItemRenderer#disclosureButton_mouseDownHandler
             * @param event {TouchEvent}
             */
            __egretProto__.disclosureButton_mouseDownHandler = function (event) {
                gui.TreeEvent.dispatchTreeEvent(this, gui.TreeEvent.ITEM_OPENING, this.itemIndex, this.data, this, !this._isOpen);
            };
            return TreeItemRenderer;
        })(gui.ItemRenderer);
        gui.TreeItemRenderer = TreeItemRenderer;
        TreeItemRenderer.prototype.__class__ = "egret.gui.TreeItemRenderer";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
