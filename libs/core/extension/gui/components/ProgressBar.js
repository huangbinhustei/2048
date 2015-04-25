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
         * @class egret.gui.ProgressBar
         * @classdesc
         * 进度条控件。
         * @extends egret.gui.Range
         */
        var ProgressBar = (function (_super) {
            __extends(ProgressBar, _super);
            /**
             * @method egret.gui.ProgressBar#constructor
             */
            function ProgressBar() {
                _super.call(this);
                /**
                 * [SkinPart]进度高亮显示对象。
                 * @member egret.gui.ProgressBar#thumb
                 */
                this.thumb = null;
                /**
                 * [SkinPart]轨道显示对象，用于确定thumb要覆盖的区域。
                 * @member egret.gui.ProgressBar#track
                 */
                this.track = null;
                /**
                 * [SkinPart]进度条文本
                 * @member egret.gui.ProgressBar#labelDisplay
                 */
                this.labelDisplay = null;
                this._labelFunction = null;
                this._slideDuration = 500;
                this._direction = gui.ProgressBarDirection.LEFT_TO_RIGHT;
                /**
                 * 动画实例
                 */
                this.animator = null;
                /**
                 * 动画播放结束时要到达的value。
                 */
                this.slideToValue = NaN;
                this.animationValue = 0;
                this.trackResizedOrMoved = false;
            }
            var __egretProto__ = ProgressBar.prototype;
            Object.defineProperty(__egretProto__, "labelFunction", {
                /**
                 * 进度条文本格式化回调函数。示例：labelFunction(value:Number,maximum:Number):String;
                 * @member egret.gui.ProgressBar#labelFunction
                 */
                get: function () {
                    return this._labelFunction;
                },
                set: function (value) {
                    if (this._labelFunction == value)
                        return;
                    this._labelFunction = value;
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 将当前value转换成文本
             * @method egret.gui.ProgressBar#valueToLabel
             * @param value {number}
             * @param maximum {number}
             * @returns {string}
             */
            __egretProto__.valueToLabel = function (value, maximum) {
                if (this.labelFunction != null) {
                    return this._labelFunction(value, maximum);
                }
                return value + " / " + maximum;
            };
            Object.defineProperty(__egretProto__, "slideDuration", {
                /**
                 * value改变时调整thumb长度的缓动动画时间，单位毫秒。设置为0则不执行缓动。默认值500。
                 * @member egret.gui.ProgressBar#slideDuration
                 */
                get: function () {
                    return this._slideDuration;
                },
                set: function (value) {
                    if (this._slideDuration == value)
                        return;
                    this._slideDuration = value;
                    if (this.animator && this.animator.isPlaying) {
                        this.animator.stop();
                        this._setValue(this.slideToValue);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "direction", {
                /**
                 * 进度条增长方向。请使用ProgressBarDirection定义的常量。默认值：ProgressBarDirection.LEFT_TO_RIGHT。
                 * @member egret.gui.ProgressBar#direction
                 */
                get: function () {
                    return this._direction;
                },
                set: function (value) {
                    if (this._direction == value)
                        return;
                    this._direction = value;
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "value", {
                /**
                 * 进度条的当前值。
                 * 注意：当组件添加到显示列表后，若slideDuration不为0。设置此属性，并不会立即应用。而是作为目标值，开启缓动动画缓慢接近。
                 * 若需要立即重置属性，请先设置slideDuration为0，或者把组件从显示列表移除。
                 * @member egret.gui.ProgressBar#value
                 */
                get: function () {
                    return this._getValue();
                },
                set: function (newValue) {
                    if (this._getValue() == newValue)
                        return;
                    this._setValue(newValue);
                    if (this._slideDuration > 0 && this.stage) {
                        this.validateProperties(); //最大值最小值发生改变时要立即应用，防止当前起始值不正确。
                        if (!this.animator) {
                            this.animator = new gui.Animation(this.animationUpdateHandler, this);
                        }
                        if (this.animator.isPlaying) {
                            this.animationValue = this.slideToValue;
                            this.invalidateDisplayList();
                            this.animator.stop();
                        }
                        this.slideToValue = this.nearestValidValue(newValue, this.snapInterval);
                        if (this.slideToValue == this.animationValue)
                            return;
                        var duration = this._slideDuration * (Math.abs(this.animationValue - this.slideToValue) / (this.maximum - this.minimum));
                        this.animator.duration = duration === Infinity ? 0 : duration;
                        this.animator.motionPaths = [
                            new gui.SimpleMotionPath("value", this.animationValue, this.slideToValue)
                        ];
                        this.animator.play();
                    }
                    else {
                        this.animationValue = this._getValue();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 动画播放更新数值
             */
            __egretProto__.animationUpdateHandler = function (animation) {
                var value = this.nearestValidValue(animation.currentValue["value"], this.snapInterval);
                this.animationValue = Math.min(this.maximum, Math.max(this.minimum, value));
                this.invalidateDisplayList();
            };
            /**
             * @method egret.gui.ProgressBar#setValue
             * @param value {number}
             */
            __egretProto__.setValue = function (value) {
                _super.prototype.setValue.call(this, value);
                this.invalidateDisplayList();
            };
            /**
             * 绘制对象和/或设置其子项的大小和位置
             * @method egret.gui.ProgressBar#updateDisplayList
             * @param unscaledWidth {number}
             * @param unscaledHeight {number}
             */
            __egretProto__.updateDisplayList = function (unscaledWidth, unscaledHeight) {
                _super.prototype.updateDisplayList.call(this, unscaledWidth, unscaledHeight);
                this.updateSkinDisplayList();
            };
            /**
             * [覆盖] 添加外观部件时调用
             * @param partName
             * @param instance
             */
            __egretProto__.partAdded = function (partName, instance) {
                if (instance == this.track) {
                    if (this.track instanceof gui.UIComponent) {
                        this.track.addEventListener(gui.ResizeEvent.RESIZE, this.onTrackResizeOrMove, this);
                        this.track.addEventListener(gui.MoveEvent.MOVE, this.onTrackResizeOrMove, this);
                    }
                }
            };
            /**
             * [覆盖] 正删除外观部件的实例时调用
             * @param partName
             * @param instance
             */
            __egretProto__.partRemoved = function (partName, instance) {
                if (instance == this.track) {
                    if (this.track instanceof gui.UIComponent) {
                        this.track.removeEventListener(gui.ResizeEvent.RESIZE, this.onTrackResizeOrMove, this);
                        this.track.removeEventListener(gui.MoveEvent.MOVE, this.onTrackResizeOrMove, this);
                    }
                }
            };
            /**
             * track的位置或尺寸发生改变
             */
            __egretProto__.onTrackResizeOrMove = function (event) {
                this.trackResizedOrMoved = true;
                this.invalidateProperties();
            };
            /**
             * 处理对组件设置的属性
             */
            __egretProto__.commitProperties = function () {
                _super.prototype.commitProperties.call(this);
                if (this.trackResizedOrMoved) {
                    this.trackResizedOrMoved = false;
                    this.updateSkinDisplayList();
                }
            };
            /**
             * 更新皮肤部件大小和可见性。
             * @method egret.gui.ProgressBar#updateSkinDisplayList
             */
            __egretProto__.updateSkinDisplayList = function () {
                this.trackResizedOrMoved = false;
                var currentValue = this.value;
                if (this.animator && this.animator.isPlaying) {
                    currentValue = this.animationValue;
                }
                else {
                    currentValue = this.value;
                    if (isNaN(currentValue)) {
                        currentValue = 0;
                    }
                }
                var maxValue = isNaN(this.maximum) ? 0 : this.maximum;
                if (this.thumb && this.track) {
                    var trackWidth = isNaN(this.track.width) ? 0 : this.track.width;
                    trackWidth *= this.track.scaleX;
                    var trackHeight = isNaN(this.track.height) ? 0 : this.track.height;
                    trackHeight *= this.track.scaleY;
                    var thumbWidth = Math.round((currentValue / maxValue) * trackWidth);
                    if (isNaN(thumbWidth) || thumbWidth < 0 || thumbWidth === Infinity)
                        thumbWidth = 0;
                    var thumbHeight = Math.round((currentValue / maxValue) * trackHeight);
                    if (isNaN(thumbHeight) || thumbHeight < 0 || thumbHeight === Infinity)
                        thumbHeight = 0;
                    var p = this.track.localToGlobal(0, 0);
                    var thumbPos = this.globalToLocal(p.x, p.y, egret.Point.identity);
                    var thumbPosX = thumbPos.x;
                    var thumbPosY = thumbPos.y;
                    switch (this._direction) {
                        case gui.ProgressBarDirection.LEFT_TO_RIGHT:
                            this.thumb.width = thumbWidth;
                            this.thumb.height = trackHeight;
                            this.thumb.x = thumbPosX;
                            break;
                        case gui.ProgressBarDirection.RIGHT_TO_LEFT:
                            this.thumb.width = thumbWidth;
                            this.thumb.height = trackHeight;
                            this.thumb.x = thumbPosX + trackWidth - thumbWidth;
                            break;
                        case gui.ProgressBarDirection.TOP_TO_BOTTOM:
                            this.thumb.width = trackWidth;
                            this.thumb.height = thumbHeight;
                            this.thumb.y = thumbPosY;
                            break;
                        case gui.ProgressBarDirection.BOTTOM_TO_TOP:
                            this.thumb.width = trackWidth;
                            this.thumb.height = thumbHeight;
                            this.thumb.y = thumbPosY + trackHeight - thumbHeight;
                            break;
                    }
                }
                if (this.labelDisplay) {
                    this.labelDisplay.text = this.valueToLabel(currentValue, maxValue);
                }
            };
            return ProgressBar;
        })(gui.Range);
        gui.ProgressBar = ProgressBar;
        ProgressBar.prototype.__class__ = "egret.gui.ProgressBar";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
