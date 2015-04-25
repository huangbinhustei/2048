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
         * @class egret.gui.UIComponent
         * @classdesc
         * 显示对象基类
         * @extends egret.DisplayObjectContainer
         * @implements egret.gui.IUIComponent
         * @implements egret.gui.ILayoutManagerClient
         * @implements egret.gui.ILayoutElement
         * @implements egret.gui.IInvalidating
         * @implements egret.gui.IVisualElement
         */
        var UIComponent = (function (_super) {
            __extends(UIComponent, _super);
            /**
             * 构造函数
             * @method egret.gui.UIComponent#constructor
             */
            function UIComponent() {
                _super.call(this);
                this._id = null;
                this._isPopUp = false;
                this._owner = null;
                this._updateCompletePendingFlag = false;
                this._initialized = false;
                /**
                 * _initialize()方法被调用过的标志。
                 */
                this.initializeCalled = false;
                this._nestLevel = 0;
                /**
                 * 是否已经创建了自身的样式原型链
                 */
                this._hasOwnStyleChain = false;
                /**
                 * 样式原型链引用
                 */
                this._styleProtoChain = null;
                /**
                 * 一个性能优化的标志变量。某些子类可以设置为true显式表明自己不含有可设置样式的子项。
                 */
                this._hasNoStyleChild = false;
                this._enabled = true;
                /**
                 * 属性提交前组件旧的宽度
                 */
                this.oldWidth = NaN;
                this._width = 0;
                /**
                 * 属性提交前组件旧的高度
                 */
                this.oldHeight = NaN;
                this._height = 0;
                this._minWidth = 0;
                this._maxWidth = 10000;
                this._minHeight = 0;
                this._maxHeight = 10000;
                this._measuredWidth = 0;
                this._measuredHeight = 0;
                /**
                 * 属性提交前组件旧的X
                 * @member egret.gui.UIComponent#oldX
                 */
                this.oldX = NaN;
                /**
                 * 属性提交前组件旧的Y
                 * @member egret.gui.UIComponent#oldY
                 */
                this.oldY = NaN;
                /**
                 * @member egret.gui.UIComponent#_invalidatePropertiesFlag
                 */
                this._invalidatePropertiesFlag = false;
                /**
                 * @member egret.gui.UIComponent#_invalidateSizeFlag
                 */
                this._invalidateSizeFlag = false;
                /**
                 * 上一次测量的首选宽度
                 * @member egret.gui.UIComponent#_oldPreferWidth
                 */
                this._oldPreferWidth = NaN;
                /**
                 * 上一次测量的首选高度
                 * @member egret.gui.UIComponent#_oldPreferHeight
                 */
                this._oldPreferHeight = NaN;
                this._invalidateDisplayListFlag = false;
                this._validateNowFlag = false;
                this._includeInLayout = true;
                this._left = NaN;
                this._right = NaN;
                this._top = NaN;
                this._bottom = NaN;
                this._horizontalCenter = NaN;
                this._verticalCenter = NaN;
                this._percentWidth = NaN;
                this._percentHeight = NaN;
                /**
                 * 父级布局管理器设置了组件的宽度标志，尺寸设置优先级：自动布局>显式设置>自动测量
                 * @member egret.gui.UIComponent#_layoutWidthExplicitlySet
                 */
                this._layoutWidthExplicitlySet = false;
                /**
                 * 父级布局管理器设置了组件的高度标志，尺寸设置优先级：自动布局>显式设置>自动测量
                 * @member egret.gui.UIComponent#_layoutHeightExplicitlySet
                 */
                this._layoutHeightExplicitlySet = false;
                this.touchEnabled = true;
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.checkInvalidateFlag, this);
                if (UIComponent.prototypeCanSet === undefined) {
                    var chain = {};
                    UIComponent.prototypeCanSet = (chain.__proto__ !== undefined);
                }
            }
            var __egretProto__ = UIComponent.prototype;
            /**
             * 添加到舞台
             */
            __egretProto__.onAddedToStage = function (e) {
                this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this._initialize();
                gui.UIGlobals._initlize(this.stage);
                if (this._nestLevel > 0)
                    this.checkInvalidateFlag();
            };
            Object.defineProperty(__egretProto__, "id", {
                /**
                 * 组件 ID。此值将作为对象的实例名称，因此不应包含任何空格或特殊字符。应用程序中的每个组件都应具有唯一的 ID。
                 * @constant egret.gui.UIComponent#id
                 */
                get: function () {
                    return this._id;
                },
                set: function (value) {
                    this._id = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "isPopUp", {
                /**
                 * @member egret.gui.UIComponent#isPopUp
                 */
                get: function () {
                    return this._isPopUp;
                },
                set: function (value) {
                    this._isPopUp = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "owner", {
                /**
                 * @member egret.gui.UIComponent#owner
                 */
                get: function () {
                    return this._owner ? this._owner : this.parent;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @method egret.gui.UIComponent#ownerChanged
             * @param value {any}
             */
            __egretProto__.ownerChanged = function (value) {
                this._owner = value;
            };
            Object.defineProperty(__egretProto__, "updateCompletePendingFlag", {
                /**
                 * @member egret.gui.UIComponent#updateCompletePendingFlag
                 */
                get: function () {
                    return this._updateCompletePendingFlag;
                },
                set: function (value) {
                    this._updateCompletePendingFlag = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "initialized", {
                /**
                 * @member egret.gui.UIComponent#initialized
                 */
                get: function () {
                    return this._initialized;
                },
                set: function (value) {
                    if (this._initialized == value)
                        return;
                    this._initialized = value;
                    if (value) {
                        this.childrenCreated();
                        gui.UIEvent.dispatchUIEvent(this, gui.UIEvent.CREATION_COMPLETE);
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 初始化组件
             * @method egret.gui.UIComponent#_initialize
             */
            __egretProto__._initialize = function () {
                if (this.initializeCalled)
                    return;
                if (gui.UIGlobals.stage) {
                    this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                }
                this.initializeCalled = true;
                gui.UIEvent.dispatchUIEvent(this, gui.UIEvent.INITIALIZE);
                this.createChildren();
                this.invalidateProperties();
                this.invalidateSize();
                this.invalidateDisplayList();
            };
            /**
             * 创建子项,子类覆盖此方法以完成组件子项的初始化操作，
             * 请务必调用super.createChildren()以完成父类组件的初始化
             * @method egret.gui.UIComponent#createChildren
             */
            __egretProto__.createChildren = function () {
            };
            /**
             * 子项创建完成
             * @method egret.gui.UIComponent#childrenCreated
             */
            __egretProto__.childrenCreated = function () {
            };
            Object.defineProperty(__egretProto__, "nestLevel", {
                /**
                 * @member egret.gui.UIComponent#nestLevel
                 */
                get: function () {
                    return this._nestLevel;
                },
                set: function (value) {
                    if (this._nestLevel == value)
                        return;
                    this._nestLevel = value;
                    if (this._nestLevel == 0)
                        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.checkInvalidateFlag, this);
                    else
                        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.checkInvalidateFlag, this);
                    this._updateChildrenNestLevel();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新子项的nestLevel属性
             */
            __egretProto__._updateChildrenNestLevel = function () {
                for (var i = this.numChildren - 1; i >= 0; i--) {
                    var child = (this.getChildAt(i));
                    if (child && "nestLevel" in child) {
                        child.nestLevel = this._nestLevel + 1;
                    }
                }
            };
            /**
             * 获取指定的名称的样式属性值
             */
            __egretProto__.getStyle = function (styleProp) {
                var chain = this._styleProtoChain;
                if (!chain) {
                    return undefined;
                }
                return chain[styleProp];
            };
            /**
             * 对此组件实例设置样式属性。在此组件上设置的样式会覆盖父级容器的同名样式。推荐在子项较少的组件上使用，尽量避免在全局调用此方法，有可能造成性能问题。
             */
            __egretProto__.setStyle = function (styleProp, newValue) {
                var chain = this._styleProtoChain;
                if (!this._hasOwnStyleChain) {
                    chain = this._createOwnStyleProtoChain(chain);
                }
                chain[styleProp] = newValue;
                this.styleChanged(styleProp);
                this.notifyStyleChangeInChildren(styleProp);
            };
            __egretProto__.styleChanged = function (styleProp) {
            };
            /**
             * 通知子项列表样式发生改变
             */
            __egretProto__.notifyStyleChangeInChildren = function (styleProp) {
                if (this._hasNoStyleChild) {
                    return;
                }
                for (var i = this.numChildren - 1; i >= 0; i--) {
                    var child = (this.getChildAt(i));
                    if (!child) {
                        continue;
                    }
                    if ("styleChanged" in child) {
                        child.styleChanged(styleProp);
                        child.notifyStyleChangeInChildren(styleProp);
                    }
                }
            };
            __egretProto__._createOwnStyleProtoChain = function (chain) {
                this._hasOwnStyleChain = true;
                if (UIComponent.prototypeCanSet) {
                    this._styleProtoChain = {};
                    this._styleProtoChain.__proto__ = chain ? chain : UIComponent.emptyStyleChain;
                }
                else {
                    this._styleProtoChain = this.createProtoChain(chain);
                }
                chain = this._styleProtoChain;
                if (!this._hasNoStyleChild) {
                    for (var i = this.numChildren - 1; i >= 0; i--) {
                        var child = (this.getChildAt(i));
                        if (child && "regenerateStyleCache" in child) {
                            child["regenerateStyleCache"](chain);
                        }
                    }
                }
                return chain;
            };
            /**
             * 创建一个原型链节点
             */
            __egretProto__.createProtoChain = function (parentChain) {
                function factory() {
                }
                ;
                factory.prototype = parentChain;
                var childChain = new factory();
                factory.prototype = null;
                return childChain;
            };
            /**
             * 清除在此组件实例上设置过的指定样式名。
             */
            __egretProto__.clearStyle = function (styleProp) {
                if (!this._hasOwnStyleChain) {
                    return;
                }
                var chain = this._styleProtoChain;
                delete chain[styleProp];
                this.styleChanged(styleProp);
                this.notifyStyleChangeInChildren(styleProp);
            };
            /**
             * 重新生成自身以及所有子项的原型链
             */
            __egretProto__.regenerateStyleCache = function (parentChain) {
                if (!UIComponent.prototypeCanSet) {
                    this.regenerateStyleCacheForIE(parentChain);
                    return;
                }
                if (this._hasOwnStyleChain) {
                    this._styleProtoChain.__proto__ = parentChain ? parentChain : UIComponent.emptyStyleChain;
                }
                else if (this._styleProtoChain != parentChain) {
                    this._styleProtoChain = parentChain;
                    for (var i = this.numChildren - 1; i >= 0; i--) {
                        var child = (this.getChildAt(i));
                        if (child && "regenerateStyleCache" in child) {
                            child.regenerateStyleCache(parentChain);
                        }
                    }
                }
            };
            /**
             * 兼容IE9，10的写法。
             */
            __egretProto__.regenerateStyleCacheForIE = function (parentChain) {
                if (this._hasOwnStyleChain) {
                    var chain = this._styleProtoChain;
                    var childChain = this.createProtoChain(parentChain);
                    for (var key in chain) {
                        if (chain.hasOwnProperty(key)) {
                            childChain[key] = chain[key];
                        }
                    }
                    this._styleProtoChain = childChain;
                    parentChain = childChain;
                }
                else {
                    this._styleProtoChain = parentChain;
                }
                if (!this._hasNoStyleChild) {
                    for (var i = this.numChildren - 1; i >= 0; i--) {
                        var child = this.getChildAt(i);
                        if (child && "regenerateStyleCacheForIE" in child) {
                            child["regenerateStyleCacheForIE"](parentChain);
                        }
                    }
                }
            };
            /**
             * 添加对象到显示列表,此接口仅预留给框架内部使用
             * 如果需要管理子项，若有，请使用容器的addElement()方法，非法使用有可能造成无法自动布局。
             */
            __egretProto__._addToDisplayList = function (child, notifyListeners) {
                if (notifyListeners === void 0) { notifyListeners = true; }
                var index = this.numChildren;
                if (child.parent == this)
                    index--;
                this._addingChild(child);
                this._doAddChild(child, index, notifyListeners);
                this._childAdded(child);
                return child;
            };
            /**
             * 添加对象到显示列表,此接口仅预留给框架内部使用
             * 如果需要管理子项，若有，请使用容器的addElementAt()方法，非法使用有可能造成无法自动布局。
             */
            __egretProto__._addToDisplayListAt = function (child, index, notifyListeners) {
                if (notifyListeners === void 0) { notifyListeners = true; }
                this._addingChild(child);
                this._doAddChild(child, index, notifyListeners);
                this._childAdded(child);
                return child;
            };
            /**
             * 添加对象到显示列表,此接口仅预留给框架内部使用
             * 如果需要管理子项，若有，请使用容器的removeElement()方法,非法使用有可能造成无法自动布局。
             */
            __egretProto__._removeFromDisplayList = function (child, notifyListeners) {
                if (notifyListeners === void 0) { notifyListeners = true; }
                var index = this._children.indexOf(child);
                if (index >= 0) {
                    this._doRemoveChild(index, notifyListeners);
                    this._childRemoved(child);
                    return child;
                }
                else {
                    egret.Logger.fatalWithErrorId(1008);
                    return null;
                }
            };
            /**
             * 从显示列表移除指定索引的子项,此接口仅预留给框架内部使用
             * 如果需要管理子项，若有，请使用容器的removeElementAt()方法,非法使用有可能造成无法自动布局。
             */
            __egretProto__._removeFromDisplayListAt = function (index, notifyListeners) {
                if (notifyListeners === void 0) { notifyListeners = true; }
                if (index >= 0 && index < this._children.length) {
                    var child = this._doRemoveChild(index, notifyListeners);
                    this._childRemoved(child);
                    return child;
                }
                else {
                    egret.Logger.fatalWithErrorId(1007);
                    return null;
                }
            };
            /**
             * GUI范围内，请不要调用任何addChild方法，若是容器，请用addElement,若需要包装普通显示对象，请把显示对象赋值给UIAsset.source。
             * @deprecated
             * @method egret.gui.UIComponent#addChild
             * @param child {DisplayObject}
             * @returns {DisplayObject}
             */
            __egretProto__.addChild = function (child) {
                this._addingChild(child);
                _super.prototype.addChild.call(this, child);
                this._childAdded(child);
                return child;
            };
            /**
             * GUI范围内，请不要调用任何addChildAt方法，若是容器，请用addElementAt,若需要包装普通显示对象，请把显示对象赋值给UIAsset.source。
             * @deprecated
             * @method egret.gui.UIComponent#addChildAt
             * @param child {DisplayObject}
             * @param index {number}
             * @returns {DisplayObject}
             */
            __egretProto__.addChildAt = function (child, index) {
                this._addingChild(child);
                _super.prototype.addChildAt.call(this, child, index);
                this._childAdded(child);
                return child;
            };
            /**
             * 即将添加一个子项
             */
            __egretProto__._addingChild = function (child) {
                if (!child) {
                    return;
                }
                if ("nestLevel" in child) {
                    child.nestLevel = this._nestLevel + 1;
                }
                if ("styleChanged" in child) {
                    var chain = this._styleProtoChain;
                    if (chain || child["_styleProtoChain"]) {
                        child["regenerateStyleCache"](chain);
                        child["styleChanged"](null);
                        child["notifyStyleChangeInChildren"](null);
                    }
                }
            };
            /**
             * 已经添加一个子项
             */
            __egretProto__._childAdded = function (child) {
                if (child instanceof UIComponent) {
                    child._initialize();
                    child.checkInvalidateFlag();
                }
            };
            /**
             * GUI范围内，请不要调用任何removeChild方法，若是容器，请用removeElement
             * @deprecated
             * @method egret.gui.UIComponent#removeChild
             * @param child {DisplayObject}
             * @returns {DisplayObject}
             */
            __egretProto__.removeChild = function (child) {
                _super.prototype.removeChild.call(this, child);
                this._childRemoved(child);
                return child;
            };
            /**
             * GUI范围内，请不要调用任何removeChildAt方法，若是容器，请用removeElementAt
             * @deprecated
             * @method egret.gui.UIComponent#removeChildAt
             * @param index {number}
             * @returns {DisplayObject}
             */
            __egretProto__.removeChildAt = function (index) {
                var child = _super.prototype.removeChildAt.call(this, index);
                this._childRemoved(child);
                return child;
            };
            /**
             * 已经移除一个子项
             */
            __egretProto__._childRemoved = function (child) {
                if (!child) {
                    return;
                }
                if ("nestLevel" in child) {
                    child.nestLevel = 0;
                }
            };
            /**
             * 检查属性失效标记并应用
             */
            __egretProto__.checkInvalidateFlag = function (event) {
                if (event === void 0) { event = null; }
                if (!gui.UIGlobals._layoutManager)
                    return;
                if (this._invalidatePropertiesFlag) {
                    gui.UIGlobals._layoutManager.invalidateProperties(this);
                }
                if (this._invalidateSizeFlag) {
                    gui.UIGlobals._layoutManager.invalidateSize(this);
                }
                if (this._invalidateDisplayListFlag) {
                    gui.UIGlobals._layoutManager.invalidateDisplayList(this);
                }
                if (this._validateNowFlag) {
                    gui.UIGlobals._layoutManager.validateClient(this);
                    this._validateNowFlag = false;
                }
            };
            Object.defineProperty(__egretProto__, "enabled", {
                /**
                 * @member egret.gui.UIComponent#enabled
                 */
                get: function () {
                    return this._enabled;
                },
                set: function (value) {
                    this._enabled = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "width", {
                /**
                 * @member egret.gui.UIComponent#width
                 */
                get: function () {
                    return this._width;
                },
                /**
                 * 组件宽度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
                 */
                set: function (value) {
                    this._setWidth(value);
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__._setWidth = function (value) {
                if (this._width == value && this._explicitWidth == value)
                    return;
                _super.prototype._setWidth.call(this, value);
                if (isNaN(value))
                    this.invalidateSize();
                else
                    this._width = value;
                this.invalidateProperties();
                this.invalidateDisplayList();
                this.invalidateParentSizeAndDisplayList();
            };
            Object.defineProperty(__egretProto__, "height", {
                /**
                 * @member egret.gui.UIComponent#height
                 */
                get: function () {
                    return this._height;
                },
                /**
                 * 组件高度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
                 */
                set: function (value) {
                    this._setHeight(value);
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__._setHeight = function (value) {
                if (this._height == value && this._explicitHeight == value)
                    return;
                _super.prototype._setHeight.call(this, value);
                if (isNaN(value))
                    this.invalidateSize();
                else
                    this._height = value;
                this.invalidateProperties();
                this.invalidateDisplayList();
                this.invalidateParentSizeAndDisplayList();
            };
            Object.defineProperty(__egretProto__, "scaleX", {
                /**
                 * @member egret.gui.UIComponent#scaleX
                 */
                get: function () {
                    return this._scaleX;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    this._setScaleX(value);
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__._setScaleX = function (value) {
                if (this._scaleX == value)
                    return;
                this._scaleX = value;
                this.invalidateParentSizeAndDisplayList();
            };
            Object.defineProperty(__egretProto__, "scaleY", {
                /**
                 * @member egret.gui.UIComponent#scaleY
                 */
                get: function () {
                    return this._scaleY;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    this._setScaleY(value);
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__._setScaleY = function (value) {
                if (this._scaleY == value)
                    return;
                this._scaleY = value;
                this.invalidateParentSizeAndDisplayList();
            };
            Object.defineProperty(__egretProto__, "minWidth", {
                /**
                 * @member egret.gui.UIComponent#minWidth
                 */
                get: function () {
                    return this._minWidth;
                },
                set: function (value) {
                    if (this._minWidth == value)
                        return;
                    this._minWidth = value;
                    this.invalidateSize();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "maxWidth", {
                /**
                 * @member egret.gui.UIComponent#maxWidth
                 */
                get: function () {
                    return this._maxWidth;
                },
                set: function (value) {
                    if (this._maxWidth == value)
                        return;
                    this._maxWidth = value;
                    this.invalidateSize();
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__._getMaxWidth = function () {
                return this._maxWidth;
            };
            Object.defineProperty(__egretProto__, "minHeight", {
                /**
                 * @member egret.gui.UIComponent#minHeight
                 */
                get: function () {
                    return this._minHeight;
                },
                set: function (value) {
                    if (this._minHeight == value)
                        return;
                    this._minHeight = value;
                    this.invalidateSize();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "maxHeight", {
                /**
                 * @member egret.gui.UIComponent#maxHeight
                 */
                get: function () {
                    return this._maxHeight;
                },
                set: function (value) {
                    if (this._maxHeight == value)
                        return;
                    this._maxHeight = value;
                    this.invalidateSize();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "measuredWidth", {
                /**
                 * 组件的默认宽度（以像素为单位）。此值由 measure() 方法设置。
                 * @member egret.gui.UIComponent#measuredWidth
                 */
                get: function () {
                    return this._measuredWidth;
                },
                set: function (value) {
                    this._measuredWidth = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "measuredHeight", {
                /**
                 * 组件的默认高度（以像素为单位）。此值由 measure() 方法设置。
                 * @member egret.gui.UIComponent#measuredHeight
                 */
                get: function () {
                    return this._measuredHeight;
                },
                set: function (value) {
                    this._measuredHeight = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @method egret.gui.UIComponent#setActualSize
             * @param w {number}
             * @param h {number}
             */
            __egretProto__.setActualSize = function (w, h) {
                var change = false;
                if (this._width != w) {
                    this._width = w;
                    change = true;
                }
                if (this._height != h) {
                    this._height = h;
                    change = true;
                }
                if (change) {
                    this.invalidateDisplayList();
                    this.dispatchResizeEvent();
                }
            };
            Object.defineProperty(__egretProto__, "x", {
                /**
                 * @constant egret.gui.UIComponent#x
                 */
                get: function () {
                    return this._x;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (this._x == value)
                        return;
                    this._setX(value);
                    this.invalidateProperties();
                    if (this._includeInLayout && this.parent && this.parent instanceof UIComponent)
                        (this.parent)._childXYChanged();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "y", {
                /**
                 * @constant egret.gui.UIComponent#y
                 */
                get: function () {
                    return this._y;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (this._y == value)
                        return;
                    this._setY(value);
                    this.invalidateProperties();
                    if (this._includeInLayout && this.parent && this.parent instanceof UIComponent)
                        (this.parent)._childXYChanged();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @method egret.gui.UIComponent#invalidateProperties
             */
            __egretProto__.invalidateProperties = function () {
                if (!this._invalidatePropertiesFlag) {
                    this._invalidatePropertiesFlag = true;
                    if (this.parent && gui.UIGlobals._layoutManager)
                        gui.UIGlobals._layoutManager.invalidateProperties(this);
                }
            };
            /**
             * @method egret.gui.UIComponent#validateProperties
             */
            __egretProto__.validateProperties = function () {
                if (this._invalidatePropertiesFlag) {
                    this.commitProperties();
                    this._invalidatePropertiesFlag = false;
                }
            };
            /**
             * @method egret.gui.UIComponent#invalidateSize
             */
            __egretProto__.invalidateSize = function () {
                if (!this._invalidateSizeFlag) {
                    this._invalidateSizeFlag = true;
                    if (this.parent && gui.UIGlobals._layoutManager)
                        gui.UIGlobals._layoutManager.invalidateSize(this);
                }
            };
            /**
             * @method egret.gui.UIComponent#validateSize
             * @param recursive {boolean}
             */
            __egretProto__.validateSize = function (recursive) {
                if (recursive === void 0) { recursive = false; }
                if (recursive) {
                    for (var i = 0; i < this.numChildren; i++) {
                        var child = this.getChildAt(i);
                        if ("validateSize" in child)
                            child.validateSize(true);
                    }
                }
                if (this._invalidateSizeFlag) {
                    var changed = this.measureSizes();
                    if (changed) {
                        this.invalidateDisplayList();
                        this.invalidateParentSizeAndDisplayList();
                    }
                    this._invalidateSizeFlag = false;
                }
            };
            /**
             * 测量组件尺寸，返回尺寸是否发生变化
             */
            __egretProto__.measureSizes = function () {
                var changed = false;
                if (!this._invalidateSizeFlag)
                    return changed;
                if (!this.canSkipMeasurement()) {
                    this.measure();
                    if (this.measuredWidth < this.minWidth) {
                        this.measuredWidth = this.minWidth;
                    }
                    if (this.measuredWidth > this.maxWidth) {
                        this.measuredWidth = this.maxWidth;
                    }
                    if (this.measuredHeight < this.minHeight) {
                        this.measuredHeight = this.minHeight;
                    }
                    if (this.measuredHeight > this.maxHeight) {
                        this.measuredHeight = this.maxHeight;
                    }
                }
                if (isNaN(this._oldPreferWidth)) {
                    this._oldPreferWidth = this.preferredWidth;
                    this._oldPreferHeight = this.preferredHeight;
                    changed = true;
                }
                else {
                    if (this.preferredWidth != this._oldPreferWidth || this.preferredHeight != this._oldPreferHeight)
                        changed = true;
                    this._oldPreferWidth = this.preferredWidth;
                    this._oldPreferHeight = this.preferredHeight;
                }
                return changed;
            };
            /**
             * @method egret.gui.UIComponent#invalidateDisplayList
             */
            __egretProto__.invalidateDisplayList = function () {
                if (!this._invalidateDisplayListFlag) {
                    this._invalidateDisplayListFlag = true;
                    if (this.parent && gui.UIGlobals._layoutManager)
                        gui.UIGlobals._layoutManager.invalidateDisplayList(this);
                    this._setSizeDirty();
                }
            };
            /**
             * @method egret.gui.UIComponent#validateDisplayList
             */
            __egretProto__.validateDisplayList = function () {
                if (this._invalidateDisplayListFlag) {
                    var unscaledWidth = 0;
                    var unscaledHeight = 0;
                    if (this._layoutWidthExplicitlySet) {
                        unscaledWidth = this._width;
                    }
                    else if (!isNaN(this.explicitWidth)) {
                        unscaledWidth = this._explicitWidth;
                    }
                    else {
                        unscaledWidth = this.measuredWidth;
                    }
                    if (this._layoutHeightExplicitlySet) {
                        unscaledHeight = this._height;
                    }
                    else if (!isNaN(this.explicitHeight)) {
                        unscaledHeight = this._explicitHeight;
                    }
                    else {
                        unscaledHeight = this.measuredHeight;
                    }
                    if (isNaN(unscaledWidth))
                        unscaledWidth = 0;
                    if (isNaN(unscaledHeight))
                        unscaledHeight = 0;
                    this.setActualSize(unscaledWidth, unscaledHeight);
                    this.updateDisplayList(unscaledWidth, unscaledHeight);
                    this._invalidateDisplayListFlag = false;
                }
            };
            /**
             * @method egret.gui.UIComponent#validateNow
             * @param skipDisplayList {boolean}
             */
            __egretProto__.validateNow = function (skipDisplayList) {
                if (skipDisplayList === void 0) { skipDisplayList = false; }
                if (!this._validateNowFlag && gui.UIGlobals._layoutManager != null)
                    gui.UIGlobals._layoutManager.validateClient(this, skipDisplayList);
                else
                    this._validateNowFlag = true;
            };
            /**
             * 标记父级容器的尺寸和显示列表为失效
             * @method egret.gui.UIComponent#invalidateParentSizeAndDisplayList
             */
            __egretProto__.invalidateParentSizeAndDisplayList = function () {
                if (!this.parent || !this._includeInLayout || !("invalidateSize" in this.parent))
                    return;
                var p = (this.parent);
                p.invalidateSize();
                p.invalidateDisplayList();
            };
            /**
             * 更新显示列表
             * @method egret.gui.UIComponent#updateDisplayList
             * @param unscaledWidth {number}
             * @param unscaledHeight {number}
             */
            __egretProto__.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            };
            /**
             * 是否可以跳过测量尺寸阶段,返回true则不执行measure()方法
             */
            __egretProto__.canSkipMeasurement = function () {
                return !isNaN(this._explicitWidth) && !isNaN(this._explicitHeight);
            };
            /**
             * 提交属性，子类在调用完invalidateProperties()方法后，应覆盖此方法以应用属性
             */
            __egretProto__.commitProperties = function () {
                if (this.oldWidth != this._width || this.oldHeight != this._height) {
                    this.dispatchResizeEvent();
                }
                if (this.oldX != this.x || this.oldY != this.y) {
                    this.dispatchMoveEvent();
                }
            };
            /**
             * 测量组件尺寸
             * @method egret.gui.UIComponent#measure
             */
            __egretProto__.measure = function () {
                this._measuredHeight = 0;
                this._measuredWidth = 0;
            };
            /**
             *  抛出移动事件
             */
            __egretProto__.dispatchMoveEvent = function () {
                if (this.hasEventListener(gui.MoveEvent.MOVE)) {
                    gui.MoveEvent.dispatchMoveEvent(this, this.oldX, this.oldY);
                }
                this.oldX = this.x;
                this.oldY = this.y;
            };
            /**
             * 子项的xy位置发生改变
             */
            __egretProto__._childXYChanged = function () {
            };
            /**
             *  抛出尺寸改变事件
             */
            __egretProto__.dispatchResizeEvent = function () {
                if (this.hasEventListener(gui.ResizeEvent.RESIZE)) {
                    gui.ResizeEvent.dispatchResizeEvent(this, this.oldWidth, this.oldHeight);
                }
                this.oldWidth = this._width;
                this.oldHeight = this._height;
            };
            Object.defineProperty(__egretProto__, "includeInLayout", {
                /**
                 * @member egret.gui.UIComponent#includeInLayout
                 */
                get: function () {
                    return this._includeInLayout;
                },
                set: function (value) {
                    if (this._includeInLayout == value)
                        return;
                    this._includeInLayout = true;
                    this.invalidateParentSizeAndDisplayList();
                    this._includeInLayout = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "left", {
                /**
                 * @member egret.gui.UIComponent#left
                 */
                get: function () {
                    return this._left;
                },
                set: function (value) {
                    if (this._left == value)
                        return;
                    this._left = value;
                    this.invalidateParentSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "right", {
                /**
                 * @member egret.gui.UIComponent#right
                 */
                get: function () {
                    return this._right;
                },
                set: function (value) {
                    if (this._right == value)
                        return;
                    this._right = value;
                    this.invalidateParentSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "top", {
                /**
                 * @member egret.gui.UIComponent#top
                 */
                get: function () {
                    return this._top;
                },
                set: function (value) {
                    if (this._top == value)
                        return;
                    this._top = value;
                    this.invalidateParentSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "bottom", {
                /**
                 * @member egret.gui.UIComponent#bottom
                 */
                get: function () {
                    return this._bottom;
                },
                set: function (value) {
                    if (this._bottom == value)
                        return;
                    this._bottom = value;
                    this.invalidateParentSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "horizontalCenter", {
                /**
                 * @member egret.gui.UIComponent#horizontalCenter
                 */
                get: function () {
                    return this._horizontalCenter;
                },
                set: function (value) {
                    if (this._horizontalCenter == value)
                        return;
                    this._horizontalCenter = value;
                    this.invalidateParentSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "verticalCenter", {
                /**
                 * @member egret.gui.UIComponent#verticalCenter
                 */
                get: function () {
                    return this._verticalCenter;
                },
                set: function (value) {
                    if (this._verticalCenter == value)
                        return;
                    this._verticalCenter = value;
                    this.invalidateParentSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "percentWidth", {
                /**
                 * @member egret.gui.UIComponent#percentWidth
                 */
                get: function () {
                    return this._percentWidth;
                },
                set: function (value) {
                    if (this._percentWidth == value)
                        return;
                    this._percentWidth = value;
                    this.invalidateParentSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "percentHeight", {
                /**
                 * @member egret.gui.UIComponent#percentHeight
                 */
                get: function () {
                    return this._percentHeight;
                },
                set: function (value) {
                    if (this._percentHeight == value)
                        return;
                    this._percentHeight = value;
                    this.invalidateParentSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @method egret.gui.UIComponent#setLayoutBoundsSize
             * @param layoutWidth {number}
             * @param layoutHeight {number}
             */
            __egretProto__.setLayoutBoundsSize = function (layoutWidth, layoutHeight) {
                if (isNaN(layoutWidth)) {
                    this._layoutWidthExplicitlySet = false;
                    layoutWidth = this.preferredWidth;
                }
                else {
                    this._layoutWidthExplicitlySet = true;
                }
                if (isNaN(layoutHeight)) {
                    this._layoutHeightExplicitlySet = false;
                    layoutHeight = this.preferredHeight;
                }
                else {
                    this._layoutHeightExplicitlySet = true;
                }
                this.setActualSize(layoutWidth / this._scaleX, layoutHeight / this._scaleY);
            };
            /**
             * @method egret.gui.UIComponent#setLayoutBoundsPosition
             * @param x {number}
             * @param y {number}
             */
            __egretProto__.setLayoutBoundsPosition = function (x, y) {
                if (this._scaleX < 0) {
                    x += this.layoutBoundsWidth;
                }
                if (this._scaleY < 0) {
                    y += this.layoutBoundsHeight;
                }
                var changed = false;
                if (this._x != x) {
                    this._setX(x);
                    changed = true;
                }
                if (this._y != y) {
                    this._setY(y);
                    changed = true;
                }
                if (changed) {
                    this.dispatchMoveEvent();
                }
            };
            Object.defineProperty(__egretProto__, "preferredWidth", {
                /**
                 * @member egret.gui.UIComponent#preferredWidth
                 */
                get: function () {
                    var w = this._hasWidthSet ? this._explicitWidth : this._measuredWidth;
                    var scaleX = this._scaleX;
                    if (scaleX < 0) {
                        scaleX = -scaleX;
                    }
                    return w * scaleX;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "preferredHeight", {
                /**
                 * @member egret.gui.UIComponent#preferredHeight
                 */
                get: function () {
                    var h = this._hasHeightSet ? this._explicitHeight : this._measuredHeight;
                    var scaleY = this._scaleY;
                    if (scaleY < 0) {
                        scaleY = -scaleY;
                    }
                    return h * scaleY;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "preferredX", {
                /**
                 * @member egret.gui.UIComponent#preferredX
                 */
                get: function () {
                    if (this._scaleX >= 0) {
                        return this._x;
                    }
                    var w = this.preferredWidth;
                    return this._x - w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "preferredY", {
                /**
                 * @member egret.gui.UIComponent#preferredY
                 */
                get: function () {
                    if (this._scaleY >= 0) {
                        return this._y;
                    }
                    var h = this.preferredHeight;
                    return this._y - h;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "layoutBoundsX", {
                /**
                 * @member egret.gui.UIComponent#layoutBoundsX
                 */
                get: function () {
                    if (this._scaleX >= 0) {
                        return this._x;
                    }
                    var w = this.layoutBoundsWidth;
                    return this._x - w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "layoutBoundsY", {
                /**
                 * @member egret.gui.UIComponent#layoutBoundsY
                 */
                get: function () {
                    if (this._scaleY >= 0) {
                        return this._y;
                    }
                    var h = this.layoutBoundsHeight;
                    return this._y - h;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "layoutBoundsWidth", {
                /**
                 * @member egret.gui.UIComponent#layoutBoundsWidth
                 */
                get: function () {
                    var w = 0;
                    if (this._layoutWidthExplicitlySet) {
                        w = this._width;
                    }
                    else if (this._hasWidthSet) {
                        w = this._explicitWidth;
                    }
                    else {
                        w = this._measuredWidth;
                    }
                    var scaleX = this._scaleX;
                    if (scaleX < 0) {
                        scaleX = -scaleX;
                    }
                    return w * scaleX;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "layoutBoundsHeight", {
                /**
                 * 组件的布局高度,常用于父级的updateDisplayList()方法中
                 * 按照：布局高度>外部显式设置高度>测量高度 的优先级顺序返回高度
                 * @member egret.gui.UIComponent#layoutBoundsHeight
                 */
                get: function () {
                    var h = 0;
                    if (this._layoutHeightExplicitlySet) {
                        h = this._height;
                    }
                    else if (this._hasHeightSet) {
                        h = this._explicitHeight;
                    }
                    else {
                        h = this._measuredHeight;
                    }
                    var scaleY = this.scaleY;
                    if (scaleY < 0) {
                        scaleY = -scaleY;
                    }
                    return h * scaleY;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * __proto__属性是否可以设置的标志，兼容IE9，IE10。
             */
            UIComponent.prototypeCanSet = undefined;
            UIComponent.emptyStyleChain = {};
            return UIComponent;
        })(egret.DisplayObjectContainer);
        gui.UIComponent = UIComponent;
        UIComponent.prototype.__class__ = "egret.gui.UIComponent";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
