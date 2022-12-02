import { MathUtils } from "./MathUtils";
import { _decorator, Node, Vec3, SpriteFrame, Canvas, director, Sprite, tween, UITransform, Layers } from 'cc';
/**
 * 动画工具类
 */
export const AnimateUtils = {

    /**
   * 播放一个贝塞尔曲线的播放轨迹,用于金币，砖石，道具飞入背包
   * @param spriteFrame 
   * @param startNode 
   * @param target 
   * @param callback 
   * @param scale 
   */
    playAnimate(spriteFrame: SpriteFrame, startNode: Node, targetNode: Node, callback: Function) {
        let startPos = MathUtils.nodeToWorld(new Vec3(0, 0, 0), startNode);
        let endPos = MathUtils.nodeToWorld(new Vec3(0, 0, 0), startNode);


        let node = new Node();
        node.setSiblingIndex(2001)
        node.setPosition(startPos);
        let sprite: Sprite = node.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
        sprite.type = Sprite.Type.SIMPLE;
        sprite.sizeMode = Sprite.SizeMode.RAW;
        sprite.trim = false;
        node.parent = director.getScene().getChildByName('Canvas');
        let actions = [];
        // let midPos = v2(startPos.x + 150, startPos.y - 150);
        // let bezier = [startPos, midPos, endPos];
        // let bezierTo = bezierTo(0.5, bezier);
        // let scaleTo = scaleTo(0.5, 0.3, 0.3)
        // actions.push(delayTime(0.3));
        // actions.push(spawn(scaleTo, bezierTo));
        // actions.push(fadeOut(0.2))
        // actions.push(callFunc(() => {
        //     node.destroy();
        //     callback && callback(targetNode);
        // }))

        // node.runAction(sequence(actions));
    },


    /**
    * 用于金币，砖石，道具飞入背包
    * @param spriteFrame 
    * @param startNode 
    * @param target 
    * @param callback 
    * @param scale 
    */
    playGoAni(spriteFrame: SpriteFrame, startNode: Node, targetNode: Node, callback?: Function) {
        let canvas = director.getScene().getChildByName('Canvas');
        let startPos = MathUtils.convertToParent(startNode, canvas);
        let endPos = MathUtils.convertToParent(targetNode, canvas);


        let node = new Node();
        node.setSiblingIndex(2001);
        node.setPosition(startPos);
        node.layer = Layers.Enum.UI_2D;
        let sprite: Sprite = node.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
        sprite.type = Sprite.Type.SIMPLE;
        sprite.sizeMode = Sprite.SizeMode.RAW;
        sprite.trim = false;
        node.parent = canvas;        
        
        tween(node).to(0.5, {position: endPos}).call(()=>{
            node.destroy();
        }).start();
    },


}
