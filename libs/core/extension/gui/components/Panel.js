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
         * @class egret.gui.Panel
         * @classdesc
         * 带有标题，内容区域的面板组件
         * @extends egret.gui.SkinnableContainer
         */
        var Panel = (function (_super) {
            __extends(Panel, _super);
            /**
             * 构造函数
             * @method egret.gui.Panel#constructor
             */
            function Panel() {
                _super.call(this);
                /**
                 * [SkinPart]标题显示对象
                 * @member egret.gui.Panel#titleDisplay
                 */
                this.titleDisplay = null;
                this._title = "";
                /**
                 * 标题内容改变
                 */
                this.titleChanged = false;
                this.touchEnabled = false;
            }
            var __egretProto__ = Panel.prototype;
            Object.defineProperty(__egretProto__, "title", {
                /**
                 * 标题文本内容
                 * @member egret.gui.Panel#title
                 */
                get: function () {
                    return this._title;
                },
                set: function (value) {
                    this._title = value;
                    if (this.titleDisplay)
                        this.titleDisplay.text = this.title;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * [覆盖] 添加外观部件时调用
             * @param partName
             * @param instance
             */
            __egretProto__.partAdded = function (partName, instance) {
                _super.prototype.partAdded.call(this, partName, instance);
                if (instance == this.titleDisplay) {
                    this.titleDisplay.text = this.title;
                }
            };
            return Panel;
        })(gui.SkinnableContainer);
        gui.Panel = Panel;
        Panel.prototype.__class__ = "egret.gui.Panel";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
