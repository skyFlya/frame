import { _decorator, Component, Node, RichText, tween, UIOpacity, Vec3, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Toast')
export class Toast extends Component {

    @property(RichText)
    label: RichText = null;

    @property(Node)
    nodeBg: Node = null;

    public setContent(content: string): void {
        this.label.string = content;
        if (this.label.node.getComponent(UITransform).width > 650) {
            this.label.maxWidth = 650;
        }
        else {
            this.label.maxWidth = 0;
        }
    }

    public getContent(): string {
        return this.label.string;
    }

    public show(delay: number, afterAni: Function, target: any): void {                
        this.nodeBg.getComponent(UIOpacity).opacity = 255;
        tween(this.nodeBg)
            .delay(delay)
            .to(0.5, { position: new Vec3(0, 40, 0)})
            .call(() => {
                afterAni && afterAni.call(target);
            })
            .start();

        tween(this.nodeBg.getComponent(UIOpacity))
            .delay(delay)
            .to(0.5, { opacity: 0 })
            .start();
    }
}


