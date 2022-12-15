import { _decorator, Component, Node, SpriteFrame, Sprite, tween, Vec2, Vec3, UITransform, v3, UIOpacity, Tween } from 'cc';
import { App } from '../app/App';
import { EventIDCfg } from '../frame/const/EventIDCfg';
import { PlayerDataMgr } from '../frame/Mgr/PlayerDataMgr';
import { MathUtils } from '../frame/utils/MathUtils';
const { ccclass, property } = _decorator;

@ccclass('CandyPrefab')
export class CandyPrefab extends Component {

    @property(SpriteFrame)
    private iconFrame: SpriteFrame[] = [];

    @property(Sprite)
    private candySpr: Sprite = null;

    @property(UIOpacity)
    private tipIcon: UIOpacity = null;

    private startType;      //当前颜色

    private candySize;

    private posX;
    private posY;

    onLoad() {
        this.candySize = this.iconFrame[0].width;
        if(App.playerDataMgr.candySize != this.candySize){
            App.playerDataMgr.candySize = this.candySize;
        }

        this.node.on(Node.EventType.TOUCH_START, this.onClick, this);
    }

    onClick(e){
       console.log(this.posX + "|" + this.posY)
       App.EventMgr.emit(EventIDCfg.CLICK_START, this.posX, this.posY);
    }

    start() {

    }

    update(deltaTime: number) {

    }

    // 设置网格坐标
    public setGridXY(x, y) {
        this.node.setPosition(this.getPos(x, y));
    }

    //移动糖果位置，这个一般初始化棋盘采用
    public hzGo(x, y, delay, needTime = 0.1) {
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
            App.EventMgr.emit(EventIDCfg.CANDY_REMOVE, this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)), delay2);
            App.poolMgr.putNode(this.node);
        }).start();
    }

    //移动糖果位置时,先往上抖一下
    public vtGo(x, y, delay) {
        tween(this.node).delay(delay)
            .by(0.1, { position: new Vec3(0, 20) })
            .to(0.1, { position: this.getPos(x, y) })
            .start();
    }

    //显示提示
    public tip() {
        tween(this.tipIcon).repeat(4, tween().to(0.5, { opacity: 255 }).to(0.5, { opacity: 0 })).start();
    }

    //停止提示
    public stopTip() {
        Tween.stopAllByTarget(this.tipIcon)
        this.tipIcon.opacity = 0;
    }

    //根据x,y获取位置
    public getPos(x, y): Vec3 {
        this.posX = x;
        this.posY = y;
        return new Vec3(x * this.candySize + this.candySize / 2, y * this.candySize + this.candySize / 2)
    }


}


