import { _decorator, Component, Node } from 'cc';
import { PREVIEW } from 'cc/env';
import { App } from '../../app/App';
import { EventIDCfg } from '../const/EventIDCfg';
import { SoundCfg } from '../const/SoundCfg';
const { ccclass, property } = _decorator;

@ccclass('PlayerDataMgr')
export class PlayerDataMgr extends Component {

    static _instance: PlayerDataMgr;

    public static getInstance(): PlayerDataMgr {
        if (PlayerDataMgr._instance == null) {
            PlayerDataMgr._instance = new PlayerDataMgr();
        }
        return PlayerDataMgr._instance;
    }

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


    public candySize = 72;


    public _gold = 0;
    
    public set gold(amount : number) {
        this._gold = amount;
        App.EventMgr.emit(EventIDCfg.ADD_MONEY, amount);        
    }
    
    public get gold() : number {
        return this._gold;
    }
    
    



}


