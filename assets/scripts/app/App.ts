import { UICfgMgr } from "../frame/UICfgMgr";
import { UIMgr } from "../frame/UIMgr";


export class App {

    public static get uiMgr(): UIMgr {
        return UIMgr.getInstance();
    }

    public static get uiCfgMgr(): UICfgMgr {
        return UICfgMgr.getInstance();
    }

}