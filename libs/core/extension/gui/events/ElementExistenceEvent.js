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
         * @class egret.gui.ElementExistenceEvent
         * @classdesc
         * Group添加或移除元素时分派的事件。
         * @extends egret.Event
         */
        var ElementExistenceEvent = (function (_super) {
            __extends(ElementExistenceEvent, _super);
            /**
             * @member egret.gui.ElementExistenceEvent#constructor
             */
            function ElementExistenceEvent(type, bubbles, cancelable, element, index) {
                if (bubbles === void 0) { bubbles = false; }
                if (cancelable === void 0) { cancelable = false; }
                if (element === void 0) { element = null; }
                if (index === void 0) { index = -1; }
                _super.call(this, type, bubbles, cancelable);
                /**
                 * 指向已添加或删除元素的位置的索引。
                 * @member egret.gui.ElementExistenceEvent#index
                 */
                this.index = NaN;
                /**
                 * 对已添加或删除的视觉元素的引用。
                 * @member egret.gui.ElementExistenceEvent#element
                 */
                this.element = null;
                this.element = element;
                this.index = index;
            }
            var __egretProto__ = ElementExistenceEvent.prototype;
            /**
             * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
             * @method egret.gui.ElementExistenceEvent.dispatchElementExistenceEvent
             */
            ElementExistenceEvent.dispatchElementExistenceEvent = function (target, type, element, index) {
                if (element === void 0) { element = null; }
                if (index === void 0) { index = -1; }
                var eventClass = ElementExistenceEvent;
                var props = egret.Event._getPropertyData(eventClass);
                props.element = element;
                props.index = index;
                egret.Event._dispatchByTarget(eventClass, target, type, props);
            };
            /**
             * 元素添加
             * @constant egret.gui.ElementExistenceEvent.ELEMENT_ADD
             */
            ElementExistenceEvent.ELEMENT_ADD = "elementAdd";
            /**
             * 元素移除
             * @constant egret.gui.ElementExistenceEvent.ELEMENT_REMOVE
             */
            ElementExistenceEvent.ELEMENT_REMOVE = "elementRemove";
            return ElementExistenceEvent;
        })(egret.Event);
        gui.ElementExistenceEvent = ElementExistenceEvent;
        ElementExistenceEvent.prototype.__class__ = "egret.gui.ElementExistenceEvent";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
