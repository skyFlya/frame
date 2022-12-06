import { _decorator, Component, Node, sys, log, error } from 'cc';
import { DEBUG, EDITOR } from 'cc/env';
import { Save, SaveItemConig } from '../Save';
import { ObjectUtils } from '../utils/ObjectUtils';

type StorageVauleType = "number" | "string" | "boolean" | "object";
interface StorageData {
    type: StorageVauleType,
    value: string | number | boolean | object;

}
export class SaveMgr extends Component {
    private static _instance: SaveMgr = null;
  
    public static getInstance(): SaveMgr {
        if (SaveMgr._instance == null) {
            SaveMgr._instance = new SaveMgr();
            SaveMgr._instance.init();
        }
        return SaveMgr._instance;
    }

    public init() {
        //每日刷新
        let date = new Date()
        let text = parseInt((date.getMonth() + 1) + "" + date.getDay() + "")
        if (this.getItem(Save.todayInfo) != text) {
            // for (let m in Save) {
            //     let item = Save[m]
            //     if (item && item.isDayUpdate) {                    
            //         this.setItem(item, item.default);
            //     }
            // }    
            if (!EDITOR) {
                log("每次刷新···································", text);
                // this.setItem(Save.isPopSignView, 0);
                // this.setItem(Save.taskOkArray, []);
                // this.setItem(Save.todayInfo, text);
                // this.setItem(Save.isShowNewCashOutTip, false);
            }
        }
    }

    public getItem(item: SaveItemConig) {
        let value = sys.localStorage.getItem(item.key);
        if (value) {
            //解析
            try {
                let data = value;
                let result: StorageData = JSON.parse(data);
                if (result.type) {
                    return result.value;
                } else {
                    return value;
                }
            } catch (error) {
                return value;
            }
        }
        else {
            return ObjectUtils.cloneObject(item.default);
        }
    }

    public setItem(item: SaveItemConig, value: string | number | boolean | object) {
        let type = typeof value;
        if (type == "number" || type == "string" || type == "boolean" || type == "object") {
            let saveObj: StorageData = { type: type, value: value };
            //加密
            try {
                let data = saveObj;
                sys.localStorage.setItem(item.key, JSON.stringify(data));
            } catch (error) {
                if (DEBUG) error(error);
            }
        } else {
            if (DEBUG) error(`存储数据类型不支持 当前的存储类型: ${type}`);
        }
    }

    public removeItem(item: SaveItemConig) {
        sys.localStorage.removeItem(item.key);
    }

    public removeAllItem() {
        sys.localStorage.clear()
    }
}


