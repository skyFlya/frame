import { _decorator, Node, UITransform, Vec3, v3 } from 'cc';

/**
 * 数学工具类
 */
export const MathUtils = {
    /**
        * node转世界坐标
        * @param pos 
        * @param node 
        */
    nodeToWorld(pos: Vec3, node: Node) {
        return node.getComponent(UITransform).convertToWorldSpaceAR(pos)
    },
    /**
     * 世界坐标转node
     * @param worldPos 
     * @param node 
     */
    worldToNode(worldPos: Vec3, node: Node) {
        return node.getComponent(UITransform).convertToNodeSpaceAR(worldPos)
    },

    /**
    * 节点坐标转换
    * @param node 欲要转换的节点
    * @param newParent 新父节点
    */
    convertToParent(node: Node, newParent: Node, offset?: Vec3): Vec3 {
        const worldPos = node.getComponent(UITransform).convertToWorldSpaceAR(offset || v3(0, 0, 0));
        return newParent.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
    },


    /**
     * 根据剩余秒数格式化剩余时间 返回 HH:MM:SS
     * @param {Number} leftSec
     */
    formatTimeForSecond(leftSec: number) {
        let timeStr = '';
        const sec = leftSec % 60;

        let leftMin = Math.floor(leftSec / 60);
        leftMin = leftMin < 0 ? 0 : leftMin;

        const hour = Math.floor(leftMin / 60);
        const min = leftMin % 60;

        if (hour > 0) {
            timeStr += hour > 9 ? hour.toString() : '0' + hour;
            timeStr += ':';
        }

        timeStr += min > 9 ? min.toString() : '0' + min;
        timeStr += ':';
        timeStr += sec > 9 ? sec.toString() : '0' + sec;
        return timeStr;
    }
}