import { _decorator, Component, Node, error, Label, Sprite, sp, ProgressBar, EditBox, Button, RichText } from 'cc';
import { UIUtils } from '../UIUtils';
/**
 * 节点工具类
 */
export const NodeUtils = {
    /**自动绑定 */
    autoBindNode(node, context) {
        for (let idx in node.children) {
            let child: Node = node.children[idx]
            let name = child.name
            
            if (name.indexOf("_") == 0) {

            } else if (name.indexOf("!") == 0) {
                continue
            } else if (name.indexOf("lb") == 0) {
                if (context[name]) {
                    error("重名节点:" + name + "-" + context.name)
                }
                context[name] = child.getComponent(Label)
            } else if (name.indexOf("nd") == 0) {
                if (context[name]) {
                    error("重名节点:" + name + "-" + context.name)
                }
                context[name] = child
            } else if (name.indexOf("spr") == 0) {
                if (context[name]) {
                    error("重名节点:" + name + "-" + context.name)
                }
                context[name] = child.getComponent(Sprite)
            } else if (name.indexOf("ske") == 0) {
                if (context[name]) {
                    error("重名节点:" + name + "-" + context.name)
                }
                context[name] = child.getComponent(sp.Skeleton)
            } else if (name.indexOf("pb") == 0) {
                if (context[name]) {
                    error("重名节点:" + name + "-" + context.name)
                }
                context[name] = child.getComponent(ProgressBar)
            } else if (name.indexOf("ed") == 0) {
                if (context[name]) {
                    error("重名节点:" + name + "-" + context.name)
                }
                context[name] = child.getComponent(EditBox)
            } else if (name.indexOf("btn") == 0) {
                if (context[name]) {
                    error("重名节点:" + name + "-" + context.name)
                }
                context[name] = child.getComponent(Button)
                NodeUtils.autoBindButton(child, context)
            } else if (name.indexOf("rt") == 0) {
                if (context[name]) {
                    error("重名节点:" + name + "-" + context.name)
                }
                context[name] = child.getComponent(RichText)
            }
            if (child.children.length > 0) {
                NodeUtils.autoBindNode(child, context)
            }
        }
    },

    autoBindButton(node, context) {
        let name = node.name
        if (context[`${name}OnClick`]) {
            UIUtils.addClickEvent(node, () => {                
                context[`${name}OnClick`]()
            }, this, 0.2);
        }
    }

}