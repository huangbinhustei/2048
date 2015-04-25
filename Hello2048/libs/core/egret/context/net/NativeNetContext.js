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
    /**
     * @private
     */
    var NativeNetContext = (function (_super) {
        __extends(NativeNetContext, _super);
        function NativeNetContext() {
            _super.call(this);
            this.urlData = {};
            this.initVersion(new egret.VersionController());
        }
        var __egretProto__ = NativeNetContext.prototype;
        __egretProto__.initVersion = function (versionCtr) {
            this._versionCtr = versionCtr;
        };
        /**
         * @method egret.HTML5NetContext#proceed
         * @param loader {URLLoader}
         */
        __egretProto__.proceed = function (loader) {
            if (loader.dataFormat == egret.URLLoaderDataFormat.TEXTURE) {
                this.loadTexture(loader);
                return;
            }
            if (loader.dataFormat == egret.URLLoaderDataFormat.SOUND) {
                this.loadSound(loader);
                return;
            }
            var self = this;
            var request = loader._request;
            var url = egret.NetContext._getUrl(request);
            if (url.indexOf("http://") == 0) {
                this.urlData.type = request.method;
                //写入POST数据
                if (request.method == egret.URLRequestMethod.POST && request.data) {
                    var urlVars = request.data;
                    this.urlData.data = urlVars.toString();
                }
                else {
                    delete this.urlData["data"];
                }
                //写入header信息
                if (request.requestHeaders) {
                    this.urlData.header = this.getHeaderString(request);
                }
                else {
                    delete this.urlData.header;
                }
                var promise = egret.PromiseObject.create();
                promise.onSuccessFunc = function (getted_str) {
                    loader.data = getted_str;
                    egret.callLater(egret.Event.dispatchEvent, egret.Event, loader, egret.Event.COMPLETE);
                };
                promise.onErrorFunc = function (error_code) {
                    egret.Logger.infoWithErrorId(1019, error_code);
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.requireHttp(url, this.urlData, promise);
            }
            else if (!egret_native.isFileExists(url)) {
                download();
            }
            else if (!this.checkIsNewVersion(url)) {
                download();
            }
            else {
                if (NativeNetContext.__use_asyn) {
                    //异步读取
                    readFileAsync();
                }
                else {
                    //同步读取
                    egret.__callAsync(onLoadComplete, this);
                }
            }
            function readFileAsync() {
                var promise = new egret.PromiseObject();
                promise.onSuccessFunc = function (content) {
                    self.saveVersion(url);
                    loader.data = content;
                    egret.Event.dispatchEvent(loader, egret.Event.COMPLETE);
                };
                egret_native.readFileAsync(url, promise);
            }
            function download() {
                var promise = egret.PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(url, url, promise);
            }
            function onLoadComplete() {
                self.saveVersion(url);
                var content = egret_native.readFileSync(url);
                loader.data = content;
                egret.Event.dispatchEvent(loader, egret.Event.COMPLETE);
            }
        };
        __egretProto__.getHeaderString = function (request) {
            var headerObj = {};
            var length = request.requestHeaders.length;
            for (var i = 0; i < length; i++) {
                var urlRequestHeader = request.requestHeaders[i];
                headerObj[urlRequestHeader.name] = urlRequestHeader.value;
            }
            return JSON.stringify(headerObj);
        };
        __egretProto__.loadSound = function (loader) {
            var self = this;
            var request = loader._request;
            var url = request.url;
            if (url.indexOf("http://") != -1) {
                download();
            }
            else if (!egret_native.isFileExists(url)) {
                download();
            }
            else if (!this.checkIsNewVersion(url)) {
                download();
            }
            else {
                egret.__callAsync(onLoadComplete, this);
            }
            function download() {
                var promise = egret.PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(url, url, promise);
            }
            function onLoadComplete() {
                self.saveVersion(url);
                var sound = new egret.Sound();
                sound.path = url;
                loader.data = sound;
                egret.Event.dispatchEvent(loader, egret.Event.COMPLETE);
            }
        };
        __egretProto__.loadTexture = function (loader) {
            var self = this;
            var request = loader._request;
            var url = request.url;
            if (url.indexOf("http://") != -1) {
                download();
            }
            else if (!egret_native.isFileExists(url)) {
                download();
            }
            else if (!this.checkIsNewVersion(url)) {
                download();
            }
            else {
                if (NativeNetContext.__use_asyn) {
                    addTextureAsync();
                }
                else {
                    egret.__callAsync(onLoadComplete, this);
                }
            }
            function addTexture(bitmapData) {
                self.saveVersion(url);
                var texture = new egret.Texture();
                texture._setBitmapData(bitmapData);
                loader.data = texture;
                egret.Event.dispatchEvent(loader, egret.Event.COMPLETE);
            }
            function addTextureAsync() {
                var promise = new egret.PromiseObject();
                promise.onSuccessFunc = function (bitmapData) {
                    addTexture(bitmapData);
                };
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.Texture.addTextureAsyn(url, promise);
            }
            function download() {
                var promise = egret.PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(loader);
                };
                egret_native.download(url, url, promise);
            }
            function onLoadComplete() {
                if (NativeNetContext.__use_asyn) {
                    addTextureAsync();
                }
                else {
                    var bitmapData = egret_native.Texture.addTexture(url);
                    addTexture(bitmapData);
                }
            }
        };
        /**
         * 检查文件是否是最新版本
         */
        __egretProto__.checkIsNewVersion = function (url) {
            if (this._versionCtr) {
                return this._versionCtr.checkIsNewVersion(url);
            }
            return true;
        };
        /**
         * 保存本地版本信息文件
         */
        __egretProto__.saveVersion = function (url) {
            if (this._versionCtr) {
                this._versionCtr.saveVersion(url);
            }
        };
        __egretProto__.getChangeList = function () {
            if (this._versionCtr) {
                return this._versionCtr.getChangeList();
            }
            return [];
        };
        NativeNetContext.__use_asyn = false;
        return NativeNetContext;
    })(egret.NetContext);
    egret.NativeNetContext = NativeNetContext;
    NativeNetContext.prototype.__class__ = "egret.NativeNetContext";
})(egret || (egret = {}));
