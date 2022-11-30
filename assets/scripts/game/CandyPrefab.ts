import { _decorator, Component, Node, SpriteFrame, Sprite, tween, Vec2 } from 'cc';
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

    onLoad(){
        this.candySize = this.iconFrame[0].width
    }

    start() {
       
    }

    update(deltaTime: number) {

    }

    // 设置网格坐标
    public setGridXY(x, y) {
        this.node.setPosition((x - 5) * this.candySize + this.candySize / 2, (y - 5) * this.candySize + this.candySize / 2);
    }

    //移动糖果位置
    public goTo(x, y, delay, needTime = 0.1) {
        // this.node.runAction(sequence(
        //     delayTime(delay),
        //     cc.moveTo(needTime, cc.v2((x - 5) * this.candySize + this.candySize / 2, (y - 5) * this.candySize + this.candySize / 2))
        // ));
        tween(this.node.position).delay(delay).to(needTime, new Vec2((x - 5) * this.candySize + this.candySize / 2, (y - 5) * this.candySize + this.candySize / 2)).start();
    }

    //设置糖果类型
    public setType(type) {
        this.startType = type;
        this.candySpr.spriteFrame = this.iconFrame[type];
    }


}


