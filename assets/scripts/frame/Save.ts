
/**
 * @description 本地数据存储，为了后面可能需要对数据进入加密保存等，把cocos的封闭一层
 */
export interface SaveItemConig {
    /**存档名字 */
    key: string
    /**数据类型 */
    type: StorageVauleType
    /**默认值 */
    default: any
    isDayUpdate?: boolean,
}
type StorageVauleType = "number" | "string" | "boolean" | "object";

class SaveConfig {
    /**记录当天日期 */
    todayInfo: SaveItemConig = {
        key: "todayInfo",
        type: "number",
        default: 0
    }
    /**游戏版本 */
    gameVersion: SaveItemConig = {
        key: "gameVersion",
        type: "number",
        default: 0
    }
    /**玩家登陆ID */
    phoneid: SaveItemConig = {
        key: "phoneid",
        type: "string",
        default: null
    }
    /**音乐开关 */
    bgmSwitch: SaveItemConig = {
        key: "bgmSwitch",
        type: "object",
        default: {music: true, sound:true}
    }

    /**游戏时间 */
    gameDate: SaveItemConig = {
        key: "gameDate",
        type: "number",
        default: 100
    }

    /**球原始位置 */
    fruitsPos: SaveItemConig = {
        key: "fruitsPos",
        type: "object",
        default: []
    }

    /**弹幕开关 */
    danmuSwitch: SaveItemConig = {
        key: "danmuSwitch",
        type: "boolean",
        default: true
    }

}
export const Save: SaveConfig = new SaveConfig();
