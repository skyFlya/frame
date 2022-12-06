import { log } from "cc";
import { DEBUG } from "cc/env";
import { App } from "../../app/App";
import { HttpUrlConfig, HttpUrl } from "../const/HttpUrlCfg";
import { UICfg } from "../const/UICfg";
import { ObjectUtils } from "../utils/ObjectUtils";


export enum HttpErrorType {
    /**错误的Url地方 */
    UrlError,
    /**超时 */
    TimeOut,
    /**请求错误 */
    RequestError,
    /**请求终止 */
    Abort,

}
/**网络类型 */
export enum NetworkType {
    NETWORK_ETHERNET = 'NETWORK_ETHERNET',
    NETWORK_WIFI = 'NETWORK_WIFI',
    NETWORK_4G = '4G',
    NETWORK_3G = '3G',
    NETWORK_2G = '2G',
    NETWORK_UNKNOWN = 'UNKNOWN',
    /**无网络 */
    NETWORK_NO = ''
}
export interface HttpError {
    type: HttpErrorType,
    reason: any
}

let real = {
    work: "https://nb4.qufenqian.vip",
    gameWork: "https://nbs1.qufenqian.vip",
    cashOut: "https://nb.qufenqian.vip"
}

let test = {
    work: "http://game2048addappid221114.qufenqian-webapplication.web-application.sh.vipc.me",
    gameWork: "http://game2048addappid221114.qufenqian-webgame.web-application.sh.vipc.me",
    cashOut: "http://game2048addappid221114.qufenqian-withdrawwebservice.web-application.sh.vipc.me"
}

export class HttpClientMgr {
    private static _instance: HttpClientMgr = null;
    public static getInstance(): HttpClientMgr {
        if (HttpClientMgr._instance == null) {
            HttpClientMgr._instance = new HttpClientMgr();
        }
        return HttpClientMgr._instance;
    }

    public static destroyInstance(): void {
        if (HttpClientMgr._instance) {
            HttpClientMgr._instance = null;
        }
    }


    public httpPost(url: HttpUrlConfig,
        fData = {},
        callback: | {
            success?: Function,
            timeOut?: Function,
            fail?: Function,
            final?: Function,
        } | Function) {
        

        const { success, fail, final, timeOut } = <any>((typeof callback == "function" && ((<any>callback) = { click: callback })) || callback);
        const param = { url: url.url, param: fData, requestType: url.requestType }

        //const now = Date.now();
        let finalData;

        if(window[`isTest`]){
            if (url == HttpUrl.getVersion) {            
                finalData = {
                    _token: App.webViewMgr.getToken(),
                    _sign: window["PHEAD"]._sign,
                }
            }
            else {
                finalData = {
                    _token: App.webViewMgr.getToken(),
                    _sign: window["PHEAD"]._sign,
                    dv: window["PHEAD"].dv,
                }
            }
        }
        else{
            if (url == HttpUrl.getVersion) {            
                finalData = {
                   
                }
            }
            else {
                finalData = {                    
                    dv: window["PHEAD"].dv,
                }
            }
        }
       

        Object.assign(finalData, fData);
        finalData = App.webViewMgr.sign(finalData);

        let finalurl = window[`isTest`] ? test[url.type] : real[url.type];

        if(url.powerTest && window[`isTest`]){
            finalurl = url.powerTest;
        }
        else if(url.powerRead){
            finalurl = url.powerRead;
        }
        else if (url.requestType == "GET") {
            let pro = this.getToStr(finalData);
            finalurl += url.url + pro;
        }
        else {
            finalurl += url.url;
        }

        
        param.url = finalurl;
        param.param = finalData;
        log("网页请求->>", param)

        this.request(finalurl, finalData,
            _success => {
                if (_success && (_success.statuscode === 0 || _success.status === 0)) {
                    success && success(_success);
                    final && final(_success);
                } else {
                    fail && fail(_success);
                    final && final(_success);
                }
                log("网页请求_success<<-", param, ObjectUtils.cloneObject(_success))
                //App.uiMgr.closeUI(UICfg.PannelNotWeb.name);
            },
            _fail => {
                fail && fail(_fail);
                final && final(_fail);
                log("网页请求fail<<-", param, _fail)

                // if (App.uiMgr.findUI(UICfg.PannelNotWeb.name) == null) {
                //     App.uiMgr.openUI(UICfg.PannelNotWeb.name, (node) => {
                //         node.getComponent(PannelNotWeb).setCall(this.httpPost.bind(this, url, fData, callback))
                //     })
                // }
            },
            _timeOut => {
                timeOut && timeOut(_timeOut);
                final && final(_timeOut);
            }, url.requestType
        )
    }

    /**cocos自带http */
    private request(url: string, body, _success: (data: any) => void, _fail?: (errorData: HttpError) => void, _timeOut?: (errorData: HttpError) => void, requestType?: "GET" | "POST") {
        const xhr = new XMLHttpRequest();
        let timer = setTimeout(() => {
            //Manager.wait.show(url)
        }, 3 * 1000);
        const clearTimer = () => {
            clearTimeout(timer);
            //Manager.wait.hide(url)
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                clearTimer();
                if (xhr.status >= 200 && xhr.status < 400) {
                    let res = JSON.parse(xhr.responseText);
                    _success(res);
                } else {
                    if (xhr.responseText) {
                        let res = JSON.parse(xhr.responseText);
                        _fail(res);
                    } else {
                        _fail({ type: HttpErrorType.RequestError, reason: "状态异常" });
                    }
                }
            }

        };

        xhr.onabort = (e) => {
            clearTimer();
            console.log(e)
            try {
                if (_fail) _fail({ type: HttpErrorType.Abort, reason: '请求被中止' });
            } catch (error) {
                error(error)
            }
        };

        xhr.ontimeout = (e) => {
            clearTimer();
            xhr.abort();//网络超时，断开连接
            // if (reConneted)
            //     Manager.reConneted.show(() => this.request(url, body, _success, _fail, _timeOut, reConneted))
            if (DEBUG) console.warn(`request timeout : ${url}`);
            try {
                if (_timeOut) _timeOut({ type: HttpErrorType.TimeOut, reason: "连接超时" });
            } catch (error) {
                error(error)
            }

        };
        xhr.onerror = (e) => {
            clearTimer();

            console.error(`request error : ${url} `);
            // if (reConneted)
            //     Manager.reConneted.show(() => this.request(url, body, _success, _fail, _timeOut, reConneted))
            try {
                if (_fail) _fail({ type: HttpErrorType.RequestError, reason: "请求错误" });
            } catch (error) {
                error(error);
            }
        };
        //Accept: text/plain               
        if (requestType == "GET") {
            xhr.open("GET", url);
            xhr.timeout = 10 * 1000; //超时10秒        
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send();
        }
        else {
            xhr.open("POST", url);
            xhr.timeout = 10 * 1000; //超时10秒        
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(body));
        }
    }

    //GET方法转成字符串
    private getToStr(obj) {
        let result = '';
        let item;
        for (item in obj) {
            if (obj[item] && String(obj[item])) {
                obj[item] = encodeURIComponent(obj[item]);
                result += `&${item}=${obj[item]}`;
            }
        }
        if (result) {
            result = '?' + result.slice(1);
        }
        return result;
    }

}

