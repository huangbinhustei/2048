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
        var Theme = (function () {
            /**
             * 构造函数
             * @method egret.gui.PopUpManager#constructor
             */
            function Theme(configURL) {
                this.skinMap = {};
                this.delyList = [];
                this.loadConfig(configURL);
            }
            var __egretProto__ = Theme.prototype;
            Theme.load = function (configURL) {
                if (this.initialized) {
                    return;
                }
                this.initialized = true;
                gui.SkinnableComponent._defaultTheme = new Theme(configURL);
            };
            __egretProto__.loadConfig = function (configURL) {
                var loader = new egret.URLLoader();
                loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
                loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
                loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
                loader.load(new egret.URLRequest(configURL));
            };
            __egretProto__.onLoadComplete = function (event) {
                var loader = (event.target);
                try {
                    var str = loader.data;
                    var data = JSON.parse(str);
                    this.skinMap = data.skins;
                }
                catch (e) {
                    egret.$warn(1017, loader._request.url, loader.data);
                }
                this.handleDelyList();
            };
            __egretProto__.onLoadError = function (event) {
                var loader = (event.target);
                egret.$warn(3000, loader._request.url);
                this.handleDelyList();
            };
            __egretProto__.handleDelyList = function () {
                if (!this.skinMap) {
                    this.skinMap = {};
                    this.delyList = [];
                    return;
                }
                var list = this.delyList;
                this.delyList = [];
                var length = list.length;
                for (var i = 0; i < length; i++) {
                    var client = list[i];
                    if (!client._skin) {
                        var skin = this.getDefaultSkin(client);
                        client._setSkin(skin);
                    }
                }
            };
            __egretProto__.getDefaultSkin = function (client) {
                var skinMap = this.skinMap;
                if (!skinMap) {
                    if (this.delyList.indexOf(client) == -1) {
                        this.delyList.push(client);
                    }
                    return null;
                }
                var skinName;
                var hostKey = client.hostComponentKey;
                if (hostKey) {
                    skinName = skinMap[hostKey];
                }
                else {
                    var superClass = client;
                    while (superClass) {
                        hostKey = egret.getQualifiedClassName(superClass);
                        skinName = skinMap[hostKey];
                        if (skinName) {
                            break;
                        }
                        superClass = egret.getDefinitionByName(egret.getQualifiedSuperclassName(superClass));
                    }
                }
                if (!skinName) {
                    return null;
                }
                var skinClass = egret.getDefinitionByName(skinName);
                if (!skinClass) {
                    egret.$warn(3001, skinName);
                    return null;
                }
                return new skinClass();
            };
            Theme.initialized = false;
            return Theme;
        })();
        gui.Theme = Theme;
        Theme.prototype.__class__ = "egret.gui.Theme";
    })(gui = egret.gui || (egret.gui = {}));
})(egret || (egret = {}));
