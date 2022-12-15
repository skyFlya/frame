import { _decorator, Component, Node, Label, Button } from 'cc';
import { App } from '../app/App';
import { EventIDCfg } from '../frame/const/EventIDCfg';
import { NodeUtils } from '../frame/utils/NodeUtils';
const { ccclass, property } = _decorator;

@ccclass('GameTest')
export class GameTest extends Component {

    private lbCur:Label = null;
    private lbPass:Label = null;
    private lbTarget:Label = null;
    private lbTipPass:Label = null;
    private lbTipTarget:Label = null;
    private ndPassUI:Node = null;

    private btnSet:Button = null;

    private curPass = 1;
    private curSocre = 0;

    onLoad(){
        NodeUtils.autoBindNode(this.node, this);
        App.EventMgr.on(EventIDCfg.ADD_MONEY, this.updateData, this);

        App.EventMgr.on(EventIDCfg.GAME_OVER, this.passShow, this);   
        App.EventMgr.on(EventIDCfg.CANDY_REMOVE, this.candyRemove, this)    
    }

    start() {

    }

    candyRemove(){
        this.curSocre += 10;
        this.lbCur.string =  this.curSocre + "";
    }

    updateData(){
        this.lbCur.string =  this.curSocre + "";
        this.lbPass.string = `关卡:${this.curPass}`;
        this.lbTarget.string = `目标:${this.curPass * 1000}`;
    }

    passShow(){
        this.curPass += 1;
        this.lbTipPass.string = `第${this.curPass}关;`
        this.lbTipTarget.string = `目标:${this.curPass * 1000}`;
        this.ndPassUI.active = true;

        setTimeout(() => {
            App.EventMgr.emit(EventIDCfg.GAME_START);
            this.updateData();
            this.ndPassUI.active = false;
        }, 2000);
    }

}


