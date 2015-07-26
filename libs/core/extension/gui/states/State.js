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
         * @class egret.gui.State
         * @classdesc
         * State 类定义视图状态，即组件的特定视图。
         * @extends egret.HashObject
         */
        var State = (function (_super) {
            __extends(State, _super);
            /**
             * @method egret.gui.State#constructor
             * @param properties {any}
             */
            function State(name, overrides) {
                _super.call(this);
                /**
                 * 已经初始化标志
                 */
                this.initialized = false;
                /**
                 * 视图状态的名称。给定组件的状态名称必须唯一。必须设置此属性。
                 * @member egret.gui.State#name
                 */
                this.name = null;
                this.name = name;
                this.overrides = overrides;
            }
            var __egretProto__ = State.prototype;
            /**
             * 初始化视图
             * @method egret.gui.State#initialize
             * @param parent {IStateClient}
             */
            __egretProto__.initialize = function (parent) {
                if (!this.initialized) {
                    this.initialized = true;
                    for (var i = 0; i < this.overrides.length; i++) {
                        (this.overrides[i]).initialize(parent);
                    }
                }
            };
            return State;
        })(egret.HashObject);
        gui.State = State;
        State.prototype.__class__ = "egret.gui.State";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
