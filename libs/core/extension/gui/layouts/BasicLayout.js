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
         * @class egret.gui.BasicLayout
         * @classdesc
         * 基本布局
         * @extends egret.gui.LayoutBase
         */
        var BasicLayout = (function (_super) {
            __extends(BasicLayout, _super);
            /**
             * @method egret.gui.BasicLayout#constructor
             */
            function BasicLayout() {
                _super.call(this);
                this._mouseWheelSpeed = 20;
            }
            var __egretProto__ = BasicLayout.prototype;
            Object.defineProperty(__egretProto__, "useVirtualLayout", {
                /**
                 * 此布局不支持虚拟布局，设置这个属性无效
                 */
                set: function (value) {
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "mouseWheelSpeed", {
                /**
                 * 鼠标滚轮每次滚动时目标容器的verticalScrollPosition
                 * 或horizontalScrollPosition改变的像素距离。必须大于0， 默认值20。
                 * @member egret.gui.BasicLayout#mouseWheelSpeed
                 */
                get: function () {
                    return this._mouseWheelSpeed;
                },
                set: function (value) {
                    if (value == 0)
                        value = 1;
                    this._mouseWheelSpeed = value;
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__.getElementBoundsLeftOfScrollRect = function (scrollRect) {
                var bounds = new egret.Rectangle();
                bounds.x = scrollRect.x - this._mouseWheelSpeed;
                bounds.right = scrollRect.x;
                return bounds;
            };
            __egretProto__.getElementBoundsRightOfScrollRect = function (scrollRect) {
                var bounds = new egret.Rectangle();
                bounds.x = scrollRect.right;
                bounds.right = scrollRect.right + this._mouseWheelSpeed;
                return bounds;
            };
            __egretProto__.getElementBoundsAboveScrollRect = function (scrollRect) {
                var bounds = new egret.Rectangle();
                bounds.y = scrollRect.y - this._mouseWheelSpeed;
                bounds.bottom = scrollRect.y;
                return bounds;
            };
            __egretProto__.getElementBoundsBelowScrollRect = function (scrollRect) {
                var bounds = new egret.Rectangle();
                bounds.y = scrollRect.bottom;
                bounds.bottom = scrollRect.bottom + this._mouseWheelSpeed;
                return bounds;
            };
            /**
             *基于目标的内容测量其默认大小，并（可选）测量目标的默认最小大小
             */
            __egretProto__.measure = function () {
                _super.prototype.measure.call(this);
                if (this.target == null)
                    return;
                var width = 0;
                var height = 0;
                var count = this.target.numElements;
                for (var i = 0; i < count; i++) {
                    var layoutElement = (this.target.getElementAt(i));
                    if (!layoutElement || !layoutElement.includeInLayout)
                        continue;
                    var hCenter = layoutElement.horizontalCenter;
                    var vCenter = layoutElement.verticalCenter;
                    var left = layoutElement.left;
                    var right = layoutElement.right;
                    var top = layoutElement.top;
                    var bottom = layoutElement.bottom;
                    var extX;
                    var extY;
                    if (!isNaN(left) && !isNaN(right)) {
                        extX = left + right;
                    }
                    else if (!isNaN(hCenter)) {
                        extX = Math.abs(hCenter) * 2;
                    }
                    else if (!isNaN(left) || !isNaN(right)) {
                        extX = isNaN(left) ? 0 : left;
                        extX += isNaN(right) ? 0 : right;
                    }
                    else {
                        extX = layoutElement.preferredX;
                    }
                    if (!isNaN(top) && !isNaN(bottom)) {
                        extY = top + bottom;
                    }
                    else if (!isNaN(vCenter)) {
                        extY = Math.abs(vCenter) * 2;
                    }
                    else if (!isNaN(top) || !isNaN(bottom)) {
                        extY = isNaN(top) ? 0 : top;
                        extY += isNaN(bottom) ? 0 : bottom;
                    }
                    else {
                        extY = layoutElement.preferredY;
                    }
                    var preferredWidth = layoutElement.preferredWidth;
                    var preferredHeight = layoutElement.preferredHeight;
                    width = Math.ceil(Math.max(width, extX + preferredWidth));
                    height = Math.ceil(Math.max(height, extY + preferredHeight));
                }
                this.target.measuredWidth = width;
                this.target.measuredHeight = height;
            };
            /**
             * 调整目标的元素的大小并定位这些元素
             * @param unscaledWidth
             * @param unscaledHeight
             */
            __egretProto__.updateDisplayList = function (unscaledWidth, unscaledHeight) {
                _super.prototype.updateDisplayList.call(this, unscaledWidth, unscaledHeight);
                if (this.target == null)
                    return;
                var count = this.target.numElements;
                var maxX = 0;
                var maxY = 0;
                for (var i = 0; i < count; i++) {
                    var layoutElement = (this.target.getElementAt(i));
                    if (layoutElement == null || !layoutElement.includeInLayout)
                        continue;
                    var hCenter = layoutElement.horizontalCenter;
                    var vCenter = layoutElement.verticalCenter;
                    var left = layoutElement.left;
                    var right = layoutElement.right;
                    var top = layoutElement.top;
                    var bottom = layoutElement.bottom;
                    var percentWidth = layoutElement.percentWidth;
                    var percentHeight = layoutElement.percentHeight;
                    var childWidth = NaN;
                    var childHeight = NaN;
                    if (!isNaN(left) && !isNaN(right)) {
                        childWidth = unscaledWidth - right - left;
                    }
                    else if (!isNaN(percentWidth)) {
                        childWidth = Math.round(unscaledWidth * Math.min(percentWidth * 0.01, 1));
                    }
                    if (!isNaN(top) && !isNaN(bottom)) {
                        childHeight = unscaledHeight - bottom - top;
                    }
                    else if (!isNaN(percentHeight)) {
                        childHeight = Math.round(unscaledHeight * Math.min(percentHeight * 0.01, 1));
                    }
                    layoutElement.setLayoutBoundsSize(childWidth, childHeight);
                    var elementWidth = layoutElement.layoutBoundsWidth;
                    var elementHeight = layoutElement.layoutBoundsHeight;
                    var childX = NaN;
                    var childY = NaN;
                    if (!isNaN(hCenter))
                        childX = Math.round((unscaledWidth - elementWidth) / 2 + hCenter);
                    else if (!isNaN(left))
                        childX = left;
                    else if (!isNaN(right))
                        childX = unscaledWidth - elementWidth - right;
                    else
                        childX = layoutElement.layoutBoundsX;
                    if (!isNaN(vCenter))
                        childY = Math.round((unscaledHeight - elementHeight) / 2 + vCenter);
                    else if (!isNaN(top))
                        childY = top;
                    else if (!isNaN(bottom))
                        childY = unscaledHeight - elementHeight - bottom;
                    else
                        childY = layoutElement.layoutBoundsY;
                    layoutElement.setLayoutBoundsPosition(childX, childY);
                    maxX = Math.max(maxX, childX + elementWidth);
                    maxY = Math.max(maxY, childY + elementHeight);
                }
                this.target.setContentSize(maxX, maxY);
            };
            return BasicLayout;
        })(gui.LayoutBase);
        gui.BasicLayout = BasicLayout;
        BasicLayout.prototype.__class__ = "egret.gui.BasicLayout";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
