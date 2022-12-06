import { isValid, Prefab, instantiate, find } from "cc";
import { ObjectUtils } from "../frame/utils/ObjectUtils";
import { Toast } from "./prefabs/Toast";



export class ToastMgr {

    private static _instance: ToastMgr = null;
    private _displayMax: number = 5;
    private _toasts: Array<Toast> = [];

    public static getInstance(): ToastMgr {
        if (ToastMgr._instance == null) {
            ToastMgr._instance = new ToastMgr();
        }
        return ToastMgr._instance;
    }

    public static destroyInstance():void {
        if (ToastMgr._instance) {
            ToastMgr._instance = null;
        }
    }

    public showToast(content: string): void {
        // 清除无效的
        for (let i = this._toasts.length - 1; i >= 0; i--) {
            if (!isValid(this._toasts[i]) || !isValid(this._toasts[i].node)) {
                this._toasts.splice(i, 1);
            }
        }
        let length = this._toasts.length;
        if (length >= this._displayMax) {
            this._toasts[0].node.destroy();
            this._toasts.splice(0, 1);
        } 
        
        length = this._toasts.length;
        if (length > 0 && this._toasts[length - 1].getContent() == content) {
            // 内容相同
        } else {
           ObjectUtils.loadRes('prefabs/NodeToast', Prefab, {
                onComplete:(err, prefab: Prefab) => {            
                    const node = instantiate(prefab);
                    node.setSiblingIndex(10000);
                    node.parent =  find("Canvas/UIRoot");
                    const toast = node.getComponent(Toast);
                    toast.setContent(content);
                    toast.show(1.5, ()=>{
                        const idx = this._toasts.indexOf(toast);
                        if (idx != -1) {
                            this._toasts[idx].node.destroy();
                            this._toasts.splice(idx, 1);
                        }
                    }, this);
                    this._toasts.push(toast);
                    // 位置
                    length = this._toasts.length;
                    for (let i = 0; i < length; i++) {
                        this._toasts[i].node.setPosition(this._toasts[i].node.position.x, ((length - 1) - i) * 90);
                    }    
                }
            });           
        }
    }

    public clear(): void {
        for (let i = 0; i < this._toasts.length; i++) {
            this._toasts[i].node.destroy();
        }
        this._toasts.length = 0;
    }
}