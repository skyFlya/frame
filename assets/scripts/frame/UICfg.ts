import { Prefab } from "cc";
import { UIZIndexCfg } from "./UIZIndexCfg";



export let UICfg = {
    /**
     * 轉盤
     */
    'PannelWheel': {
        name: 'PannelWheel',
        preloadRes: [
            { url: 'common/pannels2048/PannelWheel', type: Prefab }
        ],
        ui: 'common/pannels2048/PannelWheel',
        needWait: true,
        zIndex: UIZIndexCfg.DEFAULT,
    },

    /**
     * 提示框1
     */
    'PannelTip1': {
        name: 'PannelTip1',
        preloadRes: [
            { url: 'common/pannels2048/PannelTip1', type: Prefab }
        ],
        ui: 'common/pannels2048/PannelTip1',
        needWait: false,
        zIndex: UIZIndexCfg.REWARD,
    },


    /**
     * 提示框2
     */
    'PannelTip2': {
        name: 'PannelTip2',
        preloadRes: [
            { url: 'common/pannels2048/PannelTip2', type: Prefab }
        ],
        ui: 'common/pannels2048/PannelTip2',
        needWait: false,
        zIndex: UIZIndexCfg.REWARD,
    },
}