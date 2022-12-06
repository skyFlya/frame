export class UICfgMgr {

    private static _instance: UICfgMgr = null;

    private _cfgs: Object = Object.create(null);
  
    public static getInstance(): UICfgMgr {
        if (UICfgMgr._instance == null) {
            UICfgMgr._instance = new UICfgMgr();
        }
        return UICfgMgr._instance;
    }

    public static destroyInstance():void {
        if (UICfgMgr._instance) {
            UICfgMgr._instance = null;
        }
    }

    public getCfg(name: string): any {
        return this._cfgs[name];
    }

    public addCfg(name: string, cfg: any): void {
        if (!this._cfgs[name]) {
            this._cfgs[name] = cfg;
        } else {
            console.log('ui配置已存在');
        }
    }

    public initByCfg(cfg: any): void {
        for (const key in cfg) {
            if (Object.prototype.hasOwnProperty.call(cfg, key)) {
               this.addCfg(key, cfg[key]);
            }
        }
    }
}