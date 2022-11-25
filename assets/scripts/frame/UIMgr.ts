import { _decorator, Component, Node, error, isValid, loader, resources, Prefab, instantiate, log, find } from 'cc';
import { App } from '../app/App';
import { EventIDCfg } from './EventIDCfg';
import { EventMgr } from './EventMgr';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('UIMgr')
export class UIMgr extends Component {
    private static _instance: UIMgr = null;
    private static _loadingId: number = 0;
    private static _curDisplayId: number = 0;
    private _loadingIds: Array<number> = [];
    private _nodeList: Object = Object.create(null);
    private _waittingDisplayList: Array<any> = [];
    private _curDisplay: any = null;
    private _uiList: Array<UIBase> = [];
    private _openUINameList: Array<string> = [];

    public static getInstance(): UIMgr {
        if (UIMgr._instance == null) {
            UIMgr._instance = new UIMgr();
        }
        return UIMgr._instance;
    }

    public static destroyInstance(): void {
        if (UIMgr._instance) {
            UIMgr._instance = null;
        }
    }

    public openUI(name: string, callback?: (uiBase: UIBase) => void): void {
        const cfg = App.uiCfgMgr.getCfg(name);
        if (!cfg) {
            error('未配置：' + name);
            return;
        }
        let displayId = 0;
        if (this._nodeList[name] && isValid(this._nodeList[name])) {
            this._openUINameList.push(name);
            if (cfg.needWait) {
                if (this._curDisplay == null) {
                    displayId = ++UIMgr._curDisplayId;
                    this._curDisplay = {
                        name: name,
                        callback: callback
                    }
                    this.showUI(name, callback, displayId);
                } else {
                    if (this._curDisplay.name == name) {
                        error('重复显示：' + name);
                        return;
                    }
                    for (let i = 0; i < this._waittingDisplayList.length; i++) {
                        if (this._waittingDisplayList[i].name == name) {
                            error('重复显示：' + name);
                            return;
                        }
                    }
                    this._waittingDisplayList.push({
                        name: name,
                        callback: callback
                    });
                }
            } else {
                this.showUI(name, callback, displayId);
            }
        } else {
            // 加载资源
            if (cfg.preloadRes && cfg.preloadRes.length > 0) {
                this._openUINameList.push(name);
                if (cfg.needWait) {
                    if (this._curDisplay == null) {
                        displayId = ++UIMgr._curDisplayId;
                        this._curDisplay = {
                            name: name,
                            callback: callback
                        }
                    } else {
                        if (this._curDisplay.name == name) {
                            error('重复显示：' + name);
                            return;
                        }
                        for (let i = 0; i < this._waittingDisplayList.length; i++) {
                            if (this._waittingDisplayList[i].name == name) {
                                error('重复显示：' + name);
                                return;
                            }
                        }
                        this._waittingDisplayList.push({
                            name: name,
                            callback: callback
                        });
                    }
                }
                this.loadRes(name, callback, displayId);
            } else {
                error('未配置资源：' + name);
            }
        }
    }

    public closeUI(name: string, isDestroy: boolean = false, callback?: (uiBase: UIBase) => void): void {
        const cfg = App.uiCfgMgr.getCfg(name);
        if (!cfg) {
            error('未配置' + cfg);
            return;
        }
        const idx = this._openUINameList.indexOf(name);
        if (-1 != idx) {
            this._openUINameList.splice(idx, 1);
        }

        let isExits: boolean = false;
        if (cfg.needWait) {
            if (this._curDisplay && this._curDisplay.name == name) {
                this._curDisplay = null;
                isExits = true;
            }
            for (let i = 0; i < this._waittingDisplayList.length; i++) {
                if (this._waittingDisplayList[i].name == name) {
                    this._waittingDisplayList.splice(i, 1);
                    isExits = true;
                    break;
                }
            }
        }

        const node: Node = this._nodeList[name];
        if (node) {
            const uiBase: UIBase = node.getComponent(UIBase);
            const idx = this._uiList.indexOf(uiBase);
            if (isDestroy) {
                this._nodeList[name] = null;
            }
            if (idx != -1) {
                this._uiList.splice(idx, 1);
                uiBase.hide(() => {
                    if (isDestroy) {
                        node.removeFromParent();
                        node.destroy();
                    }
                    this.closeAndShowNext(uiBase, name, cfg.needWait, callback);
                });
            } else {
                this.closeAndShowNext(null, name, cfg.needWait, callback);
            }
        } else if (isExits) {
            this.closeAndShowNext(null, name, cfg.needWait, callback);
        }
    }

    public findUI(name: string): UIBase {
        const node: Node = this._nodeList[name];
        if (node) {
            const uiBase: UIBase = node.getComponent(UIBase);
            const idx = this._uiList.indexOf(uiBase);
            if (idx != -1) {
                return uiBase
            }
        }
        return null;
    }

    private showUI(name: string, callback: (uiBase: UIBase) => void, displayId: number): void {
        const cfg = App.uiCfgMgr.getCfg(name);
        if (!cfg) {
            error('未配置' + cfg);
            return;
        }
        if (-1 == this._openUINameList.indexOf(name)) {
            return;
        }

        if (cfg.needWait) {
            if (!this._curDisplay || displayId != UIMgr._curDisplayId) {
                return;
            }
        }
        log("show " + name);

        const uiBase: UIBase = this._nodeList[name].getComponent(UIBase);
        const idx = this._uiList.indexOf(uiBase);
        if (idx != -1) {
            this._uiList.splice(idx, 1);
        }
        this._uiList.push(uiBase);
        uiBase.node.parent = find("Canvas/UIRoot");
        uiBase.node.setSiblingIndex(cfg.zIndex);
        uiBase.show(() => { });
        callback && callback(uiBase);
        EventMgr.emit(EventIDCfg.PANNLE_SHOW, {name: name});
    }

    private closeAndShowNext(uiBase: UIBase, name: string, tryShowNext: boolean, callback: (uiBase: UIBase) => void): void {
        callback && callback(uiBase);
        EventMgr.emit(EventIDCfg.PANNEL_CLOSE, {name: name});
        tryShowNext && this.tryShowNextUI();
    }

    private tryShowNextUI(): void {
        if (this._curDisplay == null && this._waittingDisplayList.length > 0) {
            const cfg = this._waittingDisplayList.shift();
            const displayId = ++UIMgr._curDisplayId;
            this._curDisplay = {
                name: cfg.name,
                callback: cfg.callback
            }
            if (this._nodeList[cfg.name] && isValid(this._nodeList[cfg.name])) {
                this.showUI(this._curDisplay.name, this._curDisplay.callback, displayId);
            } else {
                // 加载
                this.loadRes(cfg.name, cfg.callback, displayId);
            }
        }
    }

    private loadRes(name: string, callback: (uiBase: UIBase) => void, displayId: number): void {
        const cfg = App.uiCfgMgr.getCfg(name);
        if (!cfg) {
            error('未配置：' + name);
            return;
        }
        const id = ++UIMgr._loadingId;
        this._loadingIds.push(id);
        const length = cfg.preloadRes.length;
        let loaded: number = 0;
        let isLoadedError: boolean = false;
        for (let i = 0; i < length; i++) {
            resources.load(cfg.preloadRes[i].url, cfg.preloadRes[i].type, (errorMes: Error, res: any) => {
                if (error) {
                    isLoadedError = true;
                    error(errorMes.message || error);
                }
                loaded++;
                if (loaded == length) {
                    const idx = this._loadingIds.indexOf(id);
                    if (idx != -1) {
                        this._loadingIds.splice(idx, 1);
                        if (!isLoadedError) {
                            if (!this._nodeList[name] || !isValid(this._nodeList[name])) {                                
                                this._nodeList[name] = instantiate(res);
                            }
                            if (-1 == this._openUINameList.indexOf(name)) {
                                return;
                            }
                            this.showUI(name, callback, displayId);
                        }
                    }
                }
            });
        }
    }

    public clear(): void {
        const uiRoot = find("Canvas/UIRoot");
        if (uiRoot) {
            uiRoot.removeAllChildren();
        }
        this._loadingIds = [];
        this._nodeList = Object.create(null);
        this._waittingDisplayList = [];
        this._curDisplay = null;
        this._uiList = [];
        this._openUINameList = [];
    }

    /**
     * 是否已经打开
     * @param name 
     */
    public isOpend(name: string): boolean {
        const idx = this._openUINameList.indexOf(name);
        if (-1 != idx) {
            return true;
        }
        if (this._curDisplay && this._curDisplay.name == name) {
            return true;
        }
        return false;
    }

    /**
     * 是否等待打开
     */
    private isWaittingOpen(name: string): boolean {
        for (let i = 0; i < this._waittingDisplayList.length; i++) {
            if (this._waittingDisplayList[i].name == name) {
                return true;
            }
        }
        return false;
    }


    public isOpenedOrWaittingOpen(name: string): boolean {
        return this.isOpend(name) || this.isWaittingOpen(name);
    }

    /**
     * 检查是否有窗口打开
     */
    public checkHaveOpen() {
        return this._openUINameList.length > 0;
    }


}


