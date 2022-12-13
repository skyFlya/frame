import { _decorator, Component, Node, Button, tween, UITransform, Vec3, Vec2 } from 'cc';
import { NodeUtils } from '../frame/utils/NodeUtils';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {

    private btnCaiShen: Button = null;


    onLoad() {
        NodeUtils.autoBindNode(this.node, this);                        
    }

    start(){
        this.openCaiShen();
    }

    /**开启财神气泡 */
    private openCaiShen() {
        let item = this.btnCaiShen.node;
        let nodeHeight = this.node.getComponent(UITransform).width;                    
        tween(item).repeatForever(tween().to(20, { position: new Vec3(-(nodeHeight / 2 + item.getComponent(UITransform).width), item.position.y, 0) }).call(() => { this.btnCaiShen.node.setPosition(new Vec3(nodeHeight / 2, this.btnCaiShen.node.position.y, 0)) })).start();
    }

    /**关闭财神气泡 */
    private closeCaiShen() {        
        tween(this.btnCaiShen.node).stop();
        this.btnCaiShen.node.setPosition(new Vec3(this.node.getComponent(UITransform).width / 2, this.btnCaiShen.node.position.y, 0))
        setInterval(() => {
            this.openCaiShen();
        }, 60000)
    }

    /**点击气泡 */
    private btnQIBao1OnClick(){
        
    }

}


