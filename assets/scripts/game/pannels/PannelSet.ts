import { _decorator, Component, Node, CCObject, Button, SpriteFrame, Sprite, Label } from 'cc';
import { App } from '../../app/App';
import { UICfg } from '../../frame/const/UICfg';
import { SoundMgr } from '../../frame/Mgr/SoundMgr';
import { UIBase } from '../../frame/UIBase';
import { NodeUtils } from '../../frame/utils/NodeUtils';
import { ToastMgr } from '../ToastMgr';
const { ccclass, property } = _decorator;

@ccclass('PannelSet')
export class PannelSet extends UIBase {

    private btnMusic: Button;
    private btnSound: Button;
    private btnOnLine: Button;    
    private btnClearData: Button;
    private btnOpenUser: Button;
    private btnPrivacy: Button;
    private btnAbout: Button;

    @property(SpriteFrame)
    private swtichFrame: SpriteFrame[] = [];

    @property(SpriteFrame)
    private swtichOnFrame: SpriteFrame[] = [];

    constructor() {
        super();
        this._uiName = UICfg.PannelSet.name;
    }

    onLoad() {
        NodeUtils.autoBindNode(this.node, this);
    }

    start() {
        this.checkMusic();
        this.checkSound();
    }

    btnMusicOnClick() {
        SoundMgr.getInstance().isMusic = !SoundMgr.getInstance().isMusic;
        this.checkMusic();
    }

    btnSoundOnClick(){
        SoundMgr.getInstance().isSound = !SoundMgr.getInstance().isSound;
        this.checkSound();
    }

    checkMusic() {
        if (SoundMgr.getInstance().isMusic) {
            this.btnMusic.node.getChildByName("on1").getComponent(Sprite).spriteFrame = this.swtichFrame[1];

            let on = this.btnMusic.node.getChildByName("on1").getChildByName("on2");
            on.getComponent(Sprite).spriteFrame = this.swtichOnFrame[1];
            on.setPosition(27, on.position.y);

            let lb = this.btnMusic.node.getChildByName("on1").getChildByName("Label");
            lb.getComponent(Label).string = "ON";
            lb.setPosition(-21, lb.position.y);
        }
        else {
            this.btnMusic.node.getChildByName("on1").getComponent(Sprite).spriteFrame = this.swtichFrame[0];
            
            let on = this.btnMusic.node.getChildByName("on1").getChildByName("on2");
            on.getComponent(Sprite).spriteFrame = this.swtichOnFrame[0];
            on.setPosition(-27, on.position.y);

            let lb = this.btnMusic.node.getChildByName("on1").getChildByName("Label");
            lb.getComponent(Label).string = "OFF";
            lb.setPosition(21, lb.position.y);
        }
    }

    checkSound(){
        if (SoundMgr.getInstance().isSound) {
            this.btnSound.node.getChildByName("on1").getComponent(Sprite).spriteFrame = this.swtichFrame[1];

            let on = this.btnSound.node.getChildByName("on1").getChildByName("on2");
            on.getComponent(Sprite).spriteFrame = this.swtichOnFrame[1];
            on.setPosition(27, on.position.y);

            let lb = this.btnSound.node.getChildByName("on1").getChildByName("Label");
            lb.getComponent(Label).string = "ON";
            lb.setPosition(-21, lb.position.y);
        }
        else {
            this.btnSound.node.getChildByName("on1").getComponent(Sprite).spriteFrame = this.swtichFrame[0];
            
            let on = this.btnSound.node.getChildByName("on1").getChildByName("on2");
            on.getComponent(Sprite).spriteFrame = this.swtichOnFrame[0];
            on.setPosition(-27, on.position.y);

            let lb = this.btnSound.node.getChildByName("on1").getChildByName("Label");
            lb.getComponent(Label).string = "OFF";
            lb.setPosition(21, lb.position.y);
        }
    }

    btnOnLineOnClick(){
        App.webViewMgr.openWebModuleWithType("/help/feedbacklist");
    }

    btnClearDataOnClick(){
        App.saveManager.removeAllItem();
        ToastMgr.getInstance().showToast("已清除");
    }

    btnOpenUserOnClick(){
        App.webViewMgr.openWebModuleWithType("/help/protocol");
    }

    btnPrivacyOnClick(){
        App.webViewMgr.openWebModuleWithType("/help/privacy_protocol");
    }

    btnAboutOnClick(){

    }

    btnCloseOnClick(){
        console.error("关闭");
        
        this.onCloseClick();
    }

}


