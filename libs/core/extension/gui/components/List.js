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
         * @class egret.gui.List
         * @classdesc
         * 列表组件
         * @extends egret.gui.ListBase
         */
        var List = (function (_super) {
            __extends(List, _super);
            function List() {
                var _this = this;
                _super.call(this);
                this._allowMultipleSelection = false;
                this._selectedIndices = [];
                /**
                 * 是否是有效的索引
                 */
                this.isValidIndex = function (item, index, v) {
                    return _this.dataProvider && (item >= 0) && (item < _this.dataProvider.length);
                };
                /**
                 * 是否捕获ItemRenderer以便在MouseUp时抛出ItemClick事件
                 */
                this._captureItemRenderer = true;
                this._mouseDownItemRenderer = null;
                this.useVirtualLayout = true;
            }
            var __egretProto__ = List.prototype;
            /**
             * 创建容器的子元素
             */
            __egretProto__.createChildren = function () {
                if (!this.itemRenderer)
                    this.itemRenderer = gui.DataGroup.defaultRendererFactory;
                _super.prototype.createChildren.call(this);
            };
            Object.defineProperty(__egretProto__, "useVirtualLayout", {
                /**
                 * 是否使用虚拟布局,默认true
                 * @member egret.gui.List#useVirtualLayout
                 */
                get: function () {
                    return this._getUseVirtualLayout();
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    this._setUseVirtualLayout(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "allowMultipleSelection", {
                /**
                 * 是否允许同时选中多项
                 * @member egret.gui.List#allowMultipleSelection
                 */
                get: function () {
                    return this._allowMultipleSelection;
                },
                set: function (value) {
                    this._allowMultipleSelection = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "selectedIndices", {
                /**
                 * 当前选中的一个或多个项目的索引列表
                 * @member egret.gui.List#selectedIndices
                 */
                get: function () {
                    if (this._proposedSelectedIndices)
                        return this._proposedSelectedIndices;
                    return this._selectedIndices;
                },
                set: function (value) {
                    this._setSelectedIndices(value, false);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "selectedIndex", {
                /**
                 * @member egret.gui.List#selectedIndex
                 */
                get: function () {
                    if (this._proposedSelectedIndices) {
                        if (this._proposedSelectedIndices.length > 0)
                            return this._proposedSelectedIndices[0];
                        return -1;
                    }
                    return this._getSelectedIndex();
                },
                set: function (value) {
                    this._setSelectedIndex(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "selectedItems", {
                /**
                 * 当前选中的一个或多个项目的数据源列表
                 * @member egret.gui.List#selectedItems
                 */
                get: function () {
                    var result = [];
                    var list = this.selectedIndices;
                    if (list) {
                        var count = list.length;
                        for (var i = 0; i < count; i++)
                            result[i] = this.dataProvider.getItemAt(list[i]);
                    }
                    return result;
                },
                set: function (value) {
                    var indices = [];
                    if (value) {
                        var count = value.length;
                        for (var i = 0; i < count; i++) {
                            var index = this.dataProvider.getItemIndex(value[i]);
                            if (index != -1) {
                                indices.splice(0, 0, index);
                            }
                            if (index == -1) {
                                indices = [];
                                break;
                            }
                        }
                    }
                    this._setSelectedIndices(indices, false);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 设置多个选中项
             */
            __egretProto__._setSelectedIndices = function (value, dispatchChangeEvent) {
                if (dispatchChangeEvent === void 0) { dispatchChangeEvent = false; }
                if (dispatchChangeEvent)
                    this._dispatchChangeAfterSelection = (this._dispatchChangeAfterSelection || dispatchChangeEvent);
                if (value)
                    this._proposedSelectedIndices = value;
                else
                    this._proposedSelectedIndices = [];
                this.invalidateProperties();
            };
            /**
             * 处理对组件设置的属性
             * @method egret.gui.List#commitProperties
             */
            __egretProto__.commitProperties = function () {
                _super.prototype.commitProperties.call(this);
                if (this._proposedSelectedIndices) {
                    this.commitSelection();
                }
            };
            /**
             * @method egret.gui.List#commitSelection
             * @param dispatchChangedEvents {boolean}
             * @returns {boolean}
             */
            __egretProto__.commitSelection = function (dispatchChangedEvents) {
                if (dispatchChangedEvents === void 0) { dispatchChangedEvents = true; }
                var oldSelectedIndex = this._selectedIndex;
                if (this._proposedSelectedIndices) {
                    this._proposedSelectedIndices = this._proposedSelectedIndices.filter(this.isValidIndex);
                    if (!this.allowMultipleSelection && this._proposedSelectedIndices.length > 0) {
                        var temp = [];
                        temp.push(this._proposedSelectedIndices[0]);
                        this._proposedSelectedIndices = temp;
                    }
                    if (this._proposedSelectedIndices.length > 0) {
                        this._proposedSelectedIndex = this._proposedSelectedIndices[0];
                    }
                    else {
                        this._proposedSelectedIndex = -1;
                    }
                }
                var retVal = _super.prototype.commitSelection.call(this, false);
                if (!retVal) {
                    this._proposedSelectedIndices = null;
                    return false;
                }
                if (this.selectedIndex > gui.ListBase.NO_SELECTION) {
                    if (this._proposedSelectedIndices) {
                        if (this._proposedSelectedIndices.indexOf(this.selectedIndex) == -1)
                            this._proposedSelectedIndices.push(this.selectedIndex);
                    }
                    else {
                        this._proposedSelectedIndices = [this.selectedIndex];
                    }
                }
                if (this._proposedSelectedIndices) {
                    if (this._proposedSelectedIndices.indexOf(oldSelectedIndex) != -1)
                        this.itemSelected(oldSelectedIndex, true);
                    this.commitMultipleSelection();
                }
                if (dispatchChangedEvents && retVal) {
                    if (this._dispatchChangeAfterSelection) {
                        gui.IndexChangeEvent.dispatchIndexChangeEvent(this, gui.IndexChangeEvent.CHANGE, oldSelectedIndex, this._selectedIndex);
                        this._dispatchChangeAfterSelection = false;
                    }
                    gui.UIEvent.dispatchUIEvent(this, gui.UIEvent.VALUE_COMMIT);
                }
                return retVal;
            };
            /**
             * 提交多项选中项属性
             */
            __egretProto__.commitMultipleSelection = function () {
                var removedItems = [];
                var addedItems = [];
                var i;
                var count;
                if (this._selectedIndices.length > 0 && this._proposedSelectedIndices.length > 0) {
                    count = this._proposedSelectedIndices.length;
                    for (i = 0; i < count; i++) {
                        if (this._selectedIndices.indexOf(this._proposedSelectedIndices[i]) == -1)
                            addedItems.push(this._proposedSelectedIndices[i]);
                    }
                    count = this._selectedIndices.length;
                    for (i = 0; i < count; i++) {
                        if (this._proposedSelectedIndices.indexOf(this._selectedIndices[i]) == -1)
                            removedItems.push(this._selectedIndices[i]);
                    }
                }
                else if (this._selectedIndices.length > 0) {
                    removedItems = this._selectedIndices;
                }
                else if (this._proposedSelectedIndices.length > 0) {
                    addedItems = this._proposedSelectedIndices;
                }
                this._selectedIndices = this._proposedSelectedIndices;
                if (removedItems.length > 0) {
                    count = removedItems.length;
                    for (i = 0; i < count; i++) {
                        this.itemSelected(removedItems[i], false);
                    }
                }
                if (addedItems.length > 0) {
                    count = addedItems.length;
                    for (i = 0; i < count; i++) {
                        this.itemSelected(addedItems[i], true);
                    }
                }
                this._proposedSelectedIndices = null;
            };
            /**
             *
             * @param index
             * @returns {boolean}
             * @private
             */
            __egretProto__._isItemIndexSelected = function (index) {
                if (this._allowMultipleSelection)
                    return this._selectedIndices.indexOf(index) != -1;
                return _super.prototype._isItemIndexSelected.call(this, index);
            };
            __egretProto__.dataGroup_rendererAddHandler = function (event) {
                _super.prototype.dataGroup_rendererAddHandler.call(this, event);
                var renderer = (event.renderer);
                if (renderer == null)
                    return;
                renderer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._item_touchBeginHandler, this);
                //由于ItemRenderer.mouseChildren有可能不为false，在鼠标按下时会出现切换素材的情况，
                //导致target变化而无法抛出原生的click事件,所以此处监听MouseUp来抛出ItemClick事件。
                renderer.addEventListener(egret.TouchEvent.TOUCH_END, this._item_touchEndHandler, this);
            };
            /**
             * 数据源发生刷新
             */
            __egretProto__.dataProviderRefreshed = function () {
                if (this._allowMultipleSelection) {
                    return;
                }
                _super.prototype.dataProviderRefreshed.call(this);
            };
            __egretProto__.dataGroup_rendererRemoveHandler = function (event) {
                _super.prototype.dataGroup_rendererRemoveHandler.call(this, event);
                var renderer = (event.renderer);
                if (renderer == null)
                    return;
                renderer.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._item_touchBeginHandler, this);
                renderer.removeEventListener(egret.TouchEvent.TOUCH_END, this._item_touchEndHandler, this);
            };
            /**
             * 鼠标在项呈示器上按下
             * @method egret.gui.List#item_mouseDownHandler
             * @param event {TouchEvent}
             */
            __egretProto__._item_touchBeginHandler = function (event) {
                if (event._isDefaultPrevented)
                    return;
                var itemRenderer = (event.currentTarget);
                this._mouseDownItemRenderer = itemRenderer;
                gui.UIGlobals.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
                gui.UIGlobals.stage.addEventListener(egret.Event.LEAVE_STAGE, this.stage_touchEndHandler, this);
            };
            /**
             * 计算当前的选中项列表
             */
            __egretProto__.calculateSelectedIndices = function (index, shiftKey, ctrlKey) {
                var i;
                var interval = [];
                if (!shiftKey) {
                    if (ctrlKey) {
                        if (this._selectedIndices.length > 0) {
                            if (this._selectedIndices.length == 1 && (this._selectedIndices[0] == index)) {
                                if (!this.requireSelection)
                                    return interval;
                                interval.splice(0, 0, this._selectedIndices[0]);
                                return interval;
                            }
                            else {
                                var found = false;
                                for (i = 0; i < this._selectedIndices.length; i++) {
                                    if (this._selectedIndices[i] == index)
                                        found = true;
                                    else if (this._selectedIndices[i] != index)
                                        interval.splice(0, 0, this._selectedIndices[i]);
                                }
                                if (!found) {
                                    interval.splice(0, 0, index);
                                }
                                return interval;
                            }
                        }
                        else {
                            interval.splice(0, 0, index);
                            return interval;
                        }
                    }
                    else {
                        interval.splice(0, 0, index);
                        return interval;
                    }
                }
                else {
                    var start = this._selectedIndices.length > 0 ? this._selectedIndices[this._selectedIndices.length - 1] : 0;
                    var end = index;
                    if (start < end) {
                        for (i = start; i <= end; i++) {
                            interval.splice(0, 0, i);
                        }
                    }
                    else {
                        for (i = start; i >= end; i--) {
                            interval.splice(0, 0, i);
                        }
                    }
                    return interval;
                }
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
                if (this._allowMultipleSelection) {
                    this._setSelectedIndices(this.calculateSelectedIndices(newIndex, event.shiftKey, event.ctrlKey), true);
                }
                else {
                    this._setSelectedIndex(newIndex, true);
                }
                if (!this._captureItemRenderer)
                    return;
                this._dispatchListEvent(event, gui.ListEvent.ITEM_CLICK, itemRenderer);
            };
            /**
             * 鼠标在舞台上弹起
             */
            __egretProto__.stage_touchEndHandler = function (event) {
                gui.UIGlobals.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
                gui.UIGlobals.stage.removeEventListener(egret.Event.LEAVE_STAGE, this.stage_touchEndHandler, this);
                this._mouseDownItemRenderer = null;
            };
            return List;
        })(gui.ListBase);
        gui.List = List;
        List.prototype.__class__ = "egret.gui.List";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
