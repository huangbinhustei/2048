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
         * TextInput 是一个文本输入控件，供用户输入和编辑单行统一格式文本
         * @classic
         */
        var TextInput = (function (_super) {
            __extends(TextInput, _super);
            /**
             * 构造函数
             */
            function TextInput() {
                _super.call(this);
            }
            var __egretProto__ = TextInput.prototype;
            Object.defineProperty(__egretProto__, "widthInChars", {
                /**
                 * 控件的默认宽度（使用字号：size为单位测量）。 若同时设置了maxChars属性，将会根据两者测量结果的最小值作为测量宽度。
                 */
                get: function () {
                    return _super.prototype._getWidthInChars.call(this);
                },
                set: function (value) {
                    _super.prototype._setWidthInChars.call(this, value);
                },
                enumerable: true,
                configurable: true
            });
            __egretProto__._setText = function (value) {
                _super.prototype._setText.call(this, value);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            };
            /**
             * 添加外观部件时调用
             * @inheritDoc
             */
            __egretProto__.partAdded = function (partName, instance) {
                _super.prototype.partAdded.call(this, partName, instance);
                if (instance == this.textDisplay) {
                    this.textDisplay.multiline = false;
                }
            };
            /**
             *  创建外观部件的引用
             * @inheritDoc
             */
            __egretProto__.createSkinParts = function () {
                this.textDisplay = new gui.EditableText();
                this.textDisplay.widthInChars = 10;
                this.textDisplay.multiline = false;
                this.textDisplay.left = 1;
                this.textDisplay.right = 1;
                this.textDisplay.top = 1;
                this.textDisplay.bottom = 1;
                this._addToDisplayList((this.textDisplay));
                this.partAdded("textDisplay", this.textDisplay);
            };
            return TextInput;
        })(gui.SkinnableTextBase);
        gui.TextInput = TextInput;
        TextInput.prototype.__class__ = "egret.gui.TextInput";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
