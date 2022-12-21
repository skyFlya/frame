import { isValid, log } from "cc";
import { App } from "../app/App";


export class UIUtils {

    /**
     * 注册按钮点击事件
     * @param node 
     * @param func 
     * @param target 
     * @param delay 
     */
    public static addClickEvent(node: Node, func: (node: Node) => void, target: any, delay: number = 0.2): void {
        if (node && func && typeof(func) == 'function') {             
            node.on('click', ()=>{
                // 防止连续点击
                if (delay > 0) {
                    if (node && isValid(node)) {
                        const lastClickTime = node['__last_click_time__'];
                        if (lastClickTime && (new Date().getTime() - lastClickTime) <= delay * 1000) {
                            log('连点');
                            return;
                        }
                        node['__last_click_time__'] = new Date().getTime();
                    }
                }
                func.call(target, node);
                App.soundMgr.playClickSound();
            }, this);
        }
    }
}