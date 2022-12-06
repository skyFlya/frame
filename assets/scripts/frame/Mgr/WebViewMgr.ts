import { _decorator, log, sys } from 'cc';
const { ccclass, property } = _decorator;

export class WebViewMgr {
    private static _instance: WebViewMgr = null;

    public static getInstance(): WebViewMgr {
        if (WebViewMgr._instance == null) {
            WebViewMgr._instance = new WebViewMgr();
        }
        return WebViewMgr._instance;
    }


    /**JS调用 */
    private jsCall(methodName: string, args, cb?): any {
        log("调用原生方法" + methodName, args)
        let info = window["Xmiles"] && window["Xmiles"][methodName] && window["Xmiles"][methodName](JSON.stringify(args))
        log("原生方法返回值", info)
        return info
    }

    /**
    * 与SDK交互通信
    * @param funcName 方法名
    * @param params 参数
    * @param callback 回调
    */
    // call(funcName: string, params?: any, callback?: Function) {
    //     return this.callWebView(funcName, params, callback);
    // };

    private call(title: string, methodName: string, args?, cb?) {
        args = args ? JSON.parse(args) : null;
        let data = window[title][methodName]();
        return data ? JSON.parse(data) : null;

        args = JSON.stringify(args || {})
        // let ret;
        // if (typeof args == 'function') {
        //     cb = args;
        //     args = {};
        // }
        // if (typeof cb == 'function') {
        //     window['dscb'] = window['dscb'] || 0;
        //     let cbName = 'dscb' + window['dscb']++;
        //     window[cbName] = cb;
        //     args['_dscbstub'] = cbName;
        // }
        // args = JSON.stringify(args || {})

        // cc.log("原生调用 _methodName: " + scheme + methodName + " args: " + args)
        // if (window['_dswk']) {
        //     cc.log("原生调用1")
        //     ret = prompt(window['_dswk'] + methodName, args);
        // } else {
        //     if (typeof window[scheme] == 'function') {
        //         cc.log("原生调用2")
        //         ret = window[scheme](methodName, args);
        //     } else if (window[scheme]) {
        //         cc.log(`原生调用${scheme}`, window[scheme], window[scheme][methodName])
        //         //ret = window[scheme].call(methodName, args);
        //         ret = window[scheme][methodName]();
        //         ret = JSON.parse(ret);
        //         cc.log("返回值", ret);
        //     } else {
        //         cc.log('找不到_dsbridge');
        //         this.callBrowser(methodName, args);
        //     }
        // }
        // return ret;
    };

    private callBrowser(method, args) {
        if (method == 'launch') {
            const object = JSON.parse(args);
            const param = object.param;
            const html = this.getParameterByName(param, 'htmlUrl');
            location.href = html;
        }
    };

    private getParameterByName(url, name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(url);
        return results == null ? "" : decodeURIComponent(results[1]);
    };









    //QFQ----------------------------------------------------
    public track(trackEventName: string, trackObj: Object) {
        for (const key in trackObj) {
            trackObj[key] = String(trackObj[key])
        }

        trackObj = trackObj ? JSON.stringify(trackObj) : null;

        //console.log("埋点", trackEventName, trackObj, window["QFQ"]["track"]);

        if (!window["QFQ"]) {
            return;
        }

        let data = window["QFQ"]["track"](trackEventName, trackObj);
        return data ? data : null;
    }

    public onQfqReady(){
        if (!window["QFQ"]) {
            return;
        }

        let data = window["QFQ"]["onQfqReady"]();
        return data ? data : null;
    }





    //QFQ2019-----------------------------------------------
    public getToken() {
        if (!window["QFQ2019"]) {
            return window[`PHEAD`]._token;
        }


        let data = window["QFQ2019"]["getToken"]();
        return data ? data : null;
    }

    public sign(params) {
        if (!window["QFQ2019"]) {
            Object.assign(params, window[`PHEAD`]);             
            return params;
        }

        params = JSON.stringify(params);

        let data = window["QFQ2019"]["sign"](params);

        data = JSON.parse(data);
        return data;
    }

    public getAppName() {
        if (!window["QFQ2019"]) {
            return "精彩2048";
        }

        let data = window["QFQ2019"]["getAppName"]();
        return data;
    }




    //DRQFQ
    public getDeviceInfo() {
        if (!window["DRQFQ"]) {
            return { notchBarHeight: 0 };
        }


        let data = window["DRQFQ"]["getDeviceInfo"]();
        data = JSON.parse(data);
        data.notchBarHeight = data.notchBarHeight / 2;
        return data;
    }

    public showRewardVideo(codeId: string) {
        if (!window["DRQFQ"]) {
            window[`DRQFQ`][`onVideoAdClose`]();
            return;
        }


        let data = window["DRQFQ"]["showRewardVideo"](codeId, "");
        return data ? JSON.parse(data) : null;
    }

    public showFullscreenVideo(codeId: string) {
        if (!window["DRQFQ"]) {
            window[`onVideoAdClose`]();
            return;
        }


        let data = window["DRQFQ"]["showFullscreenVideo"](codeId, "");
        return data ? JSON.parse(data) : null;
    }

    public openWebModuleWithType(url: string, opt?) {
        let pop = window[`isTest`] ? "https://nbweb.test.qufenqian.vip/page" : "https://nbweb.qufenqian.vip/page";
        let tempUrl = pop + url;

        if (!window["DRQFQ"]) {
            sys.openURL(tempUrl);
            return;
        }
        opt = opt ? JSON.stringify(url) : null;

        let data = window["DRQFQ"]["openWebModuleWithType"](0, tempUrl, opt);
        return data ? JSON.parse(data) : null;
    }

    public bindWechat() {
        if (!window["DRQFQ"]) {
            return;
        }

        let data = window["DRQFQ"]["bindWechat"]();
        return data ? JSON.parse(data) : null;
    }

    public bindWechatOnly() {
        if (!window["DRQFQ"]) {
            return;
        }

        let data = window["DRQFQ"]["bindWechatOnly"]();
        return data ? JSON.parse(data) : null;
    }

    public loadAdvertViewInPos(obj: Object) {
        if (!window["DRQFQ"]) {
            return;
        }

        obj = obj ? JSON.stringify(obj) : null;

        console.log("调用信息流", obj);

        let data = window["DRQFQ"]["loadAdvertViewInPos"](obj);
        return data ? JSON.parse(data) : null;
    }

    public closeAdvertViewInPos() {
        if (!window["DRQFQ"]) {
            return;
        }

        let data = window["DRQFQ"]["closeAdvertViewInPos"]("feed");
        return data ? JSON.parse(data) : null;
    }

    public loadIntAd(adCode: string) {
        if (!window["DRQFQ"]) {
            return;
        }

        let data = window["DRQFQ"]["loadIntAd"]("2", adCode, false);
        return data ? JSON.parse(data) : null;
    }

    public registerOnBackPressedListen() {
        if (!window["DRQFQ"]) {
            return;
        }

        let data = window["DRQFQ"]["registerOnBackPressedListen"]();
        return data ? JSON.parse(data) : null;
    }

    public onBackPressedFinished() {
        if (!window["DRQFQ"]) {
            return;
        }

        let data = window["DRQFQ"]["onBackPressedFinished"]();
        return data ? JSON.parse(data) : null;
    }

    /**缓存激励视频 */
    public cacheVideo(adCode: string) {
        if (!window["DRQFQ"]) {
            return;
        }

        let data = window["DRQFQ"]["cacheVideo"](adCode);
        return data ? JSON.parse(data) : null;
    }

    /**缓存插屏广告 */
    public cacheInteraction(adCode: string) {
        if (!window["DRQFQ"]) {
            return;
        }

        let data = window["DRQFQ"]["cacheInteraction"](adCode);
        return data ? JSON.parse(data) : null;
    }

    /**游戏震动 */
    public vibrate(time:number, power:number){
        if (!window["DRQFQ"] || !window["DRQFQ"]["vibrate"]) {
            return;
        }        
        let data = window["DRQFQ"]["vibrate"](time, power);
        return data ? JSON.parse(data) : null;
    }

    /**获取游戏环境 */
    public isDebug(){
        if (!window["DRQFQ"] || !window["DRQFQ"]["isDebug"]) {
            return;
        }        
        let data = window["DRQFQ"]["isDebug"]();        
        return data;
    }

    /**绑定微信2 */
    public bindWechatV2(){
        if (!window["DRQFQ"] || !window["DRQFQ"]["bindWechatV2"]) {
            return;
        }

        let data = window["DRQFQ"]["bindWechatV2"]("xcx");
        return data ? JSON.parse(data) : null;
    }

    /**绑定微信3 */
    public bindWechatApplets(){
        if (!window["DRQFQ"] || !window["DRQFQ"]["bindWechatApplets"]) {
            return;
        }

        let data = window["DRQFQ"]["bindWechatApplets"]();
        return data ? JSON.parse(data) : null;
    }
}


