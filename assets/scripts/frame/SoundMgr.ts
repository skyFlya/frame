import { _decorator, Component, Node, sys, AudioClip } from 'cc';
import { objectUtils } from './objectUtils';
const { ccclass, property } = _decorator;

@ccclass('SoundMgr')
export class SoundMgr extends Component {
    private static _instance: SoundMgr = null;

    private _isMusic: boolean = true;
    private _isSound: boolean = true;

    private _musicUrl: string = null;
    private _musicVolume: number = 0.6;


    public static getInstance(): SoundMgr {
        if (SoundMgr._instance == null) {
            SoundMgr._instance = new SoundMgr();
            SoundMgr._instance.init();
        }
        return SoundMgr._instance;
    }

    public static destroyInstance(): void {
        if (SoundMgr._instance) {
            SoundMgr._instance = null;
        }
    }

    private init(): void {
        const str = sys.localStorage.getItem(LocalStorageIDCfg.GAME_MUSIC_SOUND);
        if (str) {
            try {
                const data = JSON.parse(str);
                this._isMusic = data.music == false ? false : true;
                this._isSound = data.sound == false ? false : true;
            } catch (err) {
                this.save();
            }
        } else {
            this.save();
        }
    }

    private save(): void {
        sys.localStorage.setItem(LocalStorageIDCfg.GAME_MUSIC_SOUND, JSON.stringify({
            music: this.isMusic,
            sound: this.isSound
        }));
    }

    public get isMusic(): boolean {
        return this._isMusic;
    }

    public set isMusic(isMusic: boolean) {
        if (this._isMusic != isMusic) {
            this._isMusic = isMusic;
            this._isMusic ? this.playMusic(this._musicUrl, true, this._musicVolume) : this.stopMusic();
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
        audioEngine.stopMusic();
    }

    public playMusic(url: string, loop: boolean = true, volume: number = 0.2): void {        
        this._musicUrl = url;
        this._musicVolume = volume;
        if (this.isMusic) {
            let tempVolueme = this.checkMusicValue(url);            
            if(tempVolueme){
                volume = tempVolueme;
            }            
            
            objectUtils.loadRes(url, AudioClip, {
                onComplete: (err, clip: AudioClip) => {
                    if (clip) {
                        audioEngine.playMusic(clip, loop);
                        audioEngine.setMusicVolume(volume);
                    }
                }
            })
        }
    }

    public stopEffect(id: number): void {
        audioEngine.stop(id);
    }

    public stopAllEffects(): void {
        audioEngine.stopAllEffects();
    }

    public playEffect(url: string, loop: boolean = false, volume: number = 1) {
        if (this.isSound) {
            let tempVolueme = this.checkMusicValue(url);
            if(tempVolueme){
                volume = tempVolueme;
            }                        
            
            objectUtils.loadRes(url, AudioClip, {
                onComplete: (err, clip: AudioClip) => {
                    clip && audioEngine.play(clip, loop, volume);
                }
            })
        }
    }

    public playClickSound(): void {
        this.playEffect(`common/sounds/button`);
    }

    private checkMusicValue(name:string){
        let musicConfig = PlayerData.musicConfig;        

        if(musicConfig){
            for(let i = 0; i < musicConfig.length; i++){
                let tempName = "common/sounds/" + musicConfig[i].musicName;                                       

                if(tempName == name){                                        
                    return musicConfig[i].volumeControl;
                }
            }
        }        
    }



