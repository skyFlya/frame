import { _decorator, Component, Node, Prefab, UITransform, v3, Vec3, CCObject, Sprite, DEFAULT_OCTREE_DEPTH, Layers, Button } from 'cc';
import { App } from '../app/App';
import { CandyPrefab } from './CandyPrefab';
import { Global } from './Global';
import { MathUtils } from '../frame/utils/MathUtils';
import { NodeUtils } from '../frame/utils/NodeUtils';
import { SoundCfg } from '../frame/const/SoundCfg';
import { ToastMgr } from './ToastMgr';
import { PlayerDataMgr } from '../frame/Mgr/PlayerDataMgr';
import { EventIDCfg } from '../frame/const/EventIDCfg';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {

    @property(Prefab)
    private candyPre: Prefab = null;

    private ndCandyNode: Node = null;       //游戏棋盘

    private candyList = [];     //存储节点  

    private gridList = [];      //存储颜色

    private noClick = false;    //禁止点击

    private tipTime = 5;
    private recordTipTime = 0;

    private sameCandy = {           //相同颜色
        select: false,
        connectCandy: []
    };

    private tipSameCandy = [];      //提示相同的糖果

    onLoad() {
        NodeUtils.autoBindNode(this.node, this);
        this.addevent();
    }


    start() {
        this.createGrid();
    }

    private addevent() {
        let self = this;        
        App.EventMgr.on(EventIDCfg.CLICK_START, this.touchStar, this);

        App.EventMgr.on(EventIDCfg.GAME_START, this.createGrid, this);
    }

    update(deltaTime: number) {
        this.recordTipTime += deltaTime;
        if (this.recordTipTime > 5) {
            this.recordTipTime = 0;
            this.gameTip();
        }
    }


    //生成棋盘
    private createGrid() {
        console.log("游戏开始");

        let self = this;
        let candyList = [];
        let gridList = [];
        var gridLength = Global.gridLength;

        this.ndCandyNode.getComponent(UITransform).width = this.ndCandyNode.getComponent(UITransform).height = Global.gridLength * App.playerDataMgr.candySize;

        for (let i = 0; i < gridLength; i++) {
            candyList[i] = [];
            gridList[i] = [];
        }

        for (let i = 0; i < gridLength; i++) {
            for (let j = 0; j < gridLength; j++) {
                let candyNode = self.getCandy();
                let candy: CandyPrefab = candyNode.getComponent(CandyPrefab);
                candy.setGridXY(i, j);
                candy.hzGo(i, j, 0, 0.3);
                var color = Math.floor(Math.random() * 2);
                candy.setType(color);
                candyList[i][j] = candyNode;
                gridList[i][j] = color;
            }
        }
        console.log("坐标", gridList);

        self.candyList = candyList;
        self.gridList = gridList;
    }

    //获取糖果
    private getCandy() {
        return App.poolMgr.getNode(this.candyPre, this.ndCandyNode);
    }

    // 点击了一个糖果，xy为数据坐标
    private touchStar(x, y) {
        if (this.noClick) return;
        this.noClick = true;
        this.stopGameTip();

        let self = this;

        console.log("点击坐标", "x", y, "y", x)
        //ToastMgr.getInstance().showToast(`点击坐标,"x", ${y}, "y", ${x}`)
        if (x < Global.gridLength && y < Global.gridLength) {
            if (self.gridList[x][y] != 99) {
                // 相连的糖果
                self.sameCandy.connectCandy = [[x, y]];
                self.checkStar(x, y);
                //消除糖果
                self.cleanOnce();
            }
            else {
                this.noClick = false;
            }
        }
        else {
            this.noClick = false;
        }
    }

    // 递归查找相连的糖果
    private checkStar(x, y) {
        let self = this;
        var starType = self.gridList[x][y];
        var scanCandy = [[x + 1, y], [x - 1, y], [x, y - 1], [x, y + 1]];
        for (var i = scanCandy.length - 1; i >= 0; i--) {
            var scanX = scanCandy[i][0];
            var scanY = scanCandy[i][1];
            if (self.inGrid(scanX, scanY)
                && self.gridList[scanX][scanY] == starType
                && !self.connectContain(scanX, scanY)
            ) {
                self.sameCandy.connectCandy[self.sameCandy.connectCandy.length] = [scanX, scanY];
                self.checkStar(scanX, scanY);
            }
        }
    }

    // 相连数组里是否有该坐标
    private connectContain(x, y) {
        for (var i = this.sameCandy.connectCandy.length - 1; i >= 0; i--) {
            var candy = this.sameCandy.connectCandy[i];
            if (candy[0] == x && candy[1] == y) {
                return true;
            }
        }
        return false;
    }

    //判断是不是在这个区域
    private inGrid(x, y) {
        return x >= 0 && x < Global.gridLength && y >= 0 && y < Global.gridLength;
    }

    // 做一次消除操作
    private cleanOnce() {
        let self = this;
        // 清除糖果
        self.clearConnectCandy();
    }

    // 清除相连数组里的糖果
    private clearConnectCandy() {
        let self = this;
        var connectLength = self.sameCandy.connectCandy.length
        if (connectLength > 1) {
            //Global.playMusic("ClearStart");

            var initPosition = self.sameCandy.connectCandy[0]; //分数飘动的初始位置
            var score = (Math.pow(connectLength, 2) * 5) / connectLength;

            let removeTime = 32;
            if (connectLength <= 4) {
                removeTime = 16;
            }

            for (var i = connectLength - 1; i >= 0; i--) {
                var candy = self.sameCandy.connectCandy[i];
                self.gridList[candy[0]][candy[1]] = 99;
                self.candyList[candy[0]][candy[1]].getComponent(CandyPrefab).clear(i / removeTime, (connectLength - 1) / removeTime);
                self.candyList[candy[0]][candy[1]] = null;

                //分数飘动                
                // self.scoreManage.goTo(initPosition[0], initPosition[1], i * 0.1, score);
                if (i == 0) {
                    this.scheduleOnce(() => {
                        // 让糖果下落
                        self.fallDownStar();
                        // // 让糖果往左靠
                        self.fallLeftStar();
                        //检测本关是否结束
                        setTimeout(() => {
                            App.playerDataMgr.gold += connectLength * 10;
                            if (connectLength < 5) {
                                App.soundMgr.playEffect(SoundCfg.combo1);
                            }
                            else if (connectLength >= 5 && connectLength <= 7) {
                                App.soundMgr.playEffect(SoundCfg.combo2);
                            }
                            else if (connectLength >= 8 && connectLength <= 10) {
                                App.soundMgr.playEffect(SoundCfg.combo3);
                            }
                            else if (connectLength > 10 && connectLength <= 15) {
                                App.soundMgr.playEffect(SoundCfg.combo4);
                            }
                            else if (connectLength > 15) {
                                App.soundMgr.playEffect(SoundCfg.combo5);
                            }



                            if (self.checkOver()) {
                                self.overCal();
                            }
                            this.noClick = false;
                        }, 500);
                    }, (connectLength - 1) / removeTime + 0.3)
                }
            }
        }
        else {
            this.noClick = false;
            //Global.playMusic("Click");
        }
    }

    // 让糖果下落
    private fallDownStar() {
        let self = this;
        var max = Global.gridLength;

        // 遍历每一列
        for (var x = 0; x < max; x++) {
            // 下落的距离
            var fallDistance = 0;
            // 从下往上，遍历每一个糖果
            for (var y = 0; y < max; y++) {
                // 如果是空，则增加一个下落距离
                if (self.gridList[x][y] == 99) {
                    fallDistance++;
                }
                // 如果需要下落且当前不是空，就记录到下落数组里
                if (fallDistance > 0 && self.gridList[x][y] < 99) {
                    self.gridList[x][y - fallDistance] = self.gridList[x][y];
                    self.gridList[x][y] = 99;
                    self.candyList[x][y].getComponent(CandyPrefab).vtGo(x, y - fallDistance, 0);
                    self.candyList[x][y - fallDistance] = self.candyList[x][y];
                    self.candyList[x][y] = null;
                }
            }
        }
    }

    // 让糖果左靠
    private fallLeftStar() {
        let self = this;
        var max = Global.gridLength;
        // 左靠距离
        var fallLeftDistance = 0;
        for (var x = 0; x < max; x++) {
            // 如果最底下的糖果是空，则整列都是空，就加一个距离
            if (self.gridList[x][0] == 99) {
                fallLeftDistance++;
            }
            // 如果该列有糖果，并且需要左靠
            if (self.gridList[x][0] != 99 && fallLeftDistance != 0) {
                // 执行左靠
                for (var y = 0; y < max; y++) {
                    if (self.gridList[x][y] < 99) {
                        self.gridList[x - fallLeftDistance][y] = self.gridList[x][y];
                        self.gridList[x][y] = 99;
                        self.candyList[x][y].getComponent(CandyPrefab).hzGo(x - fallLeftDistance, y, 0.3);
                        self.candyList[x - fallLeftDistance][y] = self.candyList[x][y];
                        self.candyList[x][y] = null;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    //判断游戏是否结束
    private checkOver() {
        if (this.checkGameCandy()) {
            return false;
        }
        return true;
    }

    //游戏提示
    private gameTip() {
        let self = this;
        let pos = this.checkGameCandy(true);
        if (pos) {
            self.sameCandy.connectCandy = [[pos.x, pos.y]];
            self.checkStar(pos.x, pos.y);
            var connectLength = self.sameCandy.connectCandy.length;
            if (connectLength > 1) {
                for (var i = connectLength - 1; i >= 0; i--) {
                    var candy = self.sameCandy.connectCandy[i];
                    if (self.gridList[candy[0]][candy[1]] != 99) {
                        self.candyList[candy[0]][candy[1]].getComponent(CandyPrefab).tip();
                    }
                }
            }
        }
        this.tipSameCandy = self.sameCandy.connectCandy;
    }

    //停止提示
    private stopGameTip() {
        this.recordTipTime = 0;
        if (this.tipSameCandy && this.tipSameCandy.length > 1) {
            for (var i = this.tipSameCandy.length - 1; i >= 0; i--) {
                var candy = this.tipSameCandy[i];
                if (this.gridList[candy[0]][candy[1]] != 99) {
                    this.candyList[candy[0]][candy[1]].getComponent(CandyPrefab).stopTip();
                }
            }
            this.tipSameCandy = null;
        }
    }

    //检查游戏内是否有可消除对象
    private checkGameCandy(isTip = false) {
        let self = this;
        var max = Global.gridLength;

        if (isTip) {
            //提示需要从左上开始
            for (var x = 0; x < max; x++) {
                for (var y = max - 1; y >= 0; y--) {
                    let starType = self.gridList[x][y];
                    if (starType != 99) {
                        // 要扫描的4个糖果（上下左右）
                        let scanStar = [[x + 1, y], [x - 1, y], [x, y - 1], [x, y + 1]];
                        for (var i = 0; i < scanStar.length; i++) {
                            // 如果被扫描的4个中有相连的，就直接返回false
                            var tmpX = scanStar[i][0];
                            var tmpY = scanStar[i][1];
                            if (self.inGrid(tmpX, tmpY) && self.gridList[tmpX][tmpY] == starType) {
                                return { x: x, y: y };
                            }
                        }
                    }
                }
            }
        }
        else {
            // 先遍历列，效率高一些，因为如果一个糖果为空，那上面一定没有糖果了
            for (var x = 0; x < max; x++) {
                for (var y = 0; y < max; y++) {
                    let starType = self.gridList[x][y];
                    if (starType == 99) {
                        break;
                    }
                    // 要扫描的4个糖果（上下左右）
                    let scanStar = [[x + 1, y], [x - 1, y], [x, y - 1], [x, y + 1]];
                    for (var i = 0; i < scanStar.length; i++) {
                        // 如果被扫描的4个中有相连的，就直接返回false
                        var tmpX = scanStar[i][0];
                        var tmpY = scanStar[i][1];
                        if (self.inGrid(tmpX, tmpY) && self.gridList[tmpX][tmpY] == starType) {
                            return { x: tmpX, y: tmpY };
                        }
                    }
                }
            }
        }
        return null;
    }

    //游戏结束
    private overCal() {
        let self = this;
        var candyList = self.candyList;
        var remainStart = [];
        var max = Global.gridLength;
        for (var i = 0; i < max; i++) {
            for (var j = 0; j < max; j++) {
                var starType = self.gridList[i][j];
                if (starType == 99) {
                    break;
                }
                remainStart.push(candyList[i][j]);
            }
        }
        var remainStartLength = remainStart.length;
        var allScore = 2000;

        if (remainStartLength > 0) {
            for (var i = 0; i < remainStartLength; i++) {
                var star = remainStart[i].getComponent(CandyPrefab);
                if (i >= 10) {
                    star.clear(0.4 * 10);
                    if (i == remainStartLength - 1) {
                        setTimeout(() => {
                            App.EventMgr.emit(EventIDCfg.GAME_OVER)
                        }, 4000)
                    }
                }
                else {
                    star.clear(0.4 * i);
                    allScore = 2000 - i * i * 20;
                    if (i == remainStartLength - 1) {
                        setTimeout(() => {
                            App.EventMgr.emit(EventIDCfg.GAME_OVER)
                        }, 400 * i);
                    }
                    else {
                        //self.popManage.titleGoto("奖励分数:" + allScore, 2, 0.4 * i);
                    }
                }
            }
        }
        else {
            App.EventMgr.emit(EventIDCfg.GAME_OVER)
        }
    }

}


