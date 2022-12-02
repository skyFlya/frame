import { _decorator, Component, Node, Prefab, Vec3, tween, CCObject, UITransform } from 'cc';
import { App } from '../app/App';
import { EventIDCfg } from '../frame/EventIDCfg';
import { MathUtils } from '../frame/MathUtils';
import { NodeUtils } from '../frame/NodeUtils';
const { ccclass, property } = _decorator;

@ccclass('GameEffect')
export class GameEffect extends Component {

    @property(Prefab)
    private redPre: Prefab = null;

    @property(Prefab)
    private candyRemoveEf:Prefab = null;

    @property(Node)
    private cashoutRed:Node = null;

    private cashoutRedPos:Vec3 = null;

    onLoad(){
        App.EventMgr.on(EventIDCfg.CANDY_REMOVE, this.candyRemove, this)
    }

    start() {
       this.cashoutRedPos = MathUtils.convertToParent(this.cashoutRed, this.node);
    }

    candyRemove(startPos:Vec3, delayTime:number){
        startPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(startPos);        
        this.playCandyMove(startPos)
        this.gotoRed(startPos, delayTime);
    }

    gotoRed(startPos:Vec3, delayTime:number){                                    
        let redPred = App.poolManager.getNode(this.redPre, this.node);
        redPred.setPosition(startPos);
        tween(redPred).delay(delayTime).to(0.3, {position: this.cashoutRedPos}).call(()=>{
            App.poolManager.putNode(redPred);
        }).start();
    } 
    
    playCandyMove(startPos:Vec3){
        // let candyRemoveEf = App.poolManager.getNode(this.candyRemoveEf, this.node);
        // candyRemoveEf.setPosition(startPos);
        // tween(candyRemoveEf).delay(0.3).call(()=>{
        //    App.poolManager.putNode(candyRemoveEf);
        // }).start();
    }



}


