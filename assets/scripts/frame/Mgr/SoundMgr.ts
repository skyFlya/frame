import { _decorator, Component, Node, sys, AudioClip, AudioSource, resources } from 'cc';
import { App } from '../../app/App';
import { Save } from '../Save';
import { ObjectUtils } from '../utils/ObjectUtils';
const { ccclass, property } = _decorator;

@ccclass('SoundMgr')
export class SoundMgr extends Component {
    private static _instance: SoundMgr = null;

    private _isMusic: boolean = true;
    private _isSound: boolean = true;

    private _musicUrl: string = null;
    private _musicVolume: number = 0.6;

    private audioSource: AudioSource;


    public static getInstance(): SoundMgr {
        if (SoundMgr._instance == null) {
            SoundMgr._instance = new SoundMgr();            
        }
        return SoundMgr._instance;
    }

    public static destroyInstance(): void {
        if (SoundMgr._instance) {
            SoundMgr._instance = null;
        }
    }
    

    public init(audioSource: AudioSource): void {        
        let sountSwitch = App.saveManager.getItem(Save.bgmSwitch);        
        this._isMusic = sountSwitch.music == false ? false : true;
        this._isSound = sountSwitch.sound == false ? false : true;
        this.audioSource = audioSource;
    }

    private save(): void {        
        App.saveManager.setItem(Save.bgmSwitch, {music: this.isMusic, sound:this.isSound});
    }

    public get isMusic(): boolean {
        return this._isMusic;
    }

    public set isMusic(isMusic: boolean) {
        if (this._isMusic != isMusic) {
            this._isMusic = isMusic;
            this._isMusic ? this.playMusic() : this.stopMusic();
            this.save();
        }
    }

    public get isSound(): boolean {
        return this._isSound;
    }

    public set isSound(isSound: boolean) {
        if (this._isSound != isSound) {
            this._isSound = isSound;
            if (!isSound) {
                this.stopAllEffects();
            }
            this.save();
        }
    }

    public stopMusic(): void {
        this.audioSource.stop();
    }

    public playMusic(): void {        
        if (this.isMusic) {
            this.audioSource.play();
        }
    }

    public stopEffect(id: number): void {
        //audioEngine.stop(id);
    }

    public stopAllEffects(): void {
       // audioEngine.stopAllEffects();
    }

    public playEffect(url: string, volume: number = 1) {
        if (this.isSound) {                                           
            ObjectUtils.loadRes(url, AudioClip, {
                onComplete: (err, clip: AudioClip) => {
                    clip && this.audioSource.playOneShot(clip, volume);
                }
            })
        }        
    }

    public playClickSound(): void {
        this.playEffect(`soundsTest/按钮点击`);
    }

    private checkMusicValue(name:string){
        // let musicConfig = PlayerData.musicConfig;        

        // if(musicConfig){
        //     for(let i = 0; i < musicConfig.length; i++){
        //         let tempName = "common/sounds/" + musicConfig[i].musicName;                                       

        //         if(tempName == name){                                        
        //             return musicConfig[i].volumeControl;
        //         }
        //     }
        // }        
    }

}

