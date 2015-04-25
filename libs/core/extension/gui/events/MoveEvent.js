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
         * @class egret.gui.MoveEvent
         * @classdesc
         * 移动事件
         * @extends egret.Event
         */
        var MoveEvent = (function (_super) {
            __extends(MoveEvent, _super);
            /**
             * @method egret.gui.MoveEvent#constructor
             * @param type {string}
             * @param oldX {number}
             * @param oldY {number}
             * @param bubbles {boolean}
             * @param cancelable {boolean}
             */
            function MoveEvent(type, oldX, oldY, bubbles, cancelable) {
                if (oldX === void 0) { oldX = NaN; }
                if (oldY === void 0) { oldY = NaN; }
                if (bubbles === void 0) { bubbles = false; }
                if (cancelable === void 0) { cancelable = false; }
                _super.call(this, type, bubbles, cancelable);
                /**
                 * 旧的组件X
                 * @member egret.gui.MoveEvent#oldX
                 */
                this.oldX = NaN;
                /**
                 * 旧的组件Y
                 * @member egret.gui.MoveEvent#oldY
                 */
                this.oldY = NaN;
                this.oldX = oldX;
                this.oldY = oldY;
            }
            var __egretProto__ = MoveEvent.prototype;
            /**
             * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
             * @method egret.gui.MoveEvent.dispatchMoveEvent
             */
            MoveEvent.dispatchMoveEvent = function (target, oldX, oldY) {
                if (oldX === void 0) { oldX = NaN; }
                if (oldY === void 0) { oldY = NaN; }
                var eventClass = MoveEvent;
                var props = egret.Event._getPropertyData(eventClass);
                props.oldX = oldX;
                props.oldY = oldY;
                egret.Event._dispatchByTarget(eventClass, target, MoveEvent.MOVE, props);
            };
            /**
             * @constant egret.gui.MoveEvent.MOVE
             */
            MoveEvent.MOVE = "move";
            return MoveEvent;
        })(egret.Event);
        gui.MoveEvent = MoveEvent;
        MoveEvent.prototype.__class__ = "egret.gui.MoveEvent";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
