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
         * @class egret.gui.RendererExistenceEvent
         * @classdesc
         * 在DataGroup添加或删除项呈示器时分派的事件。
         * @extends egret.Event
         */
        var RendererExistenceEvent = (function (_super) {
            __extends(RendererExistenceEvent, _super);
            /**
             * @method egret.gui.RendererExistenceEvent#constructor
             * @param type {string}
             * @param bubbles {boolean}
             * @param cancelable {boolean}
             * @param renderer {IItemRenderer}
             * @param index {number}
             * @param data {any}
             */
            function RendererExistenceEvent(type, bubbles, cancelable, renderer, index, data) {
                if (bubbles === void 0) { bubbles = false; }
                if (cancelable === void 0) { cancelable = false; }
                if (renderer === void 0) { renderer = null; }
                if (index === void 0) { index = -1; }
                if (data === void 0) { data = null; }
                _super.call(this, type, bubbles, cancelable);
                /**
                 * 呈示器的数据项目。
                 * @member egret.gui.RendererExistenceEvent#data
                 */
                this.data = null;
                /**
                 * 指向已添加或删除项呈示器的位置的索引。
                 * @member egret.gui.RendererExistenceEvent#index
                 */
                this.index = NaN;
                /**
                 * 对已添加或删除的项呈示器的引用。
                 * @member egret.gui.RendererExistenceEvent#renderer
                 */
                this.renderer = null;
                this.renderer = renderer;
                this.index = index;
                this.data = data;
            }
            var __egretProto__ = RendererExistenceEvent.prototype;
            /**
             * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
             * @method egret.gui.RendererExistenceEvent.dispatchRendererExistenceEvent
             */
            RendererExistenceEvent.dispatchRendererExistenceEvent = function (target, type, renderer, index, data) {
                if (renderer === void 0) { renderer = null; }
                if (index === void 0) { index = -1; }
                if (data === void 0) { data = null; }
                var eventClass = RendererExistenceEvent;
                var props = egret.Event._getPropertyData(eventClass);
                props.renderer = renderer;
                props.index = index;
                props.data = data;
                egret.Event._dispatchByTarget(eventClass, target, type, props);
            };
            /**
             * 添加了项呈示器
             * @constant egret.gui.RendererExistenceEvent.RENDERER_ADD
             */
            RendererExistenceEvent.RENDERER_ADD = "rendererAdd";
            /**
             * 移除了项呈示器
             * @constant egret.gui.RendererExistenceEvent.RENDERER_REMOVE
             */
            RendererExistenceEvent.RENDERER_REMOVE = "rendererRemove";
            return RendererExistenceEvent;
        })(egret.Event);
        gui.RendererExistenceEvent = RendererExistenceEvent;
        RendererExistenceEvent.prototype.__class__ = "egret.gui.RendererExistenceEvent";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
