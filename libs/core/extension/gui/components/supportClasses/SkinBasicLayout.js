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
         * @class egret.gui.SkinBasicLayout
         * @classdesc
         * 皮肤简单布局类。
         * @extends egret.HashObject
         */
        var SkinBasicLayout = (function (_super) {
            __extends(SkinBasicLayout, _super);
            /**
             * 构造函数
             * @method egret.gui.SkinBasicLayout#constructor
             */
            function SkinBasicLayout() {
                _super.call(this);
                this._target = null;
            }
            var __egretProto__ = SkinBasicLayout.prototype;
            Object.defineProperty(__egretProto__, "target", {
                /**
                 * 目标布局对象
                 * @member egret.gui.SkinBasicLayout#target
                 */
                get: function () {
                    return this._target;
                },
                set: function (value) {
                    this._target = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 测量组件尺寸大小
             * @method egret.gui.SkinBasicLayout#measure
             */
            __egretProto__.measure = function () {
                if (this.target == null)
                    return;
                var measureW = 0;
                var measureH = 0;
                var target = this._target;
                var count = target.numElements;
                for (var i = 0; i < count; i++) {
                    var layoutElement = target.getElementAt(i);
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
                    measureW = Math.ceil(Math.max(measureW, extX + preferredWidth));
                    measureH = Math.ceil(Math.max(measureH, extY + preferredHeight));
                }
                this.target.measuredWidth = measureW;
                this.target.measuredHeight = measureH;
            };
            /**
             * 更新显示列表
             * @method egret.gui.SkinBasicLayout#updateDisplayList
             * @param unscaledWidth {number}
             * @param unscaledHeight {number}
             */
            __egretProto__.updateDisplayList = function (unscaledWidth, unscaledHeight) {
                if (this.target == null)
                    return;
                var count = this.target.numElements;
                for (var i = 0; i < count; i++) {
                    var layoutElement = this.target.getElementAt(i);
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
                }
            };
            return SkinBasicLayout;
        })(egret.HashObject);
        gui.SkinBasicLayout = SkinBasicLayout;
        SkinBasicLayout.prototype.__class__ = "egret.gui.SkinBasicLayout";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
