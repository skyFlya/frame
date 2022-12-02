"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.unload = exports.load = void 0;
/**
 * 为编辑器加载 label plus 默认材质
 */
// @ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const path_1 = require("path");
module.paths.push((0, path_1.join)(Editor.App.path, 'node_modules'));
const defaultFontName = 'label-plus-default-font';
const labelPlusMats = {
    '03a67161-4837-41c1-bb2e-8a4a5b502e11': 'label-plus-material',
    '55db4459-caf7-4f02-ad8d-19d9532a767a': 'label-plus-os-material',
    '9f594159-b7ce-4f90-9a7f-fe022cb46f35': 'label-plus-outline-material',
    'b88cbdab-5395-4874-9946-afa4985e5356': 'label-plus-shadow-material',
};
const preloadAssets = Object.keys(labelPlusMats);
async function load() {
    await new Promise((resolve, reject) => {
        const { assetManager, builtinResMgr, Material } = require('cc');
        assetManager.loadAny(preloadAssets, (err, assets) => {
            if (err) {
                reject(err);
            }
            else {
                for (const asset of assets) {
                    asset.addRef();
                    let assetUuid = asset.name || labelPlusMats[asset._uuid];
                    if (asset instanceof Material) {
                        for (let i = 0; i < asset.passes.length; ++i) {
                            asset.passes[i].tryCompile();
                        }
                    }
                    if (Editor.App.version < '3.6.0') {
                        builtinResMgr._resources[assetUuid] = asset;
                    }
                    else {
                        builtinResMgr.addAsset(assetUuid, asset);
                    }
                }
                resolve(true);
            }
        });
    });
    console.log(`[${package_json_1.default.name}] materials loaded.`);
    await loadDefaultFont();
}
exports.load = load;
;
function unload() { }
exports.unload = unload;
;
async function loadDefaultFont() {
    const defaultFontUuid = (await Editor.Profile.getProject(package_json_1.default.name, 'defaultFont')) || "ce349d92-def5-420b-b15a-b011008bb46e";
    try {
        await new Promise((resolve, reject) => {
            const { assetManager, builtinResMgr } = require('cc');
            assetManager.loadAny(defaultFontUuid, (err, font) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (Editor.App.version < '3.6.0') {
                        builtinResMgr._resources[defaultFontName] = font;
                    }
                    else {
                        builtinResMgr.addAsset(defaultFontName, font);
                    }
                    console.log(`[${package_json_1.default.name}] default font [${font.name}.fnt] loaded.`);
                    resolve(true);
                }
            });
        });
    }
    catch (e) {
        console.error(`[${package_json_1.default.name}] default font load fail, please check project setting.`);
        console.error(e);
    }
}
;
exports.methods = {
    async onDefaultFontChanged() {
        await loadDefaultFont();
    },
};
