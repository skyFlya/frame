import { _decorator, Component, Node } from 'cc';
import { PREVIEW } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('PlayerData')
export class PlayerData extends Component {
    public isTest = PREVIEW ? true : false;
    public cocosVersion = "1.0.0.0";

    /**预览开发配置项 */
    public PHEAD = {
        _ts: +new Date().getTime() + "",
        _appid: "40202",
        _sign: "c034e764dfefd8d2af90b57eb037872d",
        _ch: "300010",
        _av: '1.0.0.2',             //客户端版本
        _sv: "2.4.1.2-in",
        _imei: "imei1",
        _imei2: "vip2210171513575f6638ea",
        _sk: "sk",
        _token: "QLAALmGw7fOFi90H4zbaw+ZFBk6mvlG5",
        //_token: "QfpDJ3TVMzCYQUU71+OszfMDFv1ieWESRNDYvTpNxBU",
        dv: "1.0.0.0",              //数据版本
    }
}


