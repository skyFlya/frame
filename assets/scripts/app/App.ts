import { EventMgr } from "../frame/Mgr/EventMgr";
import { HttpClientMgr } from "../frame/Mgr/HttpClientMgr";
import { PoolMgr } from "../frame/Mgr/PoolMgr";
import { SaveMgr } from "../frame/Mgr/SaveMgr";
import { SoundMgr } from "../frame/Mgr/SoundMgr";
import { UICfgMgr } from "../frame/Mgr/UICfgMgr";
import { UIMgr } from "../frame/Mgr/UIMgr";
import { WebViewMgr } from "../frame/Mgr/WebViewMgr";



export class App {
    
    public static get uiMgr(): UIMgr {
        return UIMgr.getInstance();
    }

    public static get uiCfgMgr(): UICfgMgr {
        return UICfgMgr.getInstance();
    }

    public static get EventMgr(): EventMgr {
        return EventMgr.getInstance();
    }

    public static get poolMgr(): PoolMgr {
        return PoolMgr.getInstance();
    }

    public static get saveManager(): SaveMgr {
        return SaveMgr.getInstance();
    }

    public static get soundMgr(): SoundMgr{
        return SoundMgr.getInstance();
    }

    public static get webViewMgr(): WebViewMgr{
        return WebViewMgr.getInstance();
    }
    
    public static get httpClientMgr(): HttpClientMgr{
        return HttpClientMgr.getInstance();
    }

}