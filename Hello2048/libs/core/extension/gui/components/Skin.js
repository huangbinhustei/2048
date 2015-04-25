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
         * @class egret.gui.Skin
         * @classdesc
         * 含有视图状态功能的皮肤基类。
         * @extends egret.EventDispatcher
         * @implements egret.gui.IStateClient
         * @implements egret.gui.ISkin
         * @implements egret.gui.IContainer
         */
        var Skin = (function (_super) {
            __extends(Skin, _super);
            /**
             * 构造函数
             * @method egret.gui.Skin#constructor
             */
            function Skin() {
                _super.call(this);
                /**
                 * 组件的最大测量宽度,仅影响measuredWidth属性的取值范围。
                 * @member egret.gui.Skin#maxWidth
                 */
                this.maxWidth = 10000;
                /**
                 * 组件的最小测量宽度,此属性设置为大于maxWidth的值时无效。仅影响measuredWidth属性的取值范围。
                 * @member egret.gui.Skin#minWidth
                 */
                this.minWidth = 0;
                /**
                 * 组件的最大测量高度,仅影响measuredHeight属性的取值范围。
                 * @member egret.gui.Skin#maxHeight
                 */
                this.maxHeight = 10000;
                /**
                 * 组件的最小测量高度,此属性设置为大于maxHeight的值时无效。仅影响measuredHeight属性的取值范围。
                 * @member egret.gui.Skin#minHeight
                 */
                this.minHeight = 0;
                this._hasWidthSet = false;
                this._width = NaN;
                this._hasHeightSet = false;
                this._height = NaN;
                /**
                 * 组件的默认宽度（以像素为单位）。此值由 measure() 方法设置。
                 * @member egret.gui.Skin#measuredWidth
                 */
                this.measuredWidth = 0;
                /**
                 * 组件的默认高度（以像素为单位）。此值由 measure() 方法设置。
                 * @member egret.gui.Skin#measuredHeight
                 */
                this.measuredHeight = 0;
                this._initialized = false;
                this._hostComponent = null;
                this._elementsContent = [];
                this.skinLayout = null;
                //========================state相关函数===============start=========================
                this._states = [];
                /**
                 * 播放过渡效果的标志
                 */
                this.playStateTransition = true;
                /**
                 * 当前视图状态发生改变的标志
                 */
                this.currentStateChanged = false;
                this._currentState = null;
                /**
                 * 存储还未验证的视图状态
                 */
                this.requestedCurrentState = null;
                this.initialized = false;
                this.skinLayout = new gui.SkinBasicLayout();
                this.skinLayout.target = this;
            }
            var __egretProto__ = Skin.prototype;
            Object.defineProperty(__egretProto__, "width", {
                /**
                 * 组件宽度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
                 * @member egret.gui.Skin#width
                 */
                get: function () {
                    return this._width;
                },
                set: function (value) {
                    if (this._width == value)
                        return;
                    this._width = value;
                    this._hasWidthSet = egret.NumberUtils.isNumber(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "height", {
                /**
                 * 组件高度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
                 * @member egret.gui.Skin#height
                 */
                get: function () {
                    return this._height;
                },
                set: function (value) {
                    if (this._height == value)
                        return;
                    this._height = value;
                    this._hasHeightSet = egret.NumberUtils.isNumber(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "preferredWidth", {
                get: function () {
                    return this._hasWidthSet ? this._width : this.measuredWidth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "preferredHeight", {
                get: function () {
                    return this._hasHeightSet ? this._height : this.measuredHeight;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 创建子项,子类覆盖此方法以完成组件子项的初始化操作，
             * 请务必调用super.createChildren()以完成父类组件的初始化
             * @method egret.gui.Skin#createChildren
             */
            __egretProto__.createChildren = function () {
            };
            Object.defineProperty(__egretProto__, "hostComponent", {
                /**
                 * @member egret.gui.Skin#hostComponent
                 */
                get: function () {
                    return this._hostComponent;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    this._setHostComponent(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             *
             * @param value
             * @private
             */
            __egretProto__._setHostComponent = function (value) {
                if (this._hostComponent == value)
                    return;
                var i;
                if (this._hostComponent) {
                    for (i = this._elementsContent.length - 1; i >= 0; i--) {
                        this._elementRemoved(this._elementsContent[i], i);
                    }
                }
                this._hostComponent = value;
                if (!this._initialized) {
                    this._initialized = true;
                    this.createChildren();
                }
                if (this._hostComponent) {
                    var n = this._elementsContent.length;
                    for (i = 0; i < n; i++) {
                        this._elementAdded(this._elementsContent[i], i);
                    }
                    this.initializeStates();
                    if (this.currentStateChanged) {
                        this.commitCurrentState();
                    }
                }
            };
            /**
             * 返回子元素列表
             */
            __egretProto__._getElementsContent = function () {
                return this._elementsContent;
            };
            Object.defineProperty(__egretProto__, "elementsContent", {
                /**
                 * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。
                 * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
                 */
                set: function (value) {
                    if (value == null)
                        value = [];
                    if (value == this._elementsContent)
                        return;
                    if (this._hostComponent) {
                        var i;
                        for (i = this._elementsContent.length - 1; i >= 0; i--) {
                            this._elementRemoved(this._elementsContent[i], i);
                        }
                        this._elementsContent = value.concat();
                        var n = this._elementsContent.length;
                        for (i = 0; i < n; i++) {
                            var elt = this._elementsContent[i];
                            if (elt.parent && "removeElement" in elt.parent)
                                (elt.parent).removeElement(elt);
                            else if (elt.owner && "removeElement" in elt.owner)
                                (elt.owner).removeElement(elt);
                            this._elementAdded(elt, i);
                        }
                    }
                    else {
                        this._elementsContent = value.concat();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "numElements", {
                /**
                 * @member egret.gui.Skin#numElements
                 */
                get: function () {
                    return this._elementsContent.length;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 如果存在视域，且传入的索引为 0，则返回该视域
             * @method egret.gui.Skin#getElementAt
             * @param index {number}
             * @returns {IVisualElement}
             */
            __egretProto__.getElementAt = function (index) {
                this.checkForRangeError(index);
                return this._elementsContent[index];
            };
            __egretProto__.checkForRangeError = function (index, addingElement) {
                if (addingElement === void 0) { addingElement = false; }
                var maxIndex = this._elementsContent.length - 1;
                if (addingElement)
                    maxIndex++;
                if (index < 0 || index > maxIndex)
                    throw new RangeError(egret.getString(3011, index));
            };
            /**
             * 将可视元素添加到此容器中
             * @method egret.gui.Skin#addElement
             * @param element {IVisualElement}
             * @returns {IVisualElement}
             */
            __egretProto__.addElement = function (element) {
                var index = this.numElements;
                if (element.owner == this)
                    index = this.numElements - 1;
                return this.addElementAt(element, index);
            };
            /**
             * 将可视元素添加到此容器中
             * @method egret.gui.Skin#addElementAt
             * @param element {IVisualElement}
             * @param index {number}
             * @returns {IVisualElement}
             */
            __egretProto__.addElementAt = function (element, index) {
                this.checkForRangeError(index, true);
                var host = element.owner;
                if (host == this) {
                    this.setElementIndex(element, index);
                    return element;
                }
                else if (host && "removeElement" in host) {
                    host.removeElement(element);
                }
                this._elementsContent.splice(index, 0, element);
                if (this._hostComponent)
                    this._elementAdded(element, index);
                else
                    element.ownerChanged(this);
                return element;
            };
            /**
             * 从此容器的子列表中删除指定的可视元素
             * @method egret.gui.Skin#removeElement
             * @param element {IVisualElement}
             * @returns {IVisualElement}
             */
            __egretProto__.removeElement = function (element) {
                return this.removeElementAt(this.getElementIndex(element));
            };
            /**
             * 从容器中的指定索引位置删除可视元素
             * @method egret.gui.Skin#removeElementAt
             * @param index {number}
             * @returns {IVisualElement}
             */
            __egretProto__.removeElementAt = function (index) {
                this.checkForRangeError(index);
                var element = this._elementsContent[index];
                if (this._hostComponent)
                    this._elementRemoved(element, index);
                else
                    element.ownerChanged(null);
                this._elementsContent.splice(index, 1);
                return element;
            };
            /**
             * 返回可视元素的索引位置
             * @method egret.gui.Skin#getElementIndex
             * @param element {IVisualElement}
             * @returns {number}
             */
            __egretProto__.getElementIndex = function (element) {
                return this._elementsContent.indexOf(element);
            };
            /**
             * 按照索引添加到容器
             * @method egret.gui.Skin#setElementIndex
             * @param element {IVisualElement}
             * @param index {number}
             */
            __egretProto__.setElementIndex = function (element, index) {
                this.checkForRangeError(index);
                var oldIndex = this.getElementIndex(element);
                if (oldIndex == -1 || oldIndex == index)
                    return;
                if (this._hostComponent)
                    this._elementRemoved(element, oldIndex, false);
                this._elementsContent.splice(oldIndex, 1);
                this._elementsContent.splice(index, 0, element);
                if (this._hostComponent)
                    this._elementAdded(element, index, false);
            };
            /**
             * 添加一个显示元素到容器
             * @param element {IVisualElement}
             * @param index {number}
             * @param notifyListeners {boolean}
             */
            __egretProto__._elementAdded = function (element, index, notifyListeners) {
                if (notifyListeners === void 0) { notifyListeners = true; }
                element.ownerChanged(this);
                if (element instanceof egret.DisplayObject) {
                    var childDO = element;
                    this._hostComponent._addToDisplayListAt(childDO, index, notifyListeners);
                }
                if (notifyListeners) {
                    if (this.hasEventListener(gui.ElementExistenceEvent.ELEMENT_ADD))
                        gui.ElementExistenceEvent.dispatchElementExistenceEvent(this, gui.ElementExistenceEvent.ELEMENT_ADD, element, index);
                }
                this._hostComponent.invalidateSize();
                this._hostComponent.invalidateDisplayList();
            };
            /**
             * 从容器移除一个显示元素
             * @param element {IVisualElement}
             * @param index {number}
             * @param notifyListeners {boolean}
             */
            __egretProto__._elementRemoved = function (element, index, notifyListeners) {
                if (notifyListeners === void 0) { notifyListeners = true; }
                if (notifyListeners) {
                    if (this.hasEventListener(gui.ElementExistenceEvent.ELEMENT_REMOVE))
                        gui.ElementExistenceEvent.dispatchElementExistenceEvent(this, gui.ElementExistenceEvent.ELEMENT_REMOVE, element, index);
                }
                if (element instanceof egret.DisplayObject && element.parent == this._hostComponent) {
                    var childDO = element;
                    this._hostComponent._removeFromDisplayList(childDO, notifyListeners);
                }
                element.ownerChanged(null);
                this._hostComponent.invalidateSize();
                this._hostComponent.invalidateDisplayList();
            };
            /**
             * 测量组件尺寸
             * @method egret.gui.Skin#measure
             */
            __egretProto__.measure = function () {
                this.skinLayout.measure();
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
            };
            /**
             * 更新显示列表
             * @method egret.gui.Skin#updateDisplayList
             * @param unscaledWidth {number}
             * @param unscaledHeight {number}
             */
            __egretProto__.updateDisplayList = function (unscaledWidth, unscaledHeight) {
                this.skinLayout.updateDisplayList(unscaledWidth, unscaledHeight);
            };
            Object.defineProperty(__egretProto__, "states", {
                /**
                 * 为此组件定义的视图状态。
                 * @member egret.StateClientHelper#states
                 */
                get: function () {
                    return this._states;
                },
                set: function (value) {
                    this._setStates(value);
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__._setStates = function (value) {
                if (!value)
                    value = [];
                if (typeof (value[0]) == "string") {
                    var length = value.length;
                    for (var i = 0; i < length; i++) {
                        var state = new gui.State(value[i], []);
                        value[i] = state;
                    }
                }
                this._states = value;
                this.currentStateChanged = true;
                this.requestedCurrentState = this._currentState;
                if (!this.hasState(this.requestedCurrentState)) {
                    this.requestedCurrentState = this.getDefaultState();
                }
            };
            Object.defineProperty(__egretProto__, "transitions", {
                /**
                 *  一个 Transition 对象 Array，其中的每个 Transition 对象都定义一组效果，
                 * 用于在视图状态发生更改时播放。
                 */
                get: function () {
                    return this._transitions;
                },
                set: function (value) {
                    this._transitions = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "currentState", {
                /**
                 * 组件的当前视图状态。将其设置为 "" 或 null 可将组件重置回其基本状态。
                 * @member egret.StateClientHelper#currentState
                 */
                get: function () {
                    if (this.currentStateChanged)
                        return this.requestedCurrentState;
                    return this._currentState ? this._currentState : this.getDefaultState();
                },
                set: function (value) {
                    if (!value)
                        value = this.getDefaultState();
                    if (value != this.currentState && value && this.currentState) {
                        this.requestedCurrentState = value;
                        this.currentStateChanged = true;
                        if (this._hostComponent) {
                            this.commitCurrentState();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 返回是否含有指定名称的视图状态
             * @method egret.gui.Skin#hasState
             * @param stateName {string}
             * @returns {boolean}
             */
            __egretProto__.hasState = function (stateName) {
                return (this.getState(stateName) != null);
            };
            /**
             * 返回默认状态
             */
            __egretProto__.getDefaultState = function () {
                if (this._states.length > 0) {
                    return this._states[0].name;
                }
                return null;
            };
            /**
             * 应用当前的视图状态。子类覆盖此方法在视图状态发生改变时执行相应更新操作。
             * @method egret.gui.Skin#commitCurrentState
             */
            __egretProto__.commitCurrentState = function () {
                if (!this.currentStateChanged)
                    return;
                this.currentStateChanged = false;
                var destination = this.getState(this.requestedCurrentState);
                if (!destination) {
                    this.requestedCurrentState = this.getDefaultState();
                }
                var nextTransition;
                if (this.playStateTransition) {
                    nextTransition = this.getTransition(this._currentState, this.requestedCurrentState);
                }
                var prevTransitionFraction;
                var prevTransitionEffect;
                if (this._currentTransition) {
                    this._currentTransition.effect.removeEventListener(gui.EffectEvent.EFFECT_END, this.transition_effectEndHandler, this);
                    if (nextTransition && this._currentTransition.interruptionBehavior == gui.InterruptionBehavior.STOP) {
                        prevTransitionEffect = this._currentTransition.effect;
                        prevTransitionEffect.stop();
                    }
                    else {
                        if (this._currentTransition.autoReverse && this.transitionFromState == this.requestedCurrentState && this.transitionToState == this._currentState) {
                            if (this._currentTransition.effect.duration == 0)
                                prevTransitionFraction = 0;
                            else
                                prevTransitionFraction = this._currentTransition.effect.playheadTime / this.getTotalDuration(this._currentTransition.effect);
                        }
                        this._currentTransition.effect.end();
                    }
                    this._currentTransition = null;
                }
                var oldState = this._currentState ? this._currentState : "";
                if (this.hasEventListener(gui.StateChangeEvent.CURRENT_STATE_CHANGING)) {
                    gui.StateChangeEvent.dispatchStateChangeEvent(this, gui.StateChangeEvent.CURRENT_STATE_CHANGING, oldState, this.requestedCurrentState ? this.requestedCurrentState : "");
                }
                this.removeState(this._currentState);
                this._currentState = this.requestedCurrentState;
                if (this._currentState) {
                    this.applyState(this._currentState);
                }
                if (this.hasEventListener(gui.StateChangeEvent.CURRENT_STATE_CHANGE)) {
                    gui.StateChangeEvent.dispatchStateChangeEvent(this, gui.StateChangeEvent.CURRENT_STATE_CHANGE, oldState, this._currentState ? this._currentState : "");
                }
                if (nextTransition) {
                    var reverseTransition = nextTransition && nextTransition.autoReverse && (nextTransition.toState == oldState || nextTransition.fromState == this._currentState);
                    gui.UIGlobals._layoutManager.validateNow();
                    this._currentTransition = nextTransition;
                    this.transitionFromState = oldState;
                    this.transitionToState = this._currentState;
                    nextTransition.effect.addEventListener(gui.EffectEvent.EFFECT_END, this.transition_effectEndHandler, this);
                    nextTransition.effect.play(null, reverseTransition);
                    if (!isNaN(prevTransitionFraction) && nextTransition.effect.duration != 0) {
                        nextTransition.effect.playheadTime = (1 - prevTransitionFraction) * this.getTotalDuration(nextTransition.effect);
                    }
                }
                else {
                    if (this.hasEventListener(gui.StateChangeEvent.STATE_CHANGE_COMPLETE)) {
                        gui.StateChangeEvent.dispatchStateChangeEvent(this, gui.StateChangeEvent.CURRENT_STATE_CHANGE);
                    }
                }
            };
            __egretProto__.transition_effectEndHandler = function (event) {
                this._currentTransition = null;
                if (this.hasEventListener(gui.StateChangeEvent.STATE_CHANGE_COMPLETE)) {
                    gui.StateChangeEvent.dispatchStateChangeEvent(this, gui.StateChangeEvent.CURRENT_STATE_CHANGE);
                }
            };
            /**
             * 通过名称返回视图状态
             */
            __egretProto__.getState = function (stateName) {
                if (!stateName)
                    return null;
                var states = this._states;
                var length = states.length;
                for (var i = 0; i < length; i++) {
                    var state = states[i];
                    if (state.name == stateName)
                        return state;
                }
                return null;
            };
            /**
             * 移除指定的视图状态以及所依赖的所有父级状态，除了与新状态的共同状态外
             */
            __egretProto__.removeState = function (stateName) {
                var state = this.getState(stateName);
                if (state) {
                    var overrides = state.overrides;
                    for (var i = overrides.length - 1; i >= 0; i--)
                        overrides[i].remove(this);
                }
            };
            /**
             * 应用新状态
             */
            __egretProto__.applyState = function (stateName) {
                var state = this.getState(stateName);
                if (state) {
                    var overrides = state.overrides;
                    var length = overrides.length;
                    for (var i = 0; i < length; i++)
                        overrides[i].apply((this));
                }
            };
            /**
             * 初始化所有视图状态
             * @method egret.StateClientHelper#initializeStates
             */
            __egretProto__.initializeStates = function () {
                if (this.initialized)
                    return;
                this.initialized = true;
                var states = this._states;
                var length = states.length;
                for (var i = 0; i < length; i++) {
                    var state = (states[i]);
                    state.initialize(this);
                }
            };
            /**
             *  获取两个状态之间的过渡
             */
            __egretProto__.getTransition = function (oldState, newState) {
                var result = null;
                var priority = 0;
                if (!this.transitions)
                    return null;
                if (!oldState)
                    oldState = "";
                if (!newState)
                    newState = "";
                for (var i = 0; i < this.transitions.length; i++) {
                    var t = this.transitions[i];
                    if (t.fromState == "*" && t.toState == "*" && priority < 1) {
                        result = t;
                        priority = 1;
                    }
                    else if (t.toState == oldState && t.fromState == "*" && t.autoReverse && priority < 2) {
                        result = t;
                        priority = 2;
                    }
                    else if (t.toState == "*" && t.fromState == newState && t.autoReverse && priority < 3) {
                        result = t;
                        priority = 3;
                    }
                    else if (t.toState == oldState && t.fromState == newState && t.autoReverse && priority < 4) {
                        result = t;
                        priority = 4;
                    }
                    else if (t.fromState == oldState && t.toState == "*" && priority < 5) {
                        result = t;
                        priority = 5;
                    }
                    else if (t.fromState == "*" && t.toState == newState && priority < 6) {
                        result = t;
                        priority = 6;
                    }
                    else if (t.fromState == oldState && t.toState == newState && priority < 7) {
                        result = t;
                        priority = 7;
                        break;
                    }
                }
                if (result && !result.effect)
                    result = null;
                return result;
            };
            /**
             * 效果的总持续时间
             */
            __egretProto__.getTotalDuration = function (effect) {
                var duration = 0;
                var effectObj = effect;
                if (effect instanceof gui.CompositeEffect) {
                    duration = effectObj.compositeDuration;
                }
                else {
                    duration = effect.duration;
                }
                var repeatDelay = ("repeatDelay" in effect) ? effectObj.repeatDelay : 0;
                var repeatCount = ("repeatCount" in effect) ? effectObj.repeatCount : 0;
                var startDelay = ("startDelay" in effect) ? effectObj.startDelay : 0;
                duration = duration * repeatCount + (repeatDelay * (repeatCount - 1)) + startDelay;
                return duration;
            };
            return Skin;
        })(egret.EventDispatcher);
        gui.Skin = Skin;
        Skin.prototype.__class__ = "egret.gui.Skin";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
