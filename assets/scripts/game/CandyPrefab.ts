import { _decorator, Component, Node, SpriteFrame, Sprite, tween, Vec2, Vec3, UITransform, v3 } from 'cc';
import { App } from '../app/App';
import { EventIDCfg } from '../frame/EventIDCfg';
const { ccclass, property } = _decorator;

@ccclass('CandyPrefab')
export class CandyPrefab extends Component {

    @property(SpriteFrame)
    private iconFrame: SpriteFrame[] = [];

    @property(Sprite)
    private candySpr: Sprite = null;

    @property(Node)
    private redNode: Node = null;

    private startType;      //当前颜色

    private candySize;

    onLoad() {
        this.candySize = this.iconFrame[0].width
    }

    start() {

    }

    update(deltaTime: number) {

    }

    // 设置网格坐标
    public setGridXY(x, y) {
        this.node.setPosition(this.getPos(x, y));
    }

    //移动糖果位置
    public goTo(x, y, delay, needTime = 0.1) {
        // this.node.runAction(sequence(
        //     delayTime(delay),
        //     cc.moveTo(needTime, cc.v2((x - 5) * this.candySize + this.candySize / 2, (y - 5) * this.candySize + this.candySize / 2))
        // ));
        tween(this.node).delay(delay)
            .to(needTime, { position: this.getPos(x, y) })
            .start();
    }

    //设置糖果类型
    public setType(type) {
        this.startType = type;
        this.candySpr.spriteFrame = this.iconFrame[type];
    }

    //开启消失粒子
    public clear(delay1 = 0, delay2 = 0) {
        // setTimeout(() => {
        //     if (play) {
        //         //Global.playMusic("ClearStart");
        //     }
        //     this.node.destroy();
        //     //this.particleManage.goto(this.node.x, this.node.y, this.startType);
        // }, delay * 1000);        

        tween(this.node).delay(delay1).call(() => {
            App.EventMgr.emit(EventIDCfg.RED_GOTO_CASHOUT, this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)), delay2);
            this.node.destroy();
        }).start();        
    }

    //移动糖果位置时,先往上抖一下
    public moveTo(x, y, delay) {
        tween(this.node).delay(delay)
            .by(0.1, { position: new Vec3(0, 20) })
            .to(0.1, { position: this.getPos(x, y) })
            .start();
    }

    public getPos(x, y): Vec3 {
        return new Vec3(x * this.candySize + this.candySize / 2, y * this.candySize + this.candySize / 2)
    }


}


