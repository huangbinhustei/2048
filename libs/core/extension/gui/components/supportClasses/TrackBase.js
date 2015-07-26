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
         * @class egret.gui.TrackBase
         * @classdesc
         * TrackBase类是具有一个轨道和一个或多个滑块按钮的组件的一个基类，如 Slider 和 ScrollBar。
         * @extends egret.gui.Range
         */
        var TrackBase = (function (_super) {
            __extends(TrackBase, _super);
            /**
             * @method egret.gui.TrackBase#constructor
             */
            function TrackBase() {
                _super.call(this);
                this._slideDuration = 300;
                /**
                 * [SkinPart]实体滑块组件
                 * @member egret.gui.TrackBase#thumb
                 */
                this.thumb = null;
                /**
                 * [SkinPart]实体轨道组件
                 * @member egret.gui.TrackBase#track
                 */
                this.track = null;
                /**
                 * 记录鼠标在thumb上按下的位置
                 * @type {number}
                 * @private
                 */
                this._clickOffsetX = NaN;
                /**
                 *
                 * @type {number}
                 * @private
                 */
                this._clickOffsetY = NaN;
                /**
                 * 当鼠标拖动thumb时，需要更新value的标记。
                 */
                this.needUpdateValue = false;
                /**
                 *
                 * @type {number}
                 * @private
                 */
                this._moveStageX = NaN;
                /**
                 *
                 * @type {number}
                 * @private
                 */
                this._moveStageY = NaN;
                this.mouseDownTarget = null;
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
                this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDownHandler, this);
            }
            var __egretProto__ = TrackBase.prototype;
            Object.defineProperty(__egretProto__, "slideDuration", {
                /**
                 * 在轨道上单击以移动滑块时，滑动动画持续的时间（以毫秒为单位）。<br/>
                 * 此属性用于 Slider 和 ScrollBar。对于 Slider，在轨道上的任何单击将导致生成使用此样式的一个动画，同时滑块将移到单击的位置。<br/>
                 * 对于 ScrollBar，仅当按住 Shift 键并单击轨道时才使用此样式，这会导致滑块移到单击的位置。<br/>
                 * 未按下 Shift 键时单击 ScrollBar 轨道将导致出现分页行为。<br/>
                 * 按住 Shift 键并单击时，必须也对 ScrollBar 设置 smoothScrolling 属性才可以实现动画行为。<br/>
                 * 此持续时间是整个滑过轨道的总时间，实际滚动会根据距离相应缩短。
                 * @member egret.gui.TrackBase#slideDuration
                 */
                get: function () {
                    return this._slideDuration;
                },
                set: function (value) {
                    this._slideDuration = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "maximum", {
                /**
                 * 最大有效值
                 * @member egret.gui.TrackBase#maximum
                 */
                get: function () {
                    return this._maximum;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (value == this._maximum)
                        return;
                    this._setMaximun(value);
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "minimum", {
                /**
                 * 最小有效值
                 * @member egret.gui.TrackBase#minimum
                 */
                get: function () {
                    return this._minimum;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (value == this._minimum)
                        return;
                    this._setMinimun(value);
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "value", {
                /**
                 * 此范围的当前值。
                 * @member egret.gui.TrackBase#value
                 */
                get: function () {
                    return this._getValue();
                },
                /**
                 * @inheritDoc
                 */
                set: function (newValue) {
                    if (newValue == this._getValue())
                        return;
                    this._setValue(newValue);
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @method egret.gui.TrackBase#setValue
             * @param value {number}
             */
            __egretProto__.setValue = function (value) {
                _super.prototype.setValue.call(this, value);
                this.invalidateDisplayList();
            };
            /**
             * 将相对于轨道的 x,y 像素位置转换为介于最小值和最大值（包括两者）之间的一个值。
             * @method egret.gui.TrackBase#pointToValue
             * @param x {number} 相对于轨道原点的位置的x坐标。
             * @param y {number} 相对于轨道原点的位置的y坐标。
             * @returns {number}
             */
            __egretProto__.pointToValue = function (x, y) {
                return this.minimum;
            };
            /**
             * 按 stepSize 增大或减小 value
             * @method egret.gui.TrackBase#changeValueByStep
             * @param increase {boolean}
             */
            __egretProto__.changeValueByStep = function (increase) {
                if (increase === void 0) { increase = true; }
                var prevValue = this.value;
                _super.prototype.changeValueByStep.call(this, increase);
                if (this.value != prevValue)
                    this.dispatchEventWith(egret.Event.CHANGE);
            };
            /**
             * 添加外观部件时调用
             * @method egret.gui.TrackBase#partAdded
             * @param partName {string}
             * @param instance {any}
             */
            __egretProto__.partAdded = function (partName, instance) {
                _super.prototype.partAdded.call(this, partName, instance);
                if (instance == this.thumb) {
                    this.thumb.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.thumb_mouseDownHandler, this);
                    this.thumb.addEventListener(gui.ResizeEvent.RESIZE, this.thumb_resizeHandler, this);
                    this.thumb.addEventListener(gui.UIEvent.UPDATE_COMPLETE, this.thumb_updateCompleteHandler, this);
                    this.thumb.stickyHighlighting = true;
                }
                else if (instance == this.track) {
                    this.track.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.track_mouseDownHandler, this);
                    this.track.addEventListener(gui.ResizeEvent.RESIZE, this.track_resizeHandler, this);
                }
            };
            /**
             * 删除外观部件的实例时调用
             * @method egret.gui.TrackBase#partRemoved
             * @param partName {string}
             * @param instance {any}
             */
            __egretProto__.partRemoved = function (partName, instance) {
                _super.prototype.partRemoved.call(this, partName, instance);
                if (instance == this.thumb) {
                    this.thumb.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.thumb_mouseDownHandler, this);
                    this.thumb.removeEventListener(gui.ResizeEvent.RESIZE, this.thumb_resizeHandler, this);
                    this.thumb.removeEventListener(gui.UIEvent.UPDATE_COMPLETE, this.thumb_updateCompleteHandler, this);
                }
                else if (instance == this.track) {
                    this.track.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.track_mouseDownHandler, this);
                    this.track.removeEventListener(gui.ResizeEvent.RESIZE, this.track_resizeHandler, this);
                }
            };
            /**
             * 绘制对象和/或设置其子项的大小和位置
             * @method egret.gui.TrackBase#updateDisplayList
             * @param w {number}
             * @param h {number}
             */
            __egretProto__.updateDisplayList = function (w, h) {
                _super.prototype.updateDisplayList.call(this, w, h);
                this.updateSkinDisplayList();
            };
            /**
             * 更新皮肤部件（通常为滑块）的大小和可见性。<br/>
             * 子类覆盖此方法以基于 minimum、maximum 和 value 属性更新滑块的大小、位置和可见性。
             * @method egret.gui.TrackBase#updateSkinDisplayList
             */
            __egretProto__.updateSkinDisplayList = function () {
            };
            /**
             * 添加到舞台时
             */
            __egretProto__.addedToStageHandler = function (event) {
                this.updateSkinDisplayList();
            };
            /**
             * 轨道尺寸改变事件
             */
            __egretProto__.track_resizeHandler = function (event) {
                this.updateSkinDisplayList();
            };
            /**
             * 滑块尺寸改变事件
             */
            __egretProto__.thumb_resizeHandler = function (event) {
                this.updateSkinDisplayList();
            };
            /**
             * 滑块三个阶段的延迟布局更新完毕事件
             */
            __egretProto__.thumb_updateCompleteHandler = function (event) {
                this.updateSkinDisplayList();
                this.thumb.removeEventListener(gui.UIEvent.UPDATE_COMPLETE, this.thumb_updateCompleteHandler, this);
            };
            /**
             * 滑块按下事件
             * @method egret.gui.TrackBase#thumb_mouseDownHandler
             * @param event {TouchEvent}
             */
            __egretProto__.thumb_mouseDownHandler = function (event) {
                gui.UIGlobals.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.stage_mouseMoveHandler, this);
                gui.UIGlobals.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stage_mouseUpHandler, this);
                gui.UIGlobals.stage.addEventListener(egret.Event.LEAVE_STAGE, this.stage_mouseUpHandler, this);
                this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
                var clickOffset = this.thumb.globalToLocal(event.stageX, event.stageY, egret.Point.identity);
                this._clickOffsetX = clickOffset.x;
                this._clickOffsetY = clickOffset.y;
                gui.TrackBaseEvent.dispatchTrackBaseEvent(this, gui.TrackBaseEvent.THUMB_PRESS);
                gui.UIEvent.dispatchUIEvent(this, gui.UIEvent.CHANGE_START);
            };
            /**
             * 拖动thumb过程中触发的EnterFrame事件
             */
            __egretProto__.onEnterFrame = function (event) {
                if (!this.needUpdateValue || !this.track)
                    return;
                this.updateWhenMouseMove();
                this.needUpdateValue = false;
            };
            /**
             * 当thumb被拖动时更新值，此方法每帧只被调用一次，比直接在鼠标移动事件里更新性能更高。
             * @method egret.gui.TrackBase#updateWhenMouseMove
             */
            __egretProto__.updateWhenMouseMove = function () {
                if (!this.track)
                    return;
                var p = this.track.globalToLocal(this._moveStageX, this._moveStageY, egret.Point.identity);
                var newValue = this.pointToValue(p.x - this._clickOffsetX, p.y - this._clickOffsetY);
                newValue = this.nearestValidValue(newValue, this.snapInterval);
                if (newValue != this.value) {
                    this.setValue(newValue);
                    this.validateDisplayList();
                    gui.TrackBaseEvent.dispatchTrackBaseEvent(this, gui.TrackBaseEvent.THUMB_DRAG);
                    this.dispatchEventWith(egret.Event.CHANGE);
                }
            };
            /**
             * 鼠标移动事件
             * @method egret.gui.TrackBase#stage_mouseMoveHandler
             * @param event {TouchEvent}
             */
            __egretProto__.stage_mouseMoveHandler = function (event) {
                this._moveStageX = event.stageX;
                this._moveStageY = event.stageY;
                if (this.needUpdateValue)
                    return;
                this.needUpdateValue = true;
            };
            /**
             * 鼠标弹起事件
             * @method egret.gui.TrackBase#stage_mouseUpHandler
             * @param event {Event}
             */
            __egretProto__.stage_mouseUpHandler = function (event) {
                gui.UIGlobals.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.stage_mouseMoveHandler, this);
                gui.UIGlobals.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.stage_mouseUpHandler, this);
                gui.UIGlobals.stage.removeEventListener(egret.Event.LEAVE_STAGE, this.stage_mouseUpHandler, this);
                this.removeEventListener(egret.Event.ENTER_FRAME, this.updateWhenMouseMove, this);
                if (this.needUpdateValue) {
                    this.updateWhenMouseMove();
                    this.needUpdateValue = false;
                }
                gui.TrackBaseEvent.dispatchTrackBaseEvent(this, gui.TrackBaseEvent.THUMB_RELEASE);
                gui.UIEvent.dispatchUIEvent(this, gui.UIEvent.CHANGE_END);
            };
            /**
             * 轨道被按下事件
             * @method egret.gui.TrackBase#track_mouseDownHandler
             * @param event {TouchEvent}
             */
            __egretProto__.track_mouseDownHandler = function (event) {
            };
            /**
             * 当在组件上按下鼠标时记录被按下的子显示对象
             */
            __egretProto__.mouseDownHandler = function (event) {
                gui.UIGlobals.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stage_mouseUpSomewhereHandler, this);
                gui.UIGlobals.stage.addEventListener(egret.Event.LEAVE_STAGE, this.stage_mouseUpSomewhereHandler, this);
                this.mouseDownTarget = (event.target);
            };
            /**
             * 当鼠标弹起时，若不是在mouseDownTarget上弹起，而是另外的子显示对象上弹起时，额外抛出一个鼠标单击事件。
             */
            __egretProto__.stage_mouseUpSomewhereHandler = function (event) {
                gui.UIGlobals.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.stage_mouseUpSomewhereHandler, this);
                gui.UIGlobals.stage.removeEventListener(egret.Event.LEAVE_STAGE, this.stage_mouseUpSomewhereHandler, this);
                if (this.mouseDownTarget != event.target && event instanceof egret.TouchEvent && this.contains((event.target))) {
                    var mEvent = event;
                    var mousePoint = (event.target).localToGlobal(mEvent.localX, mEvent.localY);
                    egret.TouchEvent.dispatchTouchEvent(this, egret.TouchEvent.TOUCH_TAP, mEvent.touchPointID, mousePoint.x, mousePoint.y, mEvent.ctrlKey, mEvent.altKey, mEvent.shiftKey, mEvent.touchDown);
                }
                this.mouseDownTarget = null;
            };
            return TrackBase;
        })(gui.Range);
        gui.TrackBase = TrackBase;
        TrackBase.prototype.__class__ = "egret.gui.TrackBase";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
