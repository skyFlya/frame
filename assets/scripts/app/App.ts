import { UICfgMgr } from "../frame/UICfgMgr";
import { UIMgr } from "../frame/UIMgr";
import { PoolManager } from "../frame/PoolManager";


export class App {

    public static get uiMgr(): UIMgr {
        return UIMgr.getInstance();
    }

    public static get uiCfgMgr(): UICfgMgr {
        return UICfgMgr.getInstance();
    }

    public static get poolManager(): PoolManager {
        return PoolManager.getInstance();
    }
}