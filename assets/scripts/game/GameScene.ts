import { _decorator, Component, Node, Prefab, UITransform } from 'cc';
import { NodeUtils } from '../frame/NodeUtils';
import { App } from '../app/App';
import { CandyPrefab } from './CandyPrefab';
import { Global } from './Global';
import { MathUtils } from '../frame/MathUtils';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {

    @property(Prefab)
    candyPre: Prefab = null;

    private ndCandyNode: Node = null;       //游戏棋盘

    private candyList = [];     //存储节点  

    private gridList = [];      //存储颜色

    private sameCandy = {
        select: false,
        connectCandy: []
    };

    onLoad() {
        NodeUtils.autoBindNode(this.node, this);
        this.addevent();
    }


    start() {
        this.createGrid();

    }

    private addevent() {
        this.ndCandyNode.on(Node.EventType.TOUCH_START, self.onClick, self);

    }

    update(deltaTime: number) {

    }


    //生成棋盘
    private createGrid() {
        let self = this;
        let candyList = [];
        let gridList = [];
        var gridLength = Global.gridLength;
        for (let i = 0; i < gridLength; i++) {
            candyList[i] = [];
            gridList[i] = [];
            for (let j = 0; j < gridLength; j++) {
                let candyNode = self.getCandy();
                let candy: CandyPrefab = candyNode.getComponent(CandyPrefab);
                candy.setGridXY(i, j);
                candy.goTo(i, j, 0, 0.3);
                var color = Math.floor(Math.random() * 5);
                candy.setType(color);
                candyList[i][j] = candyNode;
                gridList[i][j] = color;
            }
        }

        self.candyList = candyList;
        self.gridList = gridList;
    }

    private getCandy() {
        return App.poolManager.getNode(this.candyPre, this.ndCandyNode);
    }

    //点击
    private onClick(e) {
        var pos = MathUtils.worldToNode(e.touch.getLocation(), this.ndCandyNode)
        this.touchStar(parseInt(String(pos.x / 68)), parseInt(String(pos.y / 68)));
    }

    // 点击了一个糖果，xy为数据坐标
    private touchStar(x, y) {
        let self = this;
        if (x < Global.gridLength && y < Global.gridLength) {
            if (self.gridList[x][y] != 99) {
                // 相连的糖果
                self.sameCandy.connectCandy = [[x, y]];
                self.checkStar(x, y);
                //消除糖果
                self.cleanOnce();
            }
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
        self.candy_node_BlockInput.active = true;
        // 清除糖果
        self.clearConnectCandy();
        // 让糖果下落
        self.fallDownStar();
        // // 让糖果往左靠
        self.fallLeftStar();
        //检测本关是否结束
        setTimeout(() => {
            if (self.checkOver()) {
                self.overCal();
            }
            else {
                self.candy_node_BlockInput.active = false;
            }
        }, 500);
    }

}


