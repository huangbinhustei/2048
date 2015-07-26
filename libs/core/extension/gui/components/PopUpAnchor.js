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
         * @class egret.gui.PopUpAnchor
         * @classdesc
         * PopUpAnchor组件用于定位布局中的弹出控件或下拉控件
         * @extends egret.gui.UIComponent
         */
        var PopUpAnchor = (function (_super) {
            __extends(PopUpAnchor, _super);
            /**
             * 构造函数
             * @method egret.gui.PopUpAnchor#constructor
             */
            function PopUpAnchor() {
                _super.call(this);
                /**
                 * popUp已经弹出的标志
                 */
                this.popUpIsDisplayed = false;
                /**
                 * 自身已经添加到舞台标志
                 */
                this.addedToStage = false;
                this._popUpHeightMatchesAnchorHeight = false;
                this._popUpWidthMatchesAnchorWidth = false;
                this._displayPopUp = false;
                this._popUp = null;
                this._relativeToStage = false;
                this._popUpPosition = gui.PopUpPosition.TOP_LEFT;
                /**
                 * 正在播放动画的标志
                 */
                this.inAnimation = false;
                /**
                 * 动画类实例
                 */
                this.animator = null;
                this._openDuration = 250;
                this._closeDuration = 150;
                this.valueRange = 1;
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
            }
            var __egretProto__ = PopUpAnchor.prototype;
            Object.defineProperty(__egretProto__, "popUpHeightMatchesAnchorHeight", {
                /**
                 * 如果为 true，则将popUp控件的高度设置为 PopUpAnchor的高度值。
                 * @member egret.gui.PopUpAnchor#popUpHeightMatchesAnchorHeight
                 */
                get: function () {
                    return this._popUpHeightMatchesAnchorHeight;
                },
                set: function (value) {
                    if (this._popUpHeightMatchesAnchorHeight == value)
                        return;
                    this._popUpHeightMatchesAnchorHeight = value;
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "popUpWidthMatchesAnchorWidth", {
                /**
                 * 如果为true，则将popUp控件的宽度设置为PopUpAnchor的宽度值。
                 * @member egret.gui.PopUpAnchor#popUpWidthMatchesAnchorWidth
                 */
                get: function () {
                    return this._popUpWidthMatchesAnchorWidth;
                },
                set: function (value) {
                    if (this._popUpWidthMatchesAnchorWidth == value)
                        return;
                    this._popUpWidthMatchesAnchorWidth = value;
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "displayPopUp", {
                /**
                 * 如果为 true，则将popUp对象弹出。若为false，关闭弹出的popUp。
                 * @member egret.gui.PopUpAnchor#displayPopUp
                 */
                get: function () {
                    return this._displayPopUp;
                },
                set: function (value) {
                    if (this._displayPopUp == value)
                        return;
                    this._displayPopUp = value;
                    this.addOrRemovePopUp();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "popUp", {
                /**
                 * 要弹出或移除的目标显示对象。
                 * @member egret.gui.PopUpAnchor#popUp
                 */
                get: function () {
                    return this._popUp;
                },
                set: function (value) {
                    if (this._popUp == value)
                        return;
                    this._popUp = value;
                    this.dispatchEventWith("popUpChanged");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "popUpPosition", {
                /**
                 * popUp相对于PopUpAnchor的弹出位置。请使用PopUpPosition里定义的常量。默认值TOP_LEFT。
                 * @member egret.gui.PopUpAnchor#popUpPosition
                 */
                get: function () {
                    return this._popUpPosition;
                },
                set: function (value) {
                    if (this._popUpPosition == value)
                        return;
                    this._relativeToStage = value == gui.PopUpPosition.SCREEN_CENTER;
                    this._popUpPosition = value;
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @method egret.gui.PopUpAnchor#updateDisplayList
             * @param unscaledWidth {number}
             * @param unscaledHeight {number}
             */
            __egretProto__.updateDisplayList = function (unscaledWidth, unscaledHeight) {
                _super.prototype.updateDisplayList.call(this, unscaledWidth, unscaledHeight);
                this.applyPopUpTransform(unscaledWidth, unscaledHeight);
            };
            /**
             * 手动刷新popUp的弹出位置和尺寸。
             * @method egret.gui.PopUpAnchor#updatePopUpTransform
             */
            __egretProto__.updatePopUpTransform = function () {
                this.applyPopUpTransform(this.width, this.height);
            };
            /**
             * 计算popUp的弹出位置
             */
            __egretProto__.calculatePopUpPosition = function () {
                var registrationPoint = egret.Point.identity;
                switch (this._popUpPosition) {
                    case gui.PopUpPosition.SCREEN_CENTER:
                        break;
                    case gui.PopUpPosition.BELOW:
                        registrationPoint.x = 0;
                        registrationPoint.y = this.height;
                        break;
                    case gui.PopUpPosition.ABOVE:
                        registrationPoint.x = 0;
                        registrationPoint.y = -this.popUp.layoutBoundsHeight;
                        break;
                    case gui.PopUpPosition.LEFT:
                        registrationPoint.x = -this.popUp.layoutBoundsWidth;
                        registrationPoint.y = 0;
                        break;
                    case gui.PopUpPosition.RIGHT:
                        registrationPoint.x = this.width;
                        registrationPoint.y = 0;
                        break;
                    case gui.PopUpPosition.CENTER:
                        registrationPoint.x = (this.width - this.popUp.layoutBoundsWidth) * 0.5;
                        registrationPoint.y = (this.height - this.popUp.layoutBoundsHeight) * 0.5;
                        break;
                    case gui.PopUpPosition.TOP_LEFT:
                        break;
                }
                registrationPoint = this.localToGlobal(registrationPoint.x, registrationPoint.y, registrationPoint);
                registrationPoint = this.popUp.parent.globalToLocal(registrationPoint.x, registrationPoint.y, registrationPoint);
                return registrationPoint;
            };
            Object.defineProperty(__egretProto__, "openDuration", {
                /**
                 * 窗口弹出的动画时间(以毫秒为单位)，设置为0则直接弹出窗口而不播放动画效果。默认值250。
                 * @member egret.gui.PopUpAnchor#openDuration
                 */
                get: function () {
                    return this._openDuration;
                },
                set: function (value) {
                    this._openDuration = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "closeDuration", {
                /**
                 * 窗口关闭的动画时间(以毫秒为单位)，设置为0则直接关闭窗口而不播放动画效果。默认值150。
                 * @member egret.gui.PopUpAnchor#closeDuration
                 */
                get: function () {
                    return this._closeDuration;
                },
                set: function (value) {
                    this._closeDuration = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 动画开始播放触发的函数
             */
            __egretProto__.animationStartHandler = function (animation) {
                this.inAnimation = true;
                if (this.popUp && "enabled" in this.popUp)
                    (this.popUp).enabled = false;
            };
            /**
             * 动画播放过程中触发的更新数值函数
             */
            __egretProto__.animationUpdateHandler = function (animation) {
                var rect = (this.popUp)._DO_Props_._scrollRect;
                var x = Math.round(animation.currentValue["x"]);
                var y = Math.round(animation.currentValue["y"]);
                if (rect) {
                    rect.x = x;
                    rect.y = y;
                    rect.width = this.popUp.width;
                    rect.height = this.popUp.height;
                    (this.popUp)._setScrollRect(rect);
                }
                else {
                    (this.popUp)._DO_Props_._scrollRect = new egret.Rectangle(x, y, this.popUp.width, this.popUp.height);
                }
            };
            /**
             * 动画播放完成触发的函数
             */
            __egretProto__.animationEndHandler = function (animation) {
                this.inAnimation = false;
                if (this.popUp && "enabled" in this.popUp)
                    (this.popUp).enabled = true;
                (this.popUp).scrollRect = null;
                if (!this.popUpIsDisplayed) {
                    gui.PopUpManager.removePopUp(this.popUp);
                    this.popUp.ownerChanged(null);
                }
            };
            /**
             * 添加或移除popUp
             */
            __egretProto__.addOrRemovePopUp = function () {
                if (!this.addedToStage || !this.popUp)
                    return;
                if (this.popUp.parent == null && this.displayPopUp) {
                    gui.PopUpManager.addPopUp(this.popUp, this._relativeToStage, this._relativeToStage);
                    this.popUp.ownerChanged(this);
                    this.popUpIsDisplayed = true;
                    if (this.inAnimation)
                        this.animator.end();
                    if (this.initialized) {
                        this.applyPopUpTransform(this.width, this.height);
                        if (this._openDuration > 0)
                            this.startAnimation();
                    }
                    else {
                        egret.callLater(function () {
                            if (this.openDuration > 0)
                                this.startAnimation();
                        }, this);
                    }
                }
                else if (this.popUp.parent != null && !this.displayPopUp) {
                    this.removeAndResetPopUp();
                }
            };
            /**
             * 移除并重置popUp
             */
            __egretProto__.removeAndResetPopUp = function () {
                if (this.inAnimation)
                    this.animator.end();
                this.popUpIsDisplayed = false;
                if (this._closeDuration > 0) {
                    this.startAnimation();
                }
                else {
                    gui.PopUpManager.removePopUp(this.popUp);
                    this.popUp.ownerChanged(null);
                }
            };
            /**
             * 对popUp应用尺寸和位置调整
             */
            __egretProto__.applyPopUpTransform = function (unscaledWidth, unscaledHeight) {
                if (!this.popUpIsDisplayed)
                    return;
                if (this.popUpWidthMatchesAnchorWidth)
                    this.popUp.width = unscaledWidth;
                if (this.popUpHeightMatchesAnchorHeight)
                    this.popUp.height = unscaledHeight;
                if ("validateNow" in this.popUp)
                    (this.popUp).validateNow();
                var popUpPoint = this.calculatePopUpPosition();
                this.popUp.x = popUpPoint.x;
                this.popUp.y = popUpPoint.y;
            };
            /**
             * 开始播放动画
             */
            __egretProto__.startAnimation = function () {
                if (!this.animator) {
                    this.animator = new gui.Animation(this.animationUpdateHandler, this);
                    this.animator.endFunction = this.animationEndHandler;
                    this.animator.startFunction = this.animationStartHandler;
                }
                this.animator.motionPaths = this.createMotionPath();
                if (this.popUpIsDisplayed) {
                    this.animator.duration = this._openDuration;
                }
                else {
                    this.animator.duration = this._closeDuration;
                }
                this.animator.play();
            };
            /**
             * 创建动画轨迹
             */
            __egretProto__.createMotionPath = function () {
                var xPath = new gui.SimpleMotionPath("x");
                var yPath = new gui.SimpleMotionPath("y");
                var path = [xPath, yPath];
                switch (this._popUpPosition) {
                    case gui.PopUpPosition.TOP_LEFT:
                    case gui.PopUpPosition.CENTER:
                    case gui.PopUpPosition.BELOW:
                        xPath.valueFrom = xPath.valueTo = 0;
                        yPath.valueFrom = this.popUp.height;
                        yPath.valueTo = 0;
                        this.valueRange = this.popUp.height;
                        break;
                    case gui.PopUpPosition.ABOVE:
                        xPath.valueFrom = xPath.valueTo = 0;
                        yPath.valueFrom = -this.popUp.height;
                        yPath.valueTo = 0;
                        this.valueRange = this.popUp.height;
                        break;
                    case gui.PopUpPosition.LEFT:
                        yPath.valueFrom = yPath.valueTo = 0;
                        xPath.valueFrom = -this.popUp.width;
                        xPath.valueTo = 0;
                        this.valueRange = this.popUp.width;
                        break;
                    case gui.PopUpPosition.RIGHT:
                        yPath.valueFrom = yPath.valueTo = 0;
                        xPath.valueFrom = this.popUp.width;
                        xPath.valueTo = 0;
                        this.valueRange = this.popUp.width;
                        break;
                    default:
                        this.valueRange = 1;
                        break;
                }
                this.valueRange = Math.abs(this.valueRange);
                if (!this.popUpIsDisplayed) {
                    var tempValue = xPath.valueFrom;
                    xPath.valueFrom = xPath.valueTo;
                    xPath.valueTo = tempValue;
                    tempValue = yPath.valueFrom;
                    yPath.valueFrom = yPath.valueTo;
                    yPath.valueTo = tempValue;
                }
                return path;
            };
            /**
             * 添加到舞台事件
             */
            __egretProto__.addedToStageHandler = function (event) {
                this.addedToStage = true;
                egret.callLater(this.checkPopUpState, this);
            };
            /**
             * 延迟检查弹出状态，防止堆栈溢出。
             */
            __egretProto__.checkPopUpState = function () {
                if (this.addedToStage) {
                    this.addOrRemovePopUp();
                }
                else {
                    if (this.popUp != null && (this.popUp).parent != null)
                        this.removeAndResetPopUp();
                }
            };
            /**
             * 从舞台移除事件
             */
            __egretProto__.removedFromStageHandler = function (event) {
                this.addedToStage = false;
                egret.callLater(this.checkPopUpState, this);
            };
            return PopUpAnchor;
        })(gui.UIComponent);
        gui.PopUpAnchor = PopUpAnchor;
        PopUpAnchor.prototype.__class__ = "egret.gui.PopUpAnchor";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
