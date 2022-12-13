import { _decorator, Component, Node, Color, instantiate, Label, LabelOutline, Sprite, SpriteFrame } from 'cc';
import { App } from '../../app/App';
import { UICfg } from '../../frame/const/UICfg';
import { Save } from '../../frame/Save';
import { UIBase } from '../../frame/UIBase';
import { NodeUtils } from '../../frame/utils/NodeUtils';
import { ToastMgr } from '../ToastMgr';
const { ccclass, property } = _decorator;

@ccclass('PannelLevel')
export class PannelLevel extends UIBase {
    private lbLevel: Label = null;
    private lbAllAmount: Label = null;
    private ndContent: Node = null;
    private ndItem: Node = null;

    @property(SpriteFrame)
    private itemButtom: SpriteFrame[] = [];

    private itemConfig = [
        { count: 100, amount: 100, index: 1, isOk: false },
        { count: 500, amount: 100, index: 2, isOk: false },
        { count: 2000, amount: 200, index: 3, isOk: false },
        { count: 80000, amount: 300, index: 4, isOk: false },
        { count: 8000000, amount: 300, index: 5, isOk: false },
    ]

    constructor() {
        super();
        this._uiName = UICfg.PannelLevel.name;
    }

    onLoad(): void {
        NodeUtils.autoBindNode(this.node, this);
    }

    onEnable(): void {
        this.updateData();
    }

    start() {

    }

    updateData() {
        // let heChengCount = App.saveManager.getItem(Save.gameHeChengCount);
        // let amount = App.saveManager.getItem(Save.pannleLevelAmount);
        // let okTaskCount = App.saveManager.getItem(Save.pannleLevelOkTaskCount);
        // this.itemConfig = [
        //     { count: 100, amount: 100, index: 1, isOk: false },
        //     { count: 500, amount: 100, index: 2, isOk: false },
        //     { count: 2000, amount: 200, index: 3, isOk: false },
        //     { count: 80000, amount: 300, index: 4, isOk: false },
        //     { count: 8000000, amount: 300, index: 5, isOk: false },
        // ]        

        // for (let i = 0; i < this.itemConfig.length; i++) {
        //     if (i < okTaskCount) {
        //         this.itemConfig[i].isOk = true;
        //         this.itemConfig[i].index = 99 + i;
        //     }
        // }
        // this.itemConfig.sort((a, b) => {
        //     return a.index - b.index;
        // })


        // this.lbLevel.string = `当前合成次数： ${heChengCount}次`;
        // this.lbAllAmount.string = `￥${amount}`;
        // let pad = this.itemConfig.length - this.ndContent.childrenCount;
        // if (pad > 0) {
        //     for (let i = 0; i < pad; i++) {
        //         let item = instantiate(this.ndItem);
        //         this.ndContent.addChild(item);
        //     }
        // }
        // let child = this.ndContent.children;
        // let tempColor = new Color();

        // for (let i = 0; i < child.length; i++) {
        //     if (child[i] && this.itemConfig[i]) {
        //         let item = child[i];
        //         let itemData = this.itemConfig[i];
        //         let have = item.getChildByName("have");
        //         let no = item.getChildByName("no");
        //         let buttom = have.getChildByName("buttom");
        //         buttom[`itemData`] = this.itemConfig[i];
        //         if (i <= 1 || itemData.isOk) {
        //             item.getChildByName("no").active = false;
        //             have.active = true;

        //             let content = have.getChildByName("content").getComponent(Label);
        //             let bra = have.getChildByName("braBG").getChildByName("bra");

        //             have.getChildByName("braBG").getChildByName("lbPad").getComponent(Label).string = `${heChengCount} / ${itemData.count}`
        //             have.getChildByName("amount").getComponent(Label).string = `${itemData.amount}元`;
        //             if (itemData.isOk) {
        //                 content.string = `已领取奖励`;
        //                 content.node.color = tempColor.fromHEX("#DDDBD0");

        //                 buttom.getComponent(Sprite).spriteFrame = this.itemButtom[2];
        //                 buttom.getChildByName("buttomLb").getComponent(Label).string = "已领取";
        //                 buttom.getChildByName("buttomLb").getComponent(LabelOutline).color = tempColor.fromHEX("#A2675C");
        //                 bra.getComponent(Sprite).fillRange = 1;
        //                 have.getChildByName("amount").color = tempColor.fromHEX("#90AECB");
        //             }
        //             else if (heChengCount >= itemData.count) {
        //                 content.string = `任务完成`;
        //                 content.node.color = new Color().fromHEX("#1D84EB");

        //                 buttom.getComponent(Sprite).spriteFrame = this.itemButtom[1];
        //                 buttom.getChildByName("buttomLb").getComponent(Label).string = "可领取";
        //                 buttom.getChildByName("buttomLb").getComponent(LabelOutline).color = new Color().fromHEX("#FF5320");
        //                 bra.getComponent(Sprite).fillRange = 1;
        //                 have.getChildByName("amount").color = new Color().fromHEX("#DF362D");
        //             }
        //             else {
        //                 content.string = `再合成${itemData.count - heChengCount}次可领取奖励`;
        //                 content.node.color = new Color().fromHEX("#1D84EB");

        //                 buttom.getComponent(Sprite).spriteFrame = this.itemButtom[0];
        //                 buttom.getChildByName("buttomLb").getComponent(Label).string = "去完成";
        //                 buttom.getChildByName("buttomLb").getComponent(LabelOutline).color = new Color().fromHEX("#154A95");
        //                 bra.getComponent(Sprite).fillRange = heChengCount / itemData.count;
        //                 have.getChildByName("amount").color = new Color().fromHEX("#DF362D");
        //             }
        //         }
        //         else {
        //             no.active = true;
        //             have.active = false;
        //             no.getChildByName("lbNoAmount").getComponent(Label).string = `${itemData.amount}元`;
        //         }
        //     }

        // }
    }


    clickItemButtom(e) {
        // let buttom = e.currentTarget;
        // let itemData = buttom[`itemData`];
        // let heChengCount = App.saveManager.getItem(Save.gameHeChengCount);        
        // if (!itemData.isOk) {
        //     if (heChengCount >= itemData.count) {
        //         App.saveManager.setItem(Save.pannleLevelOkTaskCount, App.saveManager.getItem(Save.pannleLevelOkTaskCount) + 1);

        //         let tempAmount = App.saveManager.getItem(Save.pannleLevelAmount) + itemData.amount;
        //         if (tempAmount < 1000) {
        //             App.saveManager.setItem(Save.pannleLevelAmount, tempAmount);
        //         }

        //         App.uiMgr.openUI(UICfg.PannelRedPrize.name, (node) => {
        //             node.getComponent(PannelRedPrize).setData(itemData.amount, this.lbAllAmount.node);
        //             this.updateData();
        //         });                
        //     }
        //     else {
        //         this.onCloseClick();
        //     }
        // }
        // else {
        //     ToastMgr.getInstance().showToast("已领取");
        // }
    }

    btnWeixinOnClick() {
        ToastMgr.getInstance().showToast("满1000元才能提现哦");
    }

    btnCloseOnClick() {
        this.onCloseClick();
    }
}

