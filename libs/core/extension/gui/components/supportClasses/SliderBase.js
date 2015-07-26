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
         * @class egret.gui.SliderBase
         * @classdesc
         * 滑块控件基类
         * @extends egret.gui.TrackBase
         */
        var SliderBase = (function (_super) {
            __extends(SliderBase, _super);
            /**
             * 构造函数
             * @method egret.gui.SliderBase#constructor
             */
            function SliderBase() {
                _super.call(this);
                /**
                 * [SkinPart]轨道高亮显示对象
                 * @member egret.gui.SliderBase#trackHighlight
                 */
                this.trackHighlight = null;
                this._showTrackHighlight = true;
                /**
                 * 动画实例
                 */
                this.animator = null;
                this._pendingValue = 0;
                /**
                 * 动画播放结束时要到达的value。
                 */
                this.slideToValue = NaN;
                this._liveDragging = true;
                this.maximum = 10;
            }
            var __egretProto__ = SliderBase.prototype;
            Object.defineProperty(__egretProto__, "showTrackHighlight", {
                /**
                 * 是否启用轨道高亮效果。默认值为true。
                 * 注意，皮肤里的子部件trackHighlight要同时为非空才能显示高亮效果。
                 * @member egret.gui.SliderBase#showTrackHighlight
                 */
                get: function () {
                    return this._showTrackHighlight;
                },
                set: function (value) {
                    if (this._showTrackHighlight == value)
                        return;
                    this._showTrackHighlight = value;
                    if (this.trackHighlight)
                        this.trackHighlight.visible = value;
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "pendingValue", {
                /**
                 * 释放鼠标按键时滑块将具有的值。无论liveDragging是否为true，在滑块拖动期间始终更新此属性。
                 * 而value属性在当liveDragging为false时，只在鼠标释放时更新一次。
                 * @member egret.gui.SliderBase#pendingValue
                 */
                get: function () {
                    return this._pendingValue;
                },
                set: function (value) {
                    if (value == this._pendingValue)
                        return;
                    this._pendingValue = value;
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 在 value 属性改变时为该属性设置后备存储，并调度 valueCommit 事件
             * @method egret.gui.SliderBase#setValue
             * @param value {number}
             */
            __egretProto__.setValue = function (value) {
                this._pendingValue = value;
                _super.prototype.setValue.call(this, value);
            };
            /**
             * 动画播放更新数值
             */
            __egretProto__._animationUpdateHandler = function (animation) {
                this.pendingValue = animation.currentValue["value"];
            };
            /**
             * 动画播放完毕
             */
            __egretProto__.animationEndHandler = function (animation) {
                this.setValue(this.slideToValue);
                this.dispatchEventWith(egret.Event.CHANGE);
                gui.UIEvent.dispatchUIEvent(this, gui.UIEvent.CHANGE_END);
            };
            /**
             * 停止播放动画
             */
            __egretProto__.stopAnimation = function () {
                this.animator.stop();
                this.setValue(this.nearestValidValue(this.pendingValue, this.snapInterval));
                this.dispatchEventWith(egret.Event.CHANGE);
                gui.UIEvent.dispatchUIEvent(this, gui.UIEvent.CHANGE_END);
            };
            /**
             * @method egret.gui.SliderBase#thumb_mouseDownHandler
             * @param event {TouchEvent}
             */
            __egretProto__.thumb_mouseDownHandler = function (event) {
                if (this.animator && this.animator.isPlaying)
                    this.stopAnimation();
                _super.prototype.thumb_mouseDownHandler.call(this, event);
            };
            Object.defineProperty(__egretProto__, "liveDragging", {
                /**
                 * 如果为 true，则将在沿着轨道拖动滑块时，而不是在释放滑块按钮时，提交此滑块的值。
                 * @member egret.gui.SliderBase#liveDragging
                 */
                get: function () {
                    return this._liveDragging;
                },
                set: function (value) {
                    this._liveDragging = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @method egret.gui.SliderBase#updateWhenMouseMove
             */
            __egretProto__.updateWhenMouseMove = function () {
                if (!this.track)
                    return;
                var pos = this.track.globalToLocal(this._moveStageX, this._moveStageY, egret.Point.identity);
                var newValue = this.pointToValue(pos.x - this._clickOffsetX, pos.y - this._clickOffsetY);
                newValue = this.nearestValidValue(newValue, this.snapInterval);
                if (newValue != this.pendingValue) {
                    gui.TrackBaseEvent.dispatchTrackBaseEvent(this, gui.TrackBaseEvent.THUMB_DRAG);
                    if (this.liveDragging == true) {
                        this.setValue(newValue);
                        this.dispatchEventWith(egret.Event.CHANGE);
                    }
                    else {
                        this.pendingValue = newValue;
                    }
                }
            };
            /**
             * @method egret.gui.SliderBase#stage_mouseUpHandler
             * @param event {Event}
             */
            __egretProto__.stage_mouseUpHandler = function (event) {
                _super.prototype.stage_mouseUpHandler.call(this, event);
                if ((this.liveDragging == false) && (this.value != this.pendingValue)) {
                    this.setValue(this.pendingValue);
                    this.dispatchEventWith(egret.Event.CHANGE);
                }
            };
            /**
             * @method egret.gui.SliderBase#track_mouseDownHandler
             * @param event {TouchEvent}
             */
            __egretProto__.track_mouseDownHandler = function (event) {
                if (!this.enabled)
                    return;
                var thumbW = (this.thumb) ? this.thumb.width : 0;
                var thumbH = (this.thumb) ? this.thumb.height : 0;
                var offsetX = event.stageX - (thumbW / 2);
                var offsetY = event.stageY - (thumbH / 2);
                var p = this.track.globalToLocal(offsetX, offsetY, egret.Point.identity);
                var newValue = this.pointToValue(p.x, p.y);
                newValue = this.nearestValidValue(newValue, this.snapInterval);
                if (newValue != this.pendingValue) {
                    if (this.slideDuration != 0) {
                        if (!this.animator) {
                            this.animator = new gui.Animation(this._animationUpdateHandler, this);
                            this.animator.endFunction = this.animationEndHandler;
                        }
                        if (this.animator.isPlaying)
                            this.stopAnimation();
                        this.slideToValue = newValue;
                        this.animator.duration = this.slideDuration * (Math.abs(this.pendingValue - this.slideToValue) / (this.maximum - this.minimum));
                        this.animator.motionPaths = [
                            new gui.SimpleMotionPath("value", this.pendingValue, this.slideToValue)
                        ];
                        gui.UIEvent.dispatchUIEvent(this, gui.UIEvent.CHANGE_START);
                        this.animator.play();
                    }
                    else {
                        this.setValue(newValue);
                        this.dispatchEventWith(egret.Event.CHANGE);
                    }
                }
            };
            /**
             * 正删除外观部件的实例时调用
             * @method egret.gui.SliderBase#partAdded
             * @param partName {string}
             * @param instance {any}
             */
            __egretProto__.partAdded = function (partName, instance) {
                _super.prototype.partAdded.call(this, partName, instance);
                if (instance == this.trackHighlight) {
                    this.trackHighlight.touchEnabled = false;
                    if (this.trackHighlight instanceof egret.DisplayObjectContainer)
                        (this.trackHighlight).touchChildren = false;
                    this.trackHighlight.visible = this._showTrackHighlight;
                }
            };
            return SliderBase;
        })(gui.TrackBase);
        gui.SliderBase = SliderBase;
        SliderBase.prototype.__class__ = "egret.gui.SliderBase";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
