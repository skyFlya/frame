import { game } from "cc";

export class EventMgr {

    private static _instance: EventMgr = null;

    public static getInstance(): EventMgr {
        if (EventMgr._instance == null) {
            EventMgr._instance = new EventMgr();
        }
        return EventMgr._instance;
    }

    public on(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any, useCapture?: boolean): void {
        game.on(type, callback, target, useCapture);
    }

    public off(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void {
        game.off(type, callback, target);
    }

    public emit(key: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        game.emit(key, arg1, arg2, arg3, arg4, arg5);
    }

    public hahasEventListeners(key: string): boolean {
        return game.hasEventListener(key);
    }

    public once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void {
        game.once(type, callback, target);
    }

    public removeAll(keyOrTarget: any): void {
        game.removeAll(keyOrTarget);
    }

    public targetOff(target: any): void {
        game.targetOff(target);
    }
}

