import { _decorator, Component, Node, Prefab, Vec3, tween, CCObject, UITransform, dragonBones } from 'cc';
import { App } from '../app/App';
import { EventIDCfg } from '../frame/const/EventIDCfg';
import { SoundCfg } from '../frame/const/SoundCfg';
import { MathUtils } from '../frame/utils/MathUtils';
const { ccclass, property } = _decorator;

@ccclass('GameEffect')
export class GameEffect extends Component {

    @property(Prefab)
    private redPre: Prefab = null;

    @property(Prefab)
    private candyRemoveEf: Prefab = null;

    @property(Node)
    private cashoutRed: Node = null;

    private cashoutRedPos: Vec3 = null;

    onLoad() {
        App.EventMgr.on(EventIDCfg.CANDY_REMOVE, this.candyRemove, this);
    }

    start() {
        if (this.cashoutRedPos) {
            this.cashoutRedPos = MathUtils.convertToParent(this.cashoutRed, this.node);
        }

        // for (let i = 0; i < 20; i++) {
        //     let temp = App.poolMgr.getNode(this.candyRemoveEf, this.node);
        //     App.poolMgr.putNode(temp);
        // }
    }

    candyRemove(startPos: Vec3, delayTime: number) {
        startPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(startPos);
        this.playCandyMove(startPos);
        this.gotoRed(startPos, delayTime);
        App.soundMgr.playEffect(SoundCfg.clickButtom)
    }

    gotoRed(startPos: Vec3, delayTime: number) {
        if (!this.cashoutRedPos) return;
        let redPred = App.poolMgr.getNode(this.redPre, this.node);
        redPred.setPosition(startPos);
        tween(redPred).delay(delayTime).to(0.3, { position: this.cashoutRedPos }).call(() => {
            App.soundMgr.playEffect(SoundCfg.addGold)
            App.poolMgr.putNode(redPred);
        }).start();
    }

    playCandyMove(startPos: Vec3) {
        let candyRemoveEf = App.poolMgr.getNode(this.candyRemoveEf, this.node);
        candyRemoveEf.setPosition(startPos);
        let dragon = candyRemoveEf.getChildByName("bones").getComponent(dragonBones.ArmatureDisplay)
        dragon.playAnimation("Sprite", 1)
        tween(candyRemoveEf).delay(0.3).call(() => {
            App.poolMgr.putNode(candyRemoveEf);
        }).start();
    }

    private removeTip(num: number) {
        if (num < 5) {
            App.soundMgr.playEffect(SoundCfg.combo1);
        }
        else if (num >= 5 && num <= 7) {
            App.soundMgr.playEffect(SoundCfg.combo2);
        }
        else if (num >= 8 && num <= 10) {
            App.soundMgr.playEffect(SoundCfg.combo3);
        }
        else if (num > 10 && num <= 15) {
            App.soundMgr.playEffect(SoundCfg.combo4);
        }
        else if (num > 15) {
            App.soundMgr.playEffect(SoundCfg.combo5);
        }
    }

}


