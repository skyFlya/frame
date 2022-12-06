import { _decorator, Component, Node, AudioSource } from 'cc';
import { App } from '../app/App';
import { UICfg } from '../frame/const/UICfg';
import { ToastMgr } from './ToastMgr';

const { ccclass, property } = _decorator;

@ccclass('GameRoot')
export class GameRoot extends Component {

    @property(AudioSource)
    private audioSource: AudioSource = null;

    onLoad(){
        App.uiCfgMgr.initByCfg(UICfg);        

        App.soundMgr.init(this.audioSource);
        App.soundMgr.playMusic();              
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


