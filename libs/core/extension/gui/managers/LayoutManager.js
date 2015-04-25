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
         * @class egret.gui.LayoutManager
         * @classdesc
         * 布局管理器
         * @extends egret.EventDispatcher
         */
        var LayoutManager = (function (_super) {
            __extends(LayoutManager, _super);
            /**
             * @method egret.gui.LayoutManager#constructor
             */
            function LayoutManager() {
                _super.call(this);
                this.targetLevel = Number.MAX_VALUE;
                /**
                 * 需要抛出组件初始化完成事件的对象
                 */
                this.updateCompleteQueue = new gui.DepthQueue();
                this.invalidatePropertiesFlag = false;
                this.invalidateClientPropertiesFlag = false;
                this.invalidatePropertiesQueue = new gui.DepthQueue();
                this.invalidateSizeFlag = false;
                this.invalidateClientSizeFlag = false;
                this.invalidateSizeQueue = new gui.DepthQueue();
                this.invalidateDisplayListFlag = false;
                this.invalidateDisplayListQueue = new gui.DepthQueue();
                /**
                 * 是否已经添加了事件监听
                 */
                this.listenersAttached = false;
            }
            var __egretProto__ = LayoutManager.prototype;
            /**
             * 标记组件提交过属性
             * @method egret.gui.LayoutManager#invalidateProperties
             * @param client {ILayoutManagerClient}
             */
            __egretProto__.invalidateProperties = function (client) {
                if (!this.invalidatePropertiesFlag) {
                    this.invalidatePropertiesFlag = true;
                    if (!this.listenersAttached)
                        this.attachListeners();
                }
                if (this.targetLevel <= client.nestLevel)
                    this.invalidateClientPropertiesFlag = true;
                this.invalidatePropertiesQueue.insert(client);
            };
            /**
             * 使提交的属性生效
             */
            __egretProto__.validateProperties = function () {
                var client = this.invalidatePropertiesQueue.shift();
                while (client) {
                    if (client.parent) {
                        client.validateProperties();
                        if (!client.updateCompletePendingFlag) {
                            this.updateCompleteQueue.insert(client);
                            client.updateCompletePendingFlag = true;
                        }
                    }
                    client = this.invalidatePropertiesQueue.shift();
                }
                if (this.invalidatePropertiesQueue.isEmpty())
                    this.invalidatePropertiesFlag = false;
            };
            /**
             * 标记需要重新测量尺寸
             * @method egret.gui.LayoutManager#invalidateSize
             * @param client {ILayoutManagerClient}
             */
            __egretProto__.invalidateSize = function (client) {
                if (!this.invalidateSizeFlag) {
                    this.invalidateSizeFlag = true;
                    if (!this.listenersAttached)
                        this.attachListeners();
                }
                if (this.targetLevel <= client.nestLevel)
                    this.invalidateClientSizeFlag = true;
                this.invalidateSizeQueue.insert(client);
            };
            /**
             * 测量属性
             */
            __egretProto__.validateSize = function () {
                var client = this.invalidateSizeQueue.pop();
                while (client) {
                    if (client.parent) {
                        client.validateSize();
                        if (!client.updateCompletePendingFlag) {
                            this.updateCompleteQueue.insert(client);
                            client.updateCompletePendingFlag = true;
                        }
                    }
                    client = this.invalidateSizeQueue.pop();
                }
                if (this.invalidateSizeQueue.isEmpty())
                    this.invalidateSizeFlag = false;
            };
            /**
             * 标记需要重新测量尺寸
             * @method egret.gui.LayoutManager#invalidateDisplayList
             * @param client {ILayoutManagerClient}
             */
            __egretProto__.invalidateDisplayList = function (client) {
                if (!this.invalidateDisplayListFlag) {
                    this.invalidateDisplayListFlag = true;
                    if (!this.listenersAttached)
                        this.attachListeners();
                }
                this.invalidateDisplayListQueue.insert(client);
            };
            /**
             * 测量属性
             */
            __egretProto__.validateDisplayList = function () {
                var client = this.invalidateDisplayListQueue.shift();
                while (client) {
                    if (client.parent) {
                        client.validateDisplayList();
                        if (!client.updateCompletePendingFlag) {
                            this.updateCompleteQueue.insert(client);
                            client.updateCompletePendingFlag = true;
                        }
                    }
                    client = this.invalidateDisplayListQueue.shift();
                }
                if (this.invalidateDisplayListQueue.isEmpty())
                    this.invalidateDisplayListFlag = false;
            };
            /**
             * 添加事件监听
             */
            __egretProto__.attachListeners = function () {
                gui.UIGlobals.stage.addEventListener(egret.Event.ENTER_FRAME, this.doPhasedInstantiationCallBack, this);
                gui.UIGlobals.stage.addEventListener(egret.Event.RENDER, this.doPhasedInstantiationCallBack, this);
                gui.UIGlobals.stage.invalidate();
                this.listenersAttached = true;
            };
            /**
             * 执行属性应用
             */
            __egretProto__.doPhasedInstantiationCallBack = function (event) {
                if (event === void 0) { event = null; }
                gui.UIGlobals.stage.removeEventListener(egret.Event.ENTER_FRAME, this.doPhasedInstantiationCallBack, this);
                gui.UIGlobals.stage.removeEventListener(egret.Event.RENDER, this.doPhasedInstantiationCallBack, this);
                this.doPhasedInstantiation();
            };
            __egretProto__.doPhasedInstantiation = function () {
                if (this.invalidatePropertiesFlag) {
                    this.validateProperties();
                }
                if (this.invalidateSizeFlag) {
                    this.validateSize();
                }
                if (this.invalidateDisplayListFlag) {
                    this.validateDisplayList();
                }
                if (this.invalidatePropertiesFlag || this.invalidateSizeFlag || this.invalidateDisplayListFlag) {
                    this.attachListeners();
                }
                else {
                    this.listenersAttached = false;
                    var client = this.updateCompleteQueue.pop();
                    while (client) {
                        if (!client.initialized)
                            client.initialized = true;
                        if (client.hasEventListener(gui.UIEvent.UPDATE_COMPLETE))
                            gui.UIEvent.dispatchUIEvent(client, gui.UIEvent.UPDATE_COMPLETE);
                        client.updateCompletePendingFlag = false;
                        client = this.updateCompleteQueue.pop();
                    }
                    gui.UIEvent.dispatchUIEvent(this, gui.UIEvent.UPDATE_COMPLETE);
                }
            };
            /**
             * 立即应用所有延迟的属性
             * @method egret.gui.LayoutManager#validateNow
             */
            __egretProto__.validateNow = function () {
                var infiniteLoopGuard = 0;
                while (this.listenersAttached && infiniteLoopGuard++ < 100)
                    this.doPhasedInstantiationCallBack();
            };
            /**
             * 使大于等于指定组件层级的元素立即应用属性
             * @method egret.gui.LayoutManager#validateClient
             * @param target {ILayoutManagerClient} 要立即应用属性的组件
             * @param skipDisplayList {boolean} 是否跳过更新显示列表阶段
             */
            __egretProto__.validateClient = function (target, skipDisplayList) {
                if (skipDisplayList === void 0) { skipDisplayList = false; }
                var obj;
                var i = 0;
                var done = false;
                var oldTargetLevel = this.targetLevel;
                if (this.targetLevel == Number.MAX_VALUE)
                    this.targetLevel = target.nestLevel;
                while (!done) {
                    done = true;
                    obj = (this.invalidatePropertiesQueue.removeSmallestChild(target));
                    while (obj) {
                        if (obj.parent) {
                            obj.validateProperties();
                            if (!obj.updateCompletePendingFlag) {
                                this.updateCompleteQueue.insert(obj);
                                obj.updateCompletePendingFlag = true;
                            }
                        }
                        obj = (this.invalidatePropertiesQueue.removeSmallestChild(target));
                    }
                    if (this.invalidatePropertiesQueue.isEmpty()) {
                        this.invalidatePropertiesFlag = false;
                    }
                    this.invalidateClientPropertiesFlag = false;
                    obj = (this.invalidateSizeQueue.removeLargestChild(target));
                    while (obj) {
                        if (obj.parent) {
                            obj.validateSize();
                            if (!obj.updateCompletePendingFlag) {
                                this.updateCompleteQueue.insert(obj);
                                obj.updateCompletePendingFlag = true;
                            }
                        }
                        if (this.invalidateClientPropertiesFlag) {
                            obj = (this.invalidatePropertiesQueue.removeSmallestChild(target));
                            if (obj) {
                                this.invalidatePropertiesQueue.insert(obj);
                                done = false;
                                break;
                            }
                        }
                        obj = (this.invalidateSizeQueue.removeLargestChild(target));
                    }
                    if (this.invalidateSizeQueue.isEmpty()) {
                        this.invalidateSizeFlag = false;
                    }
                    this.invalidateClientPropertiesFlag = false;
                    this.invalidateClientSizeFlag = false;
                    if (!skipDisplayList) {
                        obj = (this.invalidateDisplayListQueue.removeSmallestChild(target));
                        while (obj) {
                            if (obj.parent) {
                                obj.validateDisplayList();
                                if (!obj.updateCompletePendingFlag) {
                                    this.updateCompleteQueue.insert(obj);
                                    obj.updateCompletePendingFlag = true;
                                }
                            }
                            if (this.invalidateClientPropertiesFlag) {
                                obj = (this.invalidatePropertiesQueue.removeSmallestChild(target));
                                if (obj) {
                                    this.invalidatePropertiesQueue.insert(obj);
                                    done = false;
                                    break;
                                }
                            }
                            if (this.invalidateClientSizeFlag) {
                                obj = (this.invalidateSizeQueue.removeLargestChild(target));
                                if (obj) {
                                    this.invalidateSizeQueue.insert(obj);
                                    done = false;
                                    break;
                                }
                            }
                            obj = (this.invalidateDisplayListQueue.removeSmallestChild(target));
                        }
                        if (this.invalidateDisplayListQueue.isEmpty()) {
                            this.invalidateDisplayListFlag = false;
                        }
                    }
                }
                if (oldTargetLevel == Number.MAX_VALUE) {
                    this.targetLevel = Number.MAX_VALUE;
                    if (!skipDisplayList) {
                        obj = (this.updateCompleteQueue.removeLargestChild(target));
                        while (obj) {
                            if (!obj.initialized)
                                obj.initialized = true;
                            if (obj.hasEventListener(gui.UIEvent.UPDATE_COMPLETE))
                                gui.UIEvent.dispatchUIEvent(obj, gui.UIEvent.UPDATE_COMPLETE);
                            obj.updateCompletePendingFlag = false;
                            obj = (this.updateCompleteQueue.removeLargestChild(target));
                        }
                    }
                }
            };
            return LayoutManager;
        })(egret.EventDispatcher);
        gui.LayoutManager = LayoutManager;
        LayoutManager.prototype.__class__ = "egret.gui.LayoutManager";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
