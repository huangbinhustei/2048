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
         * @class egret.gui.PopUpPosition
         * @classdesc
         * 定义弹出位置的常量值。
         * 该常量决定目标对象相对于父级组件的弹出位置。
         */
        var PopUpPosition = (function () {
            function PopUpPosition() {
            }
            var __egretProto__ = PopUpPosition.prototype;
            /**
             * 在组件上方弹出
             * @constant egret.gui.PopUpPosition.ABOVE
             */
            PopUpPosition.ABOVE = "above";
            /**
             * 在组件下方弹出
             * @constant egret.gui.PopUpPosition.BELOW
             */
            PopUpPosition.BELOW = "below";
            /**
             * 在组件中心弹出
             * @constant egret.gui.PopUpPosition.CENTER
             */
            PopUpPosition.CENTER = "center";
            /**
             * 在组件左上角弹出
             * @constant egret.gui.PopUpPosition.TOP_LEFT
             */
            PopUpPosition.TOP_LEFT = "topLeft";
            /**
             * 在组件左边弹出
             * @constant egret.gui.PopUpPosition.LEFT
             */
            PopUpPosition.LEFT = "left";
            /**
             * 在组件右边弹出
             * @constant egret.gui.PopUpPosition.RIGHT
             */
            PopUpPosition.RIGHT = "right";
            /**
             * 在屏幕中心弹出
             * @constant egret.gui.PopUpPosition.SCREEN_CENTER
             */
            PopUpPosition.SCREEN_CENTER = "screenCenter";
            return PopUpPosition;
        })();
        gui.PopUpPosition = PopUpPosition;
        PopUpPosition.prototype.__class__ = "egret.gui.PopUpPosition";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
