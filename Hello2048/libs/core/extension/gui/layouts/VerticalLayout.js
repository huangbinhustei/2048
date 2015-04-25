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
         * @class egret.gui.VerticalLayout
         * @classdesc
         * 垂直布局
         * @extends egret.gui.LayoutBase
         */
        var VerticalLayout = (function (_super) {
            __extends(VerticalLayout, _super);
            /**
             * @method egret.gui.VerticalLayout#constructor
             */
            function VerticalLayout() {
                _super.call(this);
                this._horizontalAlign = egret.HorizontalAlign.LEFT;
                this._verticalAlign = egret.VerticalAlign.TOP;
                this._gap = 6;
                this._padding = 0;
                this._paddingLeft = NaN;
                this._paddingRight = NaN;
                this._paddingTop = NaN;
                this._paddingBottom = NaN;
                /**
                 * 虚拟布局使用的子对象尺寸缓存
                 */
                this.elementSizeTable = [];
                /**
                 * 虚拟布局使用的当前视图中的第一个元素索引
                 */
                this.startIndex = -1;
                /**
                 * 虚拟布局使用的当前视图中的最后一个元素的索引
                 */
                this.endIndex = -1;
                /**
                 * 视图的第一个和最后一个元素的索引值已经计算好的标志
                 */
                this.indexInViewCalculated = false;
                /**
                 * 子对象最大宽度
                 */
                this.maxElementWidth = 0;
            }
            var __egretProto__ = VerticalLayout.prototype;
            Object.defineProperty(__egretProto__, "horizontalAlign", {
                /**
                 * 布局元素的水平对齐策略。参考HorizontalAlign定义的常量。
                 * @member egret.gui.VerticalLayout#horizontalAlign
                 */
                get: function () {
                    return this._horizontalAlign;
                },
                set: function (value) {
                    if (this._horizontalAlign == value)
                        return;
                    this._horizontalAlign = value;
                    if (this.target)
                        this.target.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "verticalAlign", {
                /**
                 * 布局元素的竖直对齐策略。参考VerticalAlign定义的常量。
                 * 注意：此属性设置为CONTENT_JUSTIFY始终无效。当useVirtualLayout为true时，设置JUSTIFY也无效。
                 * @member egret.gui.VerticalLayout#verticalAlign
                 */
                get: function () {
                    return this._verticalAlign;
                },
                set: function (value) {
                    if (this._verticalAlign == value)
                        return;
                    this._verticalAlign = value;
                    if (this.target)
                        this.target.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "gap", {
                /**
                 * 布局元素之间的垂直空间（以像素为单位）
                 * @member egret.gui.VerticalLayout#gap
                 */
                get: function () {
                    return this._gap;
                },
                set: function (value) {
                    if (this._gap == value)
                        return;
                    this._gap = value;
                    this.invalidateTargetSizeAndDisplayList();
                    if (this.hasEventListener("gapChanged"))
                        this.dispatchEventWith("gapChanged");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "padding", {
                /**
                 * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
                 * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
                 * @member egret.gui.VerticalLayout#padding
                 */
                get: function () {
                    return this._padding;
                },
                set: function (value) {
                    if (this._padding == value)
                        return;
                    this._padding = value;
                    this.invalidateTargetSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "paddingLeft", {
                /**
                 * 容器的左边缘与布局元素的左边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
                 * @member egret.gui.VerticalLayout#paddingLeft
                 */
                get: function () {
                    return this._paddingLeft;
                },
                set: function (value) {
                    if (this._paddingLeft == value)
                        return;
                    this._paddingLeft = value;
                    this.invalidateTargetSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "paddingRight", {
                /**
                 * 容器的右边缘与布局元素的右边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
                 * @member egret.gui.VerticalLayout#paddingRight
                 */
                get: function () {
                    return this._paddingRight;
                },
                set: function (value) {
                    if (this._paddingRight == value)
                        return;
                    this._paddingRight = value;
                    this.invalidateTargetSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "paddingTop", {
                /**
                 * 容器的顶边缘与第一个布局元素的顶边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
                 * @member egret.gui.VerticalLayout#paddingTop
                 */
                get: function () {
                    return this._paddingTop;
                },
                set: function (value) {
                    if (this._paddingTop == value)
                        return;
                    this._paddingTop = value;
                    this.invalidateTargetSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "paddingBottom", {
                /**
                 * 容器的底边缘与最后一个布局元素的底边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
                 * @member egret.gui.VerticalLayout#paddingBottom
                 */
                get: function () {
                    return this._paddingBottom;
                },
                set: function (value) {
                    if (this._paddingBottom == value)
                        return;
                    this._paddingBottom = value;
                    this.invalidateTargetSizeAndDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 标记目标容器的尺寸和显示列表失效
             */
            __egretProto__.invalidateTargetSizeAndDisplayList = function () {
                if (this.target) {
                    this.target.invalidateSize();
                    this.target.invalidateDisplayList();
                }
            };
            /**
             * 基于目标的内容测量其默认大小，并（可选）测量目标的默认最小大小
             */
            __egretProto__.measure = function () {
                _super.prototype.measure.call(this);
                if (!this.target)
                    return;
                if (this.useVirtualLayout) {
                    this.measureVirtual();
                }
                else {
                    this.measureReal();
                }
            };
            /**
             * 测量使用虚拟布局的尺寸
             */
            __egretProto__.measureVirtual = function () {
                var numElements = this.target.numElements;
                var typicalHeight = this.typicalLayoutRect ? this.typicalLayoutRect.height : 22;
                var typicalWidth = this.typicalLayoutRect ? this.typicalLayoutRect.width : 71;
                var measuredWidth = Math.max(this.maxElementWidth, typicalWidth);
                var measuredHeight = this.getElementTotalSize();
                var visibleIndices = this.target.getElementIndicesInView();
                var length = visibleIndices.length;
                for (var i = 0; i < length; i++) {
                    var index = visibleIndices[i];
                    var layoutElement = (this.target.getElementAt(index));
                    if (layoutElement == null || !layoutElement.includeInLayout)
                        continue;
                    var preferredWidth = layoutElement.preferredWidth;
                    var preferredHeight = layoutElement.preferredHeight;
                    measuredHeight += preferredHeight;
                    measuredHeight -= isNaN(this.elementSizeTable[index]) ? typicalHeight : this.elementSizeTable[index];
                    measuredWidth = Math.max(measuredWidth, preferredWidth);
                }
                var padding = isNaN(this._padding) ? 0 : this._padding;
                var paddingL = isNaN(this._paddingLeft) ? padding : this._paddingLeft;
                var paddingR = isNaN(this._paddingRight) ? padding : this._paddingRight;
                var paddingT = isNaN(this._paddingTop) ? padding : this._paddingTop;
                var paddingB = isNaN(this._paddingBottom) ? padding : this._paddingBottom;
                var hPadding = paddingL + paddingR;
                var vPadding = paddingT + paddingB;
                this.target.measuredWidth = Math.ceil(measuredWidth + hPadding);
                this.target.measuredHeight = Math.ceil(measuredHeight + vPadding);
            };
            /**
             * 测量使用真实布局的尺寸
             */
            __egretProto__.measureReal = function () {
                var count = this.target.numElements;
                var numElements = count;
                var measuredWidth = 0;
                var measuredHeight = 0;
                for (var i = 0; i < count; i++) {
                    var layoutElement = (this.target.getElementAt(i));
                    if (!layoutElement || !layoutElement.includeInLayout) {
                        numElements--;
                        continue;
                    }
                    var preferredWidth = layoutElement.preferredWidth;
                    var preferredHeight = layoutElement.preferredHeight;
                    measuredHeight += preferredHeight;
                    measuredWidth = Math.max(measuredWidth, preferredWidth);
                }
                var gap = isNaN(this._gap) ? 0 : this._gap;
                measuredHeight += (numElements - 1) * gap;
                var padding = isNaN(this._padding) ? 0 : this._padding;
                var paddingL = isNaN(this._paddingLeft) ? padding : this._paddingLeft;
                var paddingR = isNaN(this._paddingRight) ? padding : this._paddingRight;
                var paddingT = isNaN(this._paddingTop) ? padding : this._paddingTop;
                var paddingB = isNaN(this._paddingBottom) ? padding : this._paddingBottom;
                var hPadding = paddingL + paddingR;
                var vPadding = paddingT + paddingB;
                this.target.measuredWidth = Math.ceil(measuredWidth + hPadding);
                this.target.measuredHeight = Math.ceil(measuredHeight + vPadding);
            };
            /**
             * 调整目标的元素的大小并定位这些元素
             * @param width {number}
             * @param height {number}
             */
            __egretProto__.updateDisplayList = function (width, height) {
                _super.prototype.updateDisplayList.call(this, width, height);
                if (!this.target)
                    return;
                if (this.target.numElements == 0) {
                    var padding = isNaN(this._padding) ? 0 : this._padding;
                    var paddingL = isNaN(this._paddingLeft) ? padding : this._paddingLeft;
                    var paddingR = isNaN(this._paddingRight) ? padding : this._paddingRight;
                    var paddingT = isNaN(this._paddingTop) ? padding : this._paddingTop;
                    var paddingB = isNaN(this._paddingBottom) ? padding : this._paddingBottom;
                    this.target.setContentSize(Math.ceil(paddingL + paddingR), Math.ceil(paddingT + paddingB));
                    return;
                }
                if (this.useVirtualLayout) {
                    this.updateDisplayListVirtual(width, height);
                }
                else {
                    this.updateDisplayListReal(width, height);
                }
            };
            /**
             * 获取指定索引的起始位置
             */
            __egretProto__.getStartPosition = function (index) {
                var padding = isNaN(this._padding) ? 0 : this._padding;
                var paddingT = isNaN(this._paddingTop) ? padding : this._paddingTop;
                var gap = isNaN(this._gap) ? 0 : this._gap;
                if (!this.useVirtualLayout) {
                    var element;
                    if (this.target) {
                        element = this.target.getElementAt(index);
                    }
                    return element ? element.y : paddingT;
                }
                var typicalHeight = this.typicalLayoutRect ? this.typicalLayoutRect.height : 22;
                var startPos = paddingT;
                for (var i = 0; i < index; i++) {
                    var eltHeight = this.elementSizeTable[i];
                    if (isNaN(eltHeight)) {
                        eltHeight = typicalHeight;
                    }
                    startPos += eltHeight + gap;
                }
                return startPos;
            };
            /**
             * 获取指定索引的元素尺寸
             */
            __egretProto__.getElementSize = function (index) {
                if (this.useVirtualLayout) {
                    var size = this.elementSizeTable[index];
                    if (isNaN(size)) {
                        size = this.typicalLayoutRect ? this.typicalLayoutRect.height : 22;
                    }
                    return size;
                }
                if (this.target) {
                    return this.target.getElementAt(index).height;
                }
                return 0;
            };
            /**
             * 获取缓存的子对象尺寸总和
             */
            __egretProto__.getElementTotalSize = function () {
                var gap = isNaN(this._gap) ? 0 : this._gap;
                var typicalHeight = this.typicalLayoutRect ? this.typicalLayoutRect.height : 22;
                var totalSize = 0;
                var length = this.target.numElements;
                for (var i = 0; i < length; i++) {
                    var eltHeight = this.elementSizeTable[i];
                    if (isNaN(eltHeight)) {
                        eltHeight = typicalHeight;
                    }
                    totalSize += eltHeight + gap;
                }
                totalSize -= gap;
                return totalSize;
            };
            /**
             * @param index {number}
             */
            __egretProto__.elementAdded = function (index) {
                _super.prototype.elementAdded.call(this, index);
                var typicalHeight = this.typicalLayoutRect ? this.typicalLayoutRect.height : 22;
                this.elementSizeTable.splice(index, 0, typicalHeight);
            };
            /**
             * @param index {number}
             */
            __egretProto__.elementRemoved = function (index) {
                _super.prototype.elementRemoved.call(this, index);
                this.elementSizeTable.splice(index, 1);
            };
            /**
             * 如果 useVirtualLayout 为 true，则当布局目标改变时，布局目标可以使用此方法来清除已缓存布局信息
             */
            __egretProto__.clearVirtualLayoutCache = function () {
                _super.prototype.clearVirtualLayoutCache.call(this);
                this.elementSizeTable = [];
                this.maxElementWidth = 0;
            };
            /**
             * 折半查找法寻找指定位置的显示对象索引
             */
            __egretProto__.findIndexAt = function (y, i0, i1) {
                var index = Math.floor((i0 + i1) * 0.5);
                var elementY = this.getStartPosition(index);
                var elementHeight = this.getElementSize(index);
                var gap = isNaN(this._gap) ? 0 : this._gap;
                if ((y >= elementY) && (y < elementY + elementHeight + gap))
                    return index;
                else if (i0 == i1)
                    return -1;
                else if (y < elementY)
                    return this.findIndexAt(y, i0, Math.max(i0, index - 1));
                else
                    return this.findIndexAt(y, Math.min(index + 1, i1), i1);
            };
            /**
             * verticalScrollPosition 或 horizontalScrollPosition 属性更改时调用
             */
            __egretProto__.scrollPositionChanged = function () {
                _super.prototype.scrollPositionChanged.call(this);
                if (this.useVirtualLayout) {
                    var changed = this.getIndexInView();
                    if (changed) {
                        this.indexInViewCalculated = true;
                        this.target.invalidateDisplayList();
                    }
                }
            };
            /**
             * 获取视图中第一个和最后一个元素的索引,返回是否发生改变
             */
            __egretProto__.getIndexInView = function () {
                if (!this.target || this.target.numElements == 0) {
                    this.startIndex = this.endIndex = -1;
                    return false;
                }
                if (isNaN(this.target.width) || this.target.width == 0 || isNaN(this.target.height) || this.target.height == 0) {
                    this.startIndex = this.endIndex = -1;
                    return false;
                }
                var padding = isNaN(this._padding) ? 0 : this._padding;
                var paddingT = isNaN(this._paddingTop) ? padding : this._paddingTop;
                var paddingB = isNaN(this._paddingBottom) ? padding : this._paddingBottom;
                var numElements = this.target.numElements;
                var contentHeight = this.getStartPosition(numElements - 1) + this.elementSizeTable[numElements - 1] + paddingB;
                var minVisibleY = this.target.verticalScrollPosition;
                if (minVisibleY > contentHeight - paddingB) {
                    this.startIndex = -1;
                    this.endIndex = -1;
                    return false;
                }
                var maxVisibleY = this.target.verticalScrollPosition + this.target.height;
                if (maxVisibleY < paddingT) {
                    this.startIndex = -1;
                    this.endIndex = -1;
                    return false;
                }
                var oldStartIndex = this.startIndex;
                var oldEndIndex = this.endIndex;
                this.startIndex = this.findIndexAt(minVisibleY, 0, numElements - 1);
                if (this.startIndex == -1)
                    this.startIndex = 0;
                this.endIndex = this.findIndexAt(maxVisibleY, 0, numElements - 1);
                if (this.endIndex == -1)
                    this.endIndex = numElements - 1;
                return oldStartIndex != this.startIndex || oldEndIndex != this.endIndex;
            };
            /**
             * 更新使用虚拟布局的显示列表
             */
            __egretProto__.updateDisplayListVirtual = function (width, height) {
                if (this.indexInViewCalculated)
                    this.indexInViewCalculated = false;
                else
                    this.getIndexInView();
                var padding = isNaN(this._padding) ? 0 : this._padding;
                var paddingL = isNaN(this._paddingLeft) ? padding : this._paddingLeft;
                var paddingR = isNaN(this._paddingRight) ? padding : this._paddingRight;
                var paddingB = isNaN(this._paddingBottom) ? padding : this._paddingBottom;
                var gap = isNaN(this._gap) ? 0 : this._gap;
                var contentHeight;
                var numElements = this.target.numElements;
                if (this.startIndex == -1 || this.endIndex == -1) {
                    contentHeight = this.getStartPosition(numElements) - gap + paddingB;
                    this.target.setContentSize(this.target.contentWidth, Math.ceil(contentHeight));
                    return;
                }
                this.target.setVirtualElementIndicesInView(this.startIndex, this.endIndex);
                //获取水平布局参数
                var justify = this._horizontalAlign == egret.HorizontalAlign.JUSTIFY || this._horizontalAlign == egret.HorizontalAlign.CONTENT_JUSTIFY;
                var contentJustify = this._horizontalAlign == egret.HorizontalAlign.CONTENT_JUSTIFY;
                var hAlign = 0;
                if (!justify) {
                    if (this._horizontalAlign == egret.HorizontalAlign.CENTER) {
                        hAlign = 0.5;
                    }
                    else if (this._horizontalAlign == egret.HorizontalAlign.RIGHT) {
                        hAlign = 1;
                    }
                }
                var targetWidth = Math.max(0, width - paddingL - paddingR);
                var justifyWidth = Math.ceil(targetWidth);
                var layoutElement;
                var typicalHeight = this.typicalLayoutRect ? this.typicalLayoutRect.height : 22;
                var typicalWidth = this.typicalLayoutRect ? this.typicalLayoutRect.width : 71;
                var oldMaxW = Math.max(typicalWidth, this.maxElementWidth);
                if (contentJustify) {
                    for (var index = this.startIndex; index <= this.endIndex; index++) {
                        layoutElement = (this.target.getVirtualElementAt(index));
                        if (!layoutElement || !layoutElement.includeInLayout)
                            continue;
                        this.maxElementWidth = Math.max(this.maxElementWidth, layoutElement.preferredWidth);
                    }
                    justifyWidth = Math.ceil(Math.max(targetWidth, this.maxElementWidth));
                }
                var x = 0;
                var y = 0;
                var contentWidth = 0;
                var oldElementSize;
                var needInvalidateSize = false;
                for (var i = this.startIndex; i <= this.endIndex; i++) {
                    var exceesWidth = 0;
                    layoutElement = (this.target.getVirtualElementAt(i));
                    if (!layoutElement) {
                        continue;
                    }
                    else if (!layoutElement.includeInLayout) {
                        this.elementSizeTable[i] = 0;
                        continue;
                    }
                    if (justify) {
                        x = paddingL;
                        layoutElement.setLayoutBoundsSize(justifyWidth, NaN);
                    }
                    else {
                        exceesWidth = (targetWidth - layoutElement.layoutBoundsWidth) * hAlign;
                        exceesWidth = exceesWidth > 0 ? exceesWidth : 0;
                        x = paddingL + exceesWidth;
                    }
                    if (!contentJustify)
                        this.maxElementWidth = Math.max(this.maxElementWidth, layoutElement.preferredWidth);
                    contentWidth = Math.max(contentWidth, layoutElement.layoutBoundsWidth);
                    if (!needInvalidateSize) {
                        oldElementSize = isNaN(this.elementSizeTable[i]) ? typicalHeight : this.elementSizeTable[i];
                        if (oldElementSize != layoutElement.layoutBoundsHeight)
                            needInvalidateSize = true;
                    }
                    if (i == 0 && this.elementSizeTable.length > 0 && this.elementSizeTable[i] != layoutElement.layoutBoundsHeight)
                        this.typicalLayoutRect = null;
                    this.elementSizeTable[i] = layoutElement.layoutBoundsHeight;
                    y = this.getStartPosition(i);
                    layoutElement.setLayoutBoundsPosition(Math.round(x), Math.round(y));
                }
                contentWidth += paddingL + paddingR;
                contentHeight = this.getStartPosition(numElements) - gap + paddingB;
                this.target.setContentSize(Math.ceil(contentWidth), Math.ceil(contentHeight));
                if (needInvalidateSize || oldMaxW < this.maxElementWidth) {
                    this.target.invalidateSize();
                }
            };
            /**
             * 更新使用真实布局的显示列表
             */
            __egretProto__.updateDisplayListReal = function (width, height) {
                var padding = isNaN(this._padding) ? 0 : this._padding;
                var paddingL = isNaN(this._paddingLeft) ? padding : this._paddingLeft;
                var paddingR = isNaN(this._paddingRight) ? padding : this._paddingRight;
                var paddingT = isNaN(this._paddingTop) ? padding : this._paddingTop;
                var paddingB = isNaN(this._paddingBottom) ? padding : this._paddingBottom;
                var gap = isNaN(this._gap) ? 0 : this._gap;
                var targetWidth = Math.max(0, width - paddingL - paddingR);
                var targetHeight = Math.max(0, height - paddingT - paddingB);
                // 获取水平布局参数
                var vJustify = this._verticalAlign == egret.VerticalAlign.JUSTIFY;
                var hJustify = this._horizontalAlign == egret.HorizontalAlign.JUSTIFY || this._horizontalAlign == egret.HorizontalAlign.CONTENT_JUSTIFY;
                var hAlign = 0;
                if (!hJustify) {
                    if (this._horizontalAlign == egret.HorizontalAlign.CENTER) {
                        hAlign = 0.5;
                    }
                    else if (this._horizontalAlign == egret.HorizontalAlign.RIGHT) {
                        hAlign = 1;
                    }
                }
                var count = this.target.numElements;
                var numElements = count;
                var x = paddingL;
                var y = paddingT;
                var i;
                var layoutElement;
                var totalPreferredHeight = 0;
                var totalPercentHeight = 0;
                var childInfoArray = [];
                var childInfo;
                var heightToDistribute = targetHeight;
                for (i = 0; i < count; i++) {
                    layoutElement = (this.target.getElementAt(i));
                    if (!layoutElement || !layoutElement.includeInLayout) {
                        numElements--;
                        continue;
                    }
                    this.maxElementWidth = Math.max(this.maxElementWidth, layoutElement.preferredWidth);
                    if (vJustify) {
                        totalPreferredHeight += layoutElement.preferredHeight;
                    }
                    else {
                        if (!isNaN(layoutElement.percentHeight)) {
                            totalPercentHeight += layoutElement.percentHeight;
                            childInfo = new ChildInfo();
                            childInfo.layoutElement = layoutElement;
                            childInfo.percent = layoutElement.percentHeight;
                            childInfo.min = layoutElement.minHeight;
                            childInfo.max = layoutElement.maxHeight;
                            childInfoArray.push(childInfo);
                        }
                        else {
                            heightToDistribute -= layoutElement.preferredHeight;
                        }
                    }
                }
                heightToDistribute -= (numElements - 1) * gap;
                heightToDistribute = heightToDistribute > 0 ? heightToDistribute : 0;
                var excessSpace = targetHeight - totalPreferredHeight - gap * (numElements - 1);
                var averageHeight;
                var largeChildrenCount = numElements;
                var heightDic = [];
                if (vJustify) {
                    if (excessSpace < 0) {
                        averageHeight = heightToDistribute / numElements;
                        for (i = 0; i < count; i++) {
                            layoutElement = this.target.getElementAt(i);
                            if (!layoutElement || !layoutElement.includeInLayout)
                                continue;
                            var preferredHeight = layoutElement.preferredHeight;
                            if (preferredHeight <= averageHeight) {
                                heightToDistribute -= preferredHeight;
                                largeChildrenCount--;
                                continue;
                            }
                        }
                        heightToDistribute = heightToDistribute > 0 ? heightToDistribute : 0;
                    }
                }
                else {
                    if (totalPercentHeight > 0) {
                        VerticalLayout.flexChildrenProportionally(targetHeight, heightToDistribute, totalPercentHeight, childInfoArray);
                        var roundOff = 0;
                        var length = childInfoArray.length;
                        for (i = 0; i < length; i++) {
                            childInfo = childInfoArray[i];
                            var childSize = Math.round(childInfo.size + roundOff);
                            roundOff += childInfo.size - childSize;
                            heightDic[childInfo.layoutElement.hashCode] = childSize;
                            heightToDistribute -= childSize;
                        }
                        heightToDistribute = heightToDistribute > 0 ? heightToDistribute : 0;
                    }
                }
                if (this._verticalAlign == egret.VerticalAlign.MIDDLE) {
                    y = paddingT + heightToDistribute * 0.5;
                }
                else if (this._verticalAlign == egret.VerticalAlign.BOTTOM) {
                    y = paddingT + heightToDistribute;
                }
                //开始对所有元素布局
                var maxX = paddingL;
                var maxY = paddingT;
                var dx = 0;
                var dy = 0;
                var justifyWidth = Math.ceil(targetWidth);
                if (this._horizontalAlign == egret.HorizontalAlign.CONTENT_JUSTIFY)
                    justifyWidth = Math.ceil(Math.max(targetWidth, this.maxElementWidth));
                roundOff = 0;
                var layoutElementHeight = NaN;
                var childHeight;
                for (i = 0; i < count; i++) {
                    var exceesWidth = 0;
                    layoutElement = (this.target.getElementAt(i));
                    if (!layoutElement || !layoutElement.includeInLayout)
                        continue;
                    layoutElementHeight = NaN;
                    if (vJustify) {
                        childHeight = NaN;
                        if (excessSpace > 0) {
                            childHeight = heightToDistribute * layoutElement.preferredHeight / totalPreferredHeight;
                        }
                        else if (excessSpace < 0 && layoutElement.preferredHeight > averageHeight) {
                            childHeight = heightToDistribute / largeChildrenCount;
                        }
                        if (!isNaN(childHeight)) {
                            layoutElementHeight = Math.round(childHeight + roundOff);
                            roundOff += childHeight - layoutElementHeight;
                        }
                    }
                    else {
                        layoutElementHeight = heightDic[layoutElement.hashCode];
                    }
                    if (hJustify) {
                        x = paddingL;
                        layoutElement.setLayoutBoundsSize(justifyWidth, layoutElementHeight);
                    }
                    else {
                        var layoutElementWidth = NaN;
                        if (!isNaN(layoutElement.percentWidth)) {
                            var percent = Math.min(100, layoutElement.percentWidth);
                            layoutElementWidth = Math.round(targetWidth * percent * 0.01);
                        }
                        layoutElement.setLayoutBoundsSize(layoutElementWidth, layoutElementHeight);
                        exceesWidth = (targetWidth - layoutElement.layoutBoundsWidth) * hAlign;
                        exceesWidth = exceesWidth > 0 ? exceesWidth : 0;
                        x = paddingL + exceesWidth;
                    }
                    layoutElement.setLayoutBoundsPosition(Math.round(x), Math.round(y));
                    dx = Math.ceil(layoutElement.layoutBoundsWidth);
                    dy = Math.ceil(layoutElement.layoutBoundsHeight);
                    maxX = Math.max(maxX, x + dx);
                    maxY = Math.max(maxY, y + dy);
                    y += dy + gap;
                }
                this.target.setContentSize(Math.ceil(maxX + paddingR), Math.ceil(maxY + paddingB));
            };
            /**
             * 为每个可变尺寸的子项分配空白区域
             * @method egret.gui.VerticalLayout.flexChildrenProportionally
             * @param spaceForChildren {number}
             * @param spaceToDistribute {number}
             * @param totalPercent {number}
             * @param childInfoArray {Array<any>}
             */
            VerticalLayout.flexChildrenProportionally = function (spaceForChildren, spaceToDistribute, totalPercent, childInfoArray) {
                var numChildren = childInfoArray.length;
                var done;
                do {
                    done = true;
                    var unused = spaceToDistribute - (spaceForChildren * totalPercent / 100);
                    if (unused > 0)
                        spaceToDistribute -= unused;
                    else
                        unused = 0;
                    var spacePerPercent = spaceToDistribute / totalPercent;
                    for (var i = 0; i < numChildren; i++) {
                        var childInfo = childInfoArray[i];
                        var size = childInfo.percent * spacePerPercent;
                        if (size < childInfo.min) {
                            var min = childInfo.min;
                            childInfo.size = min;
                            childInfoArray[i] = childInfoArray[--numChildren];
                            childInfoArray[numChildren] = childInfo;
                            totalPercent -= childInfo.percent;
                            if (unused >= min) {
                                unused -= min;
                            }
                            else {
                                spaceToDistribute -= min - unused;
                                unused = 0;
                            }
                            done = false;
                            break;
                        }
                        else if (size > childInfo.max) {
                            var max = childInfo.max;
                            childInfo.size = max;
                            childInfoArray[i] = childInfoArray[--numChildren];
                            childInfoArray[numChildren] = childInfo;
                            totalPercent -= childInfo.percent;
                            if (unused >= max) {
                                unused -= max;
                            }
                            else {
                                spaceToDistribute -= max - unused;
                                unused = 0;
                            }
                            done = false;
                            break;
                        }
                        else {
                            childInfo.size = size;
                        }
                    }
                } while (!done);
            };
            return VerticalLayout;
        })(gui.LayoutBase);
        gui.VerticalLayout = VerticalLayout;
        VerticalLayout.prototype.__class__ = "egret.gui.VerticalLayout";
        var ChildInfo = (function () {
            function ChildInfo() {
                /**
                 * @member egret.ChildInfo#layoutElement
                 */
                this.layoutElement = null;
                /**
                 * @member egret.ChildInfo#size
                 */
                this.size = 0;
                /**
                 * @member egret.ChildInfo#percent
                 */
                this.percent = NaN;
                /**
                 * @member egret.ChildInfo#min
                 */
                this.min = NaN;
                /**
                 * @member egret.ChildInfo#max
                 */
                this.max = NaN;
            }
            var __egretProto__ = ChildInfo.prototype;
            return ChildInfo;
        })();
        ChildInfo.prototype.__class__ = "egret.gui.ChildInfo";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
