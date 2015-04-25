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
         * @class egret.gui.PropertyChangeEvent
         * @classdesc
         * 对象的一个属性发生更改时传递到事件侦听器的事件
         * @extends egret.Event
         */
        var PropertyChangeEvent = (function (_super) {
            __extends(PropertyChangeEvent, _super);
            /**
             * 构造函数
             * @method egret.gui.PropertyChangeEvent#constructor
             * @param type {string}
             * @param bubbles {boolean}
             * @param cancelable {boolean}
             * @param kind {string}
             * @param property {any}
             * @param oldValue {any}
             * @param newValue {any}
             * @param source {any}
             */
            function PropertyChangeEvent(type, bubbles, cancelable, kind, property, oldValue, newValue, source) {
                if (bubbles === void 0) { bubbles = false; }
                if (cancelable === void 0) { cancelable = false; }
                if (kind === void 0) { kind = null; }
                if (property === void 0) { property = null; }
                if (oldValue === void 0) { oldValue = null; }
                if (newValue === void 0) { newValue = null; }
                if (source === void 0) { source = null; }
                _super.call(this, type, bubbles, cancelable);
                /**
                 * 指定更改的类型。可能的值为 PropertyChangeEventKind.UPDATE、PropertyChangeEventKind.DELETE 和 null。
                 * @member egret.gui.PropertyChangeEvent#kind
                 */
                this.kind = null;
                /**
                 * 更改后的属性的值。
                 * @member egret.gui.PropertyChangeEvent#newValue
                 */
                this.newValue = null;
                /**
                 * 更改后的属性的值。
                 * @member egret.gui.PropertyChangeEvent#oldValue
                 */
                this.oldValue = null;
                /**
                 * 指定已更改属性的 String、QName 或 int。
                 * @member egret.gui.PropertyChangeEvent#property
                 */
                this.property = null;
                /**
                 * 发生更改的对象。
                 * @member egret.gui.PropertyChangeEvent#source
                 */
                this.source = null;
                this.kind = kind;
                this.property = property;
                this.oldValue = oldValue;
                this.newValue = newValue;
                this.source = source;
            }
            var __egretProto__ = PropertyChangeEvent.prototype;
            /**
             * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
             * @method egret.gui.PropertyChangeEvent.dispatchPropertyChangeEvent
             */
            PropertyChangeEvent.dispatchPropertyChangeEvent = function (target, kind, property, oldValue, newValue, source) {
                if (kind === void 0) { kind = null; }
                if (property === void 0) { property = null; }
                if (oldValue === void 0) { oldValue = null; }
                if (newValue === void 0) { newValue = null; }
                if (source === void 0) { source = null; }
                var eventClass = PropertyChangeEvent;
                var props = egret.Event._getPropertyData(eventClass);
                props.kind = kind;
                props.property = property;
                props.oldValue = oldValue;
                props.newValue = newValue;
                props.source = source;
                egret.Event._dispatchByTarget(eventClass, target, PropertyChangeEvent.PROPERTY_CHANGE, props);
            };
            /**
             * 属性改变
             * @constant egret.gui.PropertyChangeEvent.PROPERTY_CHANGE
             */
            PropertyChangeEvent.PROPERTY_CHANGE = "propertyChange";
            return PropertyChangeEvent;
        })(egret.Event);
        gui.PropertyChangeEvent = PropertyChangeEvent;
        PropertyChangeEvent.prototype.__class__ = "egret.gui.PropertyChangeEvent";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
