import { _decorator, Prefab, Node, instantiate, NodePool } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PoolMgr")
export class PoolMgr {
    dictPool: { [name: string]: NodePool }= {}
    dictPrefab: { [name: string]: Prefab } = {}

    static _instance: PoolMgr;

    public static getInstance(): PoolMgr {
        if (PoolMgr._instance == null) {
            PoolMgr._instance = new PoolMgr();
        }
        return PoolMgr._instance;
    }

    /**
     * 根据预设从对象池中获取对应节点
     */
    getNode (prefab: Prefab, parent: Node) {
        let name = prefab.data.name;
        this.dictPrefab[name] = prefab;
        let node: Node;
        if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            let pool = this.dictPool[name];
            if (pool.size() > 0) {
                node = pool.get()!;
            } else {
                node = instantiate(prefab);
            }
        } else {
            //没有对应对象池，创建他！
            let pool = new NodePool();
            this.dictPool[name] = pool;

            node = instantiate(prefab);
        }

        node.parent = parent;
        return node;
    }

    /**
     * 将对应节点放回对象池中
     */
    putNode (node: Node) {
        let name = node.name;
        let pool = null;
        if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            pool = this.dictPool[name];
        } else {
            //没有对应对象池，创建他！
            pool = new NodePool();
            this.dictPool[name] = pool;
        }

        pool.put(node);
    }

    /**
     * 根据名称，清除对应对象池
     */
    clearPool (name: string) {
        if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            pool.clear();
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
