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
         *
         */
        var EditableText = (function (_super) {
            __extends(EditableText, _super);
            function EditableText() {
                _super.call(this);
                this._selectable = true;
                this._displayAsPassword = false;
                this.displayAsPasswordChanged = true;
                this.pendingEditable = true;
                this._editable = true;
                this.editableChanged = false;
                this._maxChars = 0;
                this.maxCharsChanged = false;
                this._multiline = true;
                this.multilineChanged = false;
                this._restrict = null;
                this.restrictChanged = false;
                this._heightInLines = NaN;
                this.heightInLinesChanged = false;
                this._widthInChars = NaN;
                this.widthInCharsChanged = false;
                this._contentWidth = 0;
                this._contentHeight = 0;
                this._horizontalScrollPosition = 0;
                this._verticalScrollPosition = 0;
                this._clipAndEnableScrolling = false;
                /**
                 * heightInLines计算出来的默认高度。
                 */
                this.defaultHeight = NaN;
                /**
                 * widthInChars计算出来的默认宽度。
                 */
                this.defaultWidth = NaN;
                this.isValidating = false;
                this.selectable = true;
            }
            var __egretProto__ = EditableText.prototype;
            Object.defineProperty(__egretProto__, "selectable", {
                get: function () {
                    return this._selectable;
                },
                set: function (value) {
                    this._selectable = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "displayAsPassword", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    return this._displayAsPassword;
                },
                set: function (value) {
                    if (value == this._displayAsPassword)
                        return;
                    this._displayAsPassword = value;
                    this.displayAsPasswordChanged = true;
                    this.invalidateProperties();
                    this.invalidateSize();
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "editable", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (this._enabled)
                        return this._editable;
                    return this.pendingEditable;
                },
                set: function (value) {
                    if (this._editable == value)
                        return;
                    if (this._enabled) {
                        this._editable = value;
                        this.editableChanged = true;
                        this.invalidateProperties();
                    }
                    else {
                        this.pendingEditable = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "enabled", {
                get: function () {
                    return this._editable;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (value == this._enabled)
                        return;
                    this._enabled = value;
                    if (this._enabled) {
                        if (this._editable != this.pendingEditable)
                            this.editableChanged = true;
                        this._editable = this.pendingEditable;
                    }
                    else {
                        if (this.editable)
                            this.editableChanged = true;
                        this.pendingEditable = this._editable;
                        this._editable = false;
                    }
                    this.invalidateProperties();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "maxChars", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    return this._maxChars;
                },
                set: function (value) {
                    if (value === undefined)
                        value = 0;
                    if (value == this._maxChars)
                        return;
                    this._maxChars = value;
                    this.maxCharsChanged = true;
                    this.invalidateProperties();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "multiline", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    return this._multiline;
                },
                set: function (value) {
                    if (value == this.multiline)
                        return;
                    this._multiline = value;
                    this.multilineChanged = true;
                    this.invalidateProperties();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "restrict", {
                /**
                 * @deprecated
                 * TextFiled里还没实现这个接口，等实现之后再去掉废弃标志。目前暂时不要使用它。
                 */
                get: function () {
                    return this._restrict;
                },
                set: function (value) {
                    if (value == this._restrict)
                        return;
                    this._restrict = value;
                    this.restrictChanged = true;
                    this.invalidateProperties();
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__.styleChanged = function (styleProp) {
                _super.prototype.styleChanged.call(this, styleProp);
                if (!styleProp || styleProp == "size") {
                    this.heightInLinesChanged = true;
                    this.widthInCharsChanged = true;
                }
            };
            __egretProto__._setLineSpacing = function (value) {
                if (this._lineSpacing == value)
                    return;
                _super.prototype._setLineSpacing.call(this, value);
                this.heightInLinesChanged = true;
            };
            Object.defineProperty(__egretProto__, "heightInLines", {
                /**
                 * 控件的默认高度（以行为单位测量）。 若设置了multiline属性为false，则忽略此属性。
                 */
                get: function () {
                    return this._heightInLines;
                },
                set: function (value) {
                    if (this._heightInLines == value)
                        return;
                    this._heightInLines = value;
                    this.heightInLinesChanged = true;
                    this.invalidateProperties();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "widthInChars", {
                /**
                 * 控件的默认宽度（使用字号：size为单位测量）。 若同时设置了maxChars属性，将会根据两者测量结果的最小值作为测量宽度。
                 */
                get: function () {
                    return this._widthInChars;
                },
                set: function (value) {
                    if (this._widthInChars == value)
                        return;
                    this._widthInChars = value;
                    this.widthInCharsChanged = true;
                    this.invalidateProperties();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "contentWidth", {
                get: function () {
                    return this._contentWidth;
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__.setContentWidth = function (value) {
                if (value == this._contentWidth)
                    return;
                var oldValue = this._contentWidth;
                this._contentWidth = value;
                this.dispatchPropertyChangeEvent("contentWidth", oldValue, value);
            };
            Object.defineProperty(__egretProto__, "contentHeight", {
                get: function () {
                    return this._contentHeight;
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__.setContentHeight = function (value) {
                if (value == this._contentHeight)
                    return;
                var oldValue = this._contentHeight;
                this._contentHeight = value;
                this.dispatchPropertyChangeEvent("contentHeight", oldValue, value);
            };
            Object.defineProperty(__egretProto__, "horizontalScrollPosition", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    return this._horizontalScrollPosition;
                },
                set: function (value) {
                    if (this._horizontalScrollPosition == value)
                        return;
                    this._horizontalScrollPosition = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "verticalScrollPosition", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    return this._verticalScrollPosition;
                },
                set: function (value) {
                    if (this._verticalScrollPosition == value)
                        return;
                    value = Math.round(value);
                    this._verticalScrollPosition = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 根据垂直像素位置获取对应的垂直滚动位置
             */
            __egretProto__.getScrollVByVertitcalPos = function (value) {
                if (this._textField.numLines == 0)
                    return 1;
                var lineHeight = this._textField._getLineHeight();
                var offsetHeight = (this.height - 4) % lineHeight;
                if (this._textField.height + offsetHeight - this.height == value) {
                    return this._textField.maxScrollV;
                }
                return parseInt(((value - 2) / lineHeight)) + 1;
            };
            /**
             * 根据垂直滚动位置获取对应的垂直像位置
             */
            __egretProto__.getVerticalPosByScrollV = function (scrollV) {
                if (scrollV === void 0) { scrollV = 0; }
                if (scrollV == 1 || this._textField.numLines == 0)
                    return 0;
                var lineHeight = this._textField._getLineHeight();
                if (scrollV == this._textField.maxScrollV) {
                    var offsetHeight = (this.height - 4) % lineHeight;
                    return this._textField.height + offsetHeight - this.height;
                }
                return lineHeight * (scrollV - 1) + 2;
            };
            /**
             * @inheritDoc
             */
            __egretProto__.getHorizontalScrollPositionDelta = function (navigationUnit) {
                if (navigationUnit === void 0) { navigationUnit = 0; }
                var delta = 0;
                var maxDelta = this._contentWidth - this._horizontalScrollPosition - this.width;
                var minDelta = -this._horizontalScrollPosition;
                switch (navigationUnit) {
                    case gui.NavigationUnit.LEFT:
                        delta = this._horizontalScrollPosition <= 0 ? 0 : Math.max(minDelta, -this.size);
                        break;
                    case gui.NavigationUnit.RIGHT:
                        delta = (this._horizontalScrollPosition + this.width >= this.contentWidth) ? 0 : Math.min(maxDelta, this.size);
                        break;
                    case gui.NavigationUnit.PAGE_LEFT:
                        delta = Math.max(minDelta, -this.width);
                        break;
                    case gui.NavigationUnit.PAGE_RIGHT:
                        delta = Math.min(maxDelta, this.width);
                        break;
                    case gui.NavigationUnit.HOME:
                        delta = minDelta;
                        break;
                    case gui.NavigationUnit.END:
                        delta = maxDelta;
                        break;
                }
                return delta;
            };
            /**
             * @inheritDoc
             */
            __egretProto__.getVerticalScrollPositionDelta = function (navigationUnit) {
                if (navigationUnit === void 0) { navigationUnit = 0; }
                var delta = 0;
                var maxDelta = this._contentHeight - this._verticalScrollPosition - this.height;
                var minDelta = -this._verticalScrollPosition;
                switch (navigationUnit) {
                    case gui.NavigationUnit.UP:
                        delta = this.getVScrollDelta(-1);
                        break;
                    case gui.NavigationUnit.DOWN:
                        delta = this.getVScrollDelta(1);
                        break;
                    case gui.NavigationUnit.PAGE_UP:
                        delta = Math.max(minDelta, -this.width);
                        break;
                    case gui.NavigationUnit.PAGE_DOWN:
                        delta = Math.min(maxDelta, this.width);
                        break;
                    case gui.NavigationUnit.HOME:
                        delta = minDelta;
                        break;
                    case gui.NavigationUnit.END:
                        delta = maxDelta;
                        break;
                }
                return delta;
            };
            /**
             * 返回指定偏移行数的滚动条偏移量
             */
            __egretProto__.getVScrollDelta = function (offsetLine) {
                if (offsetLine === void 0) { offsetLine = 0; }
                if (!this._textField)
                    return 0;
                var currentScrollV = this.getScrollVByVertitcalPos(this._verticalScrollPosition);
                var scrollV = currentScrollV + offsetLine;
                scrollV = Math.max(1, Math.min(this._textField.maxScrollV, scrollV));
                var startPos = this.getVerticalPosByScrollV(scrollV);
                var delta = startPos - this._verticalScrollPosition;
                return delta;
            };
            Object.defineProperty(__egretProto__, "clipAndEnableScrolling", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    return this._clipAndEnableScrolling;
                },
                set: function (value) {
                    if (this._clipAndEnableScrolling == value)
                        return;
                    this._clipAndEnableScrolling = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 处理对组件设置的属性
             * @inheritDoc
             */
            __egretProto__.commitProperties = function () {
                if (!this._textField) {
                    this.editableChanged = true;
                    this.displayAsPasswordChanged = true;
                    this.maxCharsChanged = true;
                    this.multilineChanged = true;
                    this.restrictChanged = true;
                }
                _super.prototype.commitProperties.call(this);
                if (this.editableChanged) {
                    this._textField.type = this._editable ? egret.TextFieldType.INPUT : egret.TextFieldType.DYNAMIC;
                    this.editableChanged = false;
                }
                if (this.displayAsPasswordChanged) {
                    this._textField.displayAsPassword = this._displayAsPassword;
                    this.displayAsPasswordChanged = false;
                }
                if (this.maxCharsChanged) {
                    this._textField.maxChars = this._maxChars;
                    this.maxCharsChanged = false;
                }
                if (this.multilineChanged) {
                    this._textField.multiline = this._multiline;
                    //this._textField.wordWrap = this._multiline;
                    this.multilineChanged = false;
                }
                if (this.restrictChanged) {
                    //this._textField.restrict = this._restrict;
                    this.restrictChanged = false;
                }
                if (this.heightInLinesChanged) {
                    this.heightInLinesChanged = false;
                    if (isNaN(this._heightInLines)) {
                        this.defaultHeight = NaN;
                    }
                    else {
                        //todo:没有文字时的测量
                        var hInLine = parseInt(this.heightInLines);
                        var lineHeight = 22;
                        var properties = this._textField._properties;
                        if (properties._text.length > 0) {
                            lineHeight = this._textField._getLineHeight();
                        }
                        else {
                            properties._text = "M";
                            lineHeight = this._textField._getLineHeight();
                            properties._text = "";
                        }
                        this.defaultHeight = hInLine * lineHeight + 4;
                    }
                }
                if (this.widthInCharsChanged) {
                    this.widthInCharsChanged = false;
                    if (isNaN(this._widthInChars)) {
                        this.defaultWidth = NaN;
                    }
                    else {
                        var wInChars = parseInt(this._widthInChars);
                        this.defaultWidth = this.size * wInChars + 5;
                    }
                }
            };
            /**
             * 通过设置此容器子项的位置和大小来响应大小更改
             * @inheritDoc
             */
            __egretProto__.updateDisplayList = function (unscaledWidth, unscaledHeight) {
                this.isValidating = true;
                _super.prototype.updateDisplayList.call(this, unscaledWidth, unscaledHeight);
                this.updateContentSize();
                this.isValidating = false;
            };
            /**
             * 更新内容尺寸大小
             */
            __egretProto__.updateContentSize = function () {
                if (!this.clipAndEnableScrolling)
                    return;
                this.setContentWidth(this._textField.width);
                var contentHeight = 0;
                var numLines = this._textField.numLines;
                if (numLines == 0) {
                    contentHeight = 4;
                }
                else {
                    var lineHeight = this._textField._getLineHeight();
                    var offsetHeight = (this.height - 4) % lineHeight;
                    contentHeight = this._textField.height + offsetHeight;
                }
                this.setContentHeight(contentHeight);
            };
            Object.defineProperty(__egretProto__, "selectionBeginIndex", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    this.validateProperties();
                    if (this._textField)
                        return this._textField.selectionBeginIndex;
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "selectionEndIndex", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    this.validateProperties();
                    if (this._textField)
                        return this._textField.selectionEndIndex;
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(__egretProto__, "caretIndex", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    this.validateProperties();
                    if (this._textField)
                        return this._textField.caretIndex;
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            __egretProto__.setSelection = function (beginIndex, endIndex) {
                if (endIndex === void 0) { endIndex = 0; }
                this.validateProperties();
                if (this._textField) {
                    this._textField._setSelection(beginIndex, endIndex);
                }
            };
            /**
             * @inheritDoc
             */
            __egretProto__.selectAll = function () {
                this.validateProperties();
                if (this._textField) {
                    this._textField._setSelection(0, this._textField.text.length);
                }
            };
            /**
             * 计算  容器默认大小的最小值和最大值
             * @inheritDoc
             */
            __egretProto__.measure = function () {
                this.measuredWidth = isNaN(this.defaultWidth) ? gui.TextBase.DEFAULT_MEASURED_WIDTH : this.defaultWidth;
                if (this._maxChars != 0) {
                    this.measuredWidth = Math.min(this.measuredWidth, this._textField.width);
                }
                if (this._multiline) {
                    this.measuredHeight = isNaN(this.defaultHeight) ? gui.TextBase.DEFAULT_MEASURED_HEIGHT * 2 : this.defaultHeight;
                }
                else {
                    this.measuredHeight = this._textField.height;
                }
            };
            /**
             * 创建文本显示对象
             */
            __egretProto__._createTextField = function () {
                _super.prototype._createTextField.call(this);
                this._textField.type = this._editable ? egret.TextFieldType.INPUT : egret.TextFieldType.DYNAMIC;
                this._textField.multiline = this._multiline;
                //this._textField.wordWrap = this._multiline;
                this._textField.addEventListener(egret.Event.CHANGE, this.textField_changeHandler, this);
                this._textField.addEventListener("scroll", this.textField_scrollHandler, this); //todo:Scroll event
                this._textField.addEventListener("input", this.textField_textInputHandler, this);
            };
            __egretProto__.textField_changeHandler = function (event) {
                this._textFieldChanged();
                event.stopImmediatePropagation();
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                this.invalidateSize();
                this.invalidateDisplayList();
                this.updateContentSize();
            };
            /**
             *  @private
             */
            __egretProto__.textField_scrollHandler = function (event) {
            };
            /**
             * 即将输入文字
             */
            __egretProto__.textField_textInputHandler = function (event) {
                event.stopImmediatePropagation();
                var newEvent = new egret.Event(event.type, false, true);
                newEvent.data = event.data;
                this.dispatchEvent(newEvent);
                if (newEvent.isDefaultPrevented())
                    event.preventDefault();
            };
            return EditableText;
        })(gui.TextBase);
        gui.EditableText = EditableText;
        EditableText.prototype.__class__ = "egret.gui.EditableText";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
