/**
 * 运行时加载 label plus 默认材质
 */
const labelPlusMats = {
    '03a67161-4837-41c1-bb2e-8a4a5b502e11': 'label-plus-material',
    '55db4459-caf7-4f02-ad8d-19d9532a767a': 'label-plus-os-material',
    '9f594159-b7ce-4f90-9a7f-fe022cb46f35': 'label-plus-outline-material',
    'b88cbdab-5395-4874-9946-afa4985e5356': 'label-plus-shadow-material',
};

if (CocosEngine < '3.6.0') {
    cc.game.on(cc.Game.EVENT_GAME_INITED, () => {
        cc.assetManager.loadBundle('label-plus', (err, bundle) => {
            if (err) {
                console.error('[label-plus] load materials fail.', err);
            } else {
                console.log('[label-plus] bundle load success.');
                bundle.loadDir('materials', (err, assets) => {
                    if (err) {
                        console.error('[label-plus] load materials fail.', err);
                        reject(err);
                    } else {
                        for (const mat of assets) {
                            mat.addRef();
                            const assetUuid = mat.name || labelPlusMats[mat._uuid];
                            cc.builtinResMgr._resources[assetUuid] = mat;
                            for (let j = 0; j < mat.passes.length; ++j) {
                                mat.passes[j].tryCompile();
                            }
                        }
                        console.log('[label-plus] load materials success.');
                    }
                });
            }
        });
    });
} else {
    cc.game.onPostProjectInitDelegate.add(() => {
        return new Promise((resolve, reject) => {
            cc.assetManager.loadBundle('label-plus', (err, bundle) => {
                if (err) {
                    console.error('[label-plus] load materials fail.', err);
                    reject(err);
                    return;
                }
                bundle.loadDir('materials', (err, assets) => {
                    if (err) {
                        console.error('[label-plus] load materials fail.', err);
                        reject(err);
                    } else {
                        for (const mat of assets) {
                            mat.addRef();
                            for (let i = 0; i < mat.passes.length; ++i) {
                                mat.passes[i].tryCompile();
                            }
                            const assetUuid = mat.name || labelPlusMats[mat._uuid];
                            cc.builtinResMgr.addAsset(assetUuid, mat);
                        }
                        console.log('[label-plus] load materials success.');
                        resolve();
                    }
                });
            });
        });
    });
}
