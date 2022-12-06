import { _decorator, Component, Node, Asset, AssetManager, assetManager, Sprite, SpriteFrame, Texture2D } from 'cc';

/**
 * 对象工具类
 */
export const ObjectUtils = {
    /**
    * 深拷贝
    * @param Obj 对象
    */
    cloneObject(Obj) {
        var buf;
        if (Obj instanceof Array) {
            buf = [];
            for (let i = 0; i < Obj.length; i++) {
                buf[i] = ObjectUtils.cloneObject(Obj[i]);
            }

            return buf;
        } else if (Obj instanceof Object) {
            buf = {};
            for (let k = 0; k < Object.keys(Obj).length; k++) {
                buf[Object.keys(Obj)[k]] = ObjectUtils.cloneObject(Obj[Object.keys(Obj)[k]]);
            }
            return buf;
        } else {
            return Obj;
        }
    },

    loadRes(path: string, type: typeof Asset,
        options: {
            onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void,
            onComplete?: (error: Error, assets: Asset | Asset[]) => void,
        } = {}): void {
        let {
            onComplete = null,
            onProgress = null,
        } = options;

        // if (CC_DEBUG) {
        //     log(`${this.logTag} loadRes path : ${path}`)
        // }
        if (onProgress) {
            assetManager.resources.load(path, type, onProgress, onComplete)
        } else {
            assetManager.resources.load(path, type, onComplete)
        }
    },


    setAvart(obj: Sprite, remoteUrl: string) {        
        assetManager.loadRemote(remoteUrl, { ext: '.png' }, (err: Error, pic: Texture2D) => {
            if (err) {
                return;
            }
            if (obj.node == null) {   //obj 就是对应精灵Sprite                
                return;
            }
            let spriteFrame: SpriteFrame = new SpriteFrame();
            spriteFrame._textureSource = pic;
            obj.spriteFrame = spriteFrame;
        })
    },

    loadAvart(obj: Sprite, remoteUrl: string) {
        assetManager.loadRemote(remoteUrl, { ext: '.png' }, (err: Error, pic: Texture2D) => {
            if (err) {
                return;
            }
            if (obj.node == null) {   //obj 就是对应精灵Sprite                
                return;
            }
            let spriteFrame: SpriteFrame = new SpriteFrame();
            spriteFrame._textureSource = pic;
            obj.spriteFrame = spriteFrame;
        })
    }
}


