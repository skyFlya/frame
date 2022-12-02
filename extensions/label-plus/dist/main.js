"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
// @ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = require("fs-extra");
let lastFieldType = '';
let generateProcess = null;
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    createNode(...args) {
        Editor.Message.send('scene', 'create-node', ...args);
    },
    async openPanel() {
        Editor.Panel.open(package_json_1.default.name);
        // 解决 mac 签名问题
        if (process.platform === 'darwin') {
            (0, child_process_1.execSync)('xattr -r -d com.apple.quarantine ./node_modules/msdf-bmfont-cocos/bin/darwin', { cwd: `${path_1.default.join(__dirname, '..')}` });
        }
    },
    async openCompSetting() {
        await Editor.Message.request('project', 'open-settings', package_json_1.default.name, 'comp-setting');
    },
    fixSimulatorPreview() {
        const projectPath = Editor.Project.path;
        const fromPath = `${path_1.default.join(__dirname, '..', 'assets', 'plugin', 'runtime-material-loader.js')}`;
        const toPath = `${path_1.default.join(projectPath, package_json_1.default.name, 'plugin', 'runtime-material-loader.js')}`;
        console.log(`[${package_json_1.default.name}] `, 'copy', fromPath, ' to ', toPath);
        (0, fs_extra_1.copySync)(fromPath, toPath, { overwrite: true });
    },
    async genBMfont(opt) {
        const fontFile = await Editor.Message.request('asset-db', 'query-path', opt.font);
        if (!fontFile) {
            console.error(`[${package_json_1.default.name}] Source Font File Missing.`);
            return;
        }
        const tempDir = path_1.default.join(__dirname, '..', 'temp');
        if ((0, fs_extra_1.existsSync)(tempDir)) {
            (0, fs_extra_1.removeSync)(tempDir);
        }
        (0, fs_extra_1.mkdirSync)(tempDir);
        let charSetPath = path_1.default.join(tempDir, 'charset.txt');
        if (opt.charsetType === 'custom') {
            (0, fs_extra_1.writeFileSync)(charSetPath, opt.charset);
        }
        else {
            charSetPath = await Editor.Message.request('asset-db', 'query-path', opt.charset);
        }
        lastFieldType = opt.fieldType;
        let hasError = false;
        const nowTime = Date.now();
        await new Promise((resolve, reject) => {
            generateProcess = (0, child_process_1.exec)(`node ./node_modules/msdf-bmfont-cocos/dist/cli.js -i ${charSetPath} -m ${opt.textureWidth},${opt.textureHeight} -t ${opt.fieldType} -s ${opt.fontSize} -r ${opt.distanceRange} -p ${opt.fontPadding} ${opt.smartSize ? '--smart-size' : ''} ${opt.kerning ? '-k' : ''} --pot --progress -o ./temp/temp.png "${fontFile}"`, { cwd: `${path_1.default.join(__dirname, '..')}` }, (e) => {
                if (e) {
                    reject(e);
                }
                else {
                    resolve(null);
                }
            });
            generateProcess.stdout.on("data", (log) => {
                if (log.includes('gen-progress: ')) {
                    const progress = Number(log.split(': ')[1]);
                    if (!Number.isNaN(progress)) {
                        Editor.Message.send(package_json_1.default.name, 'on-progress', progress);
                    }
                }
                else if (log.startsWith('fail chars: ')) {
                    console.warn(`[${package_json_1.default.name}] `, log);
                }
                else {
                    console.log(`[${package_json_1.default.name}] `, log);
                }
            });
            generateProcess.stderr.on("data", (log) => {
                if (log.includes('texture size not enough')) {
                    console.error('texture size not enough, select bigger size and retry.');
                }
                else {
                    console.error(log);
                }
                hasError = true;
            });
        });
        generateProcess = null;
        if (hasError) {
            return new Error('');
        }
        else {
            // 生成成功, 保存配置
            await Editor.Profile.setProject(package_json_1.default.name, 'genConfig', opt);
            console.log(`[${package_json_1.default.name}] Generate Success: ${((Date.now() - nowTime) / 1000).toFixed(2)} s.`);
            return `${path_1.default.join(tempDir, 'temp.png')}`;
        }
    },
    async saveBMFont() {
        var _a;
        const data = await Editor.Dialog.save({
            path: path_1.default.join(Editor.Project.path, 'assets'),
            filters: [{ extensions: ['fnt'], name: '' }],
        });
        if (data.canceled) {
            return;
        }
        // 保存文件
        const fileName = `${path_1.default.basename(data.filePath, path_1.default.extname(data.filePath))}`;
        const dirName = path_1.default.dirname(data.filePath);
        (0, fs_extra_1.copySync)(path_1.default.join(__dirname, '..', 'temp', 'temp.png'), `${path_1.default.join(dirName, fileName)}.png`, { overwrite: true });
        let fontFile = (0, fs_extra_1.readFileSync)(path_1.default.join(__dirname, '..', 'temp', 'temp.fnt'), 'utf-8');
        fontFile = fontFile.replace('temp.png', `${fileName}.png`);
        (0, fs_extra_1.writeFileSync)(`${path_1.default.join(dirName, fileName)}.fnt`, fontFile);
        // 刷新 assetDB
        const relativePath = path_1.default.relative(Editor.Project.path, `${path_1.default.join(dirName, fileName)}`);
        if (!relativePath.startsWith('..')) {
            await Editor.Message.request('asset-db', 'refresh-asset', `db://${relativePath}.fnt`);
            const assetMeta = await Editor.Message.request('asset-db', 'query-asset-meta', `db://${relativePath}.png`);
            if (((_a = assetMeta === null || assetMeta === void 0 ? void 0 : assetMeta.userData) === null || _a === void 0 ? void 0 : _a.type) !== 'sprite-frame') {
                assetMeta.userData.type = 'sprite-frame';
                Editor.Message.send('asset-db', 'save-asset-meta', `db://${relativePath}.png`, JSON.stringify(assetMeta));
            }
        }
        console.log(`[${package_json_1.default.name}] Save BMFont To ${path_1.default.join(dirName, fileName)}.fnt Success.`);
    },
    beforePanelClose() {
        // 关闭面板时, 停止生成器进程
        if (!generateProcess) {
            return;
        }
        generateProcess.kill();
    },
    async onDefaultFontChanged() {
        await Editor.Message.request('scene', 'execute-scene-script', {
            name: package_json_1.default.name,
            method: 'onDefaultFontChanged',
            args: []
        });
    }
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
function load() {
}
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
function unload() {
}
exports.unload = unload;
