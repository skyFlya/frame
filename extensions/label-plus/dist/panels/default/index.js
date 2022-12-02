"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("../../../package.json"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
let linkWH = true;
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
    listeners: {
        show() { },
        hide() { },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        mainPanel: '#generate-panel',
        settingPanel: '#setting-panel',
        contentPanel: '#content-panel',
        font: '#font',
        fontSize: '#font-size',
        padding: '#padding',
        range: '#range',
        textureWidth: '#texture-width',
        textureHeight: '#texture-height',
        linkBtn: '#link-button',
        kerning: '#kerning',
        smartSize: '#smart-size',
        charsetType: '#charset-type',
        fileContent: '#file-content',
        txtFile: '#txt-file',
        textArea: '#txt-area',
        fieldType: '#field-type',
        progressUI: '#progress-ui',
        progressBar: '#progress-bar',
        genBtn: '#gen-btn',
        saveBtn: '#save-btn',
        previewImg: '#preview-img',
    },
    methods: {
        onProgress(progress) {
            this.$.progressBar.value = progress * 100;
        },
    },
    async ready() {
        const config = await Editor.Profile.getProject(package_json_1.default.name, 'genConfig');
        // 根据宽度调整布局
        setupResizeObserver(this);
        // 根据配置, 刷新 UI 数据
        setupSettingConfig(this, config);
        // 宽高是否链接起来
        this.$.linkBtn.onclick = () => {
            linkWH = !linkWH;
            this.$.linkBtn.querySelector('ui-icon').value = linkWH ? 'link' : 'unlink';
            if (linkWH) {
                this.$.textureHeight.value = this.$.textureWidth.value;
            }
        };
        // 根据设置, 决定生成按钮是否可点
        setupChangeEvents(this);
        // 调用主进程生成 bmfont
        setupGenBtnClickEvent(this);
        // 调用主进程保存文件
        setupSaveBtnClickEvent(this);
    },
    beforeClose() {
        Editor.Message.request('label-plus', 'before-panel-close', null);
    },
    close() { },
});
function setupResizeObserver(panel) {
    const resizeObserver = new ResizeObserver(() => {
        window.requestAnimationFrame(() => {
            if (panel.$.mainPanel.clientWidth < 500) {
                panel.$.mainPanel.style.flexDirection = 'column';
                panel.$.settingPanel.style.width = 'auto';
                panel.$.settingPanel.style.marginRight = '6px';
                panel.$.settingPanel.style.overflow = 'visible';
                panel.$.contentPanel.style.overflow = 'visible';
            }
            else {
                panel.$.mainPanel.style.flexDirection = 'row';
                panel.$.settingPanel.style.width = '33%';
                panel.$.settingPanel.style.marginRight = '';
                panel.$.settingPanel.style.overflow = 'auto';
                panel.$.contentPanel.style.overflow = 'auto';
            }
        });
    });
    resizeObserver.observe(panel.$.mainPanel);
}
function setupChangeEvents(panel) {
    Object.keys(panel.$).forEach((key) => {
        if (['mainPanel', 'settingPanel', 'contentPanel', 'genBtn', 'saveBtn', 'previewImg', 'linkBtn'].includes(key)) {
            return;
        }
        panel.$[key].onchange = () => {
            onPanelChanged(key, panel);
        };
    });
}
function onPanelChanged(key, panel) {
    if (key === 'textureWidth' || key === 'textureHeight') {
        if (!linkWH) {
            return;
        }
        if (key === 'textureWidth') {
            panel.$.textureHeight.value = panel.$.textureWidth.value;
        }
        else if (key === 'textureHeight') {
            panel.$.textureWidth.value = panel.$.textureHeight.value;
        }
    }
    let genBtnDisabled = true;
    if (panel.$.charsetType.value === 'custom') {
        panel.$.fileContent.hidden = true;
        panel.$.textArea.hidden = false;
        genBtnDisabled = !panel.$.font.value;
    }
    else {
        panel.$.fileContent.hidden = false;
        panel.$.textArea.hidden = true;
        genBtnDisabled = !panel.$.font.value || !panel.$.txtFile.value;
    }
    if (panel._generating) {
        return;
    }
    panel.$.progressBar.value = 0;
    panel.$.genBtn.disabled = genBtnDisabled;
}
function setupGenBtnClickEvent(panel) {
    panel.$.genBtn.onclick = async () => {
        if (panel._generating) {
            return;
        }
        panel.$.previewImg.src = '';
        panel.$.genBtn.disabled = true;
        panel.$.saveBtn.disabled = true;
        panel.$.progressBar.value = 0;
        panel._generating = true;
        const result = await Editor.Message.request('label-plus', 'gen-bmfont', {
            font: panel.$.font.value,
            fontSize: panel.$.fontSize.value,
            fontPadding: panel.$.padding.value,
            distanceRange: panel.$.range.value,
            textureWidth: panel.$.textureWidth.value,
            textureHeight: panel.$.textureHeight.value,
            kerning: panel.$.kerning.value,
            smartSize: panel.$.smartSize.value,
            charsetType: panel.$.charsetType.value,
            charset: panel.$.charsetType.value === 'custom' ? panel.$.textArea.value : panel.$.txtFile.value,
            fieldType: panel.$.fieldType.value,
        });
        panel._generating = false;
        if (typeof result === 'string') {
            panel.$.previewImg.src = `${result}?${Date.now()}`;
            panel.$.saveBtn.disabled = false;
        }
        else {
            panel.$.genBtn.disabled = false;
        }
    };
}
function setupSaveBtnClickEvent(panel) {
    panel.$.saveBtn.onclick = async () => {
        await Editor.Message.request('label-plus', 'save-bmfont', null);
    };
}
function setupSettingConfig(panel, config) {
    if (!config) {
        return;
    }
    if (config.textureWidth !== config.textureHeight) {
        linkWH = false;
    }
    panel.$.linkBtn.querySelector('ui-icon').value = linkWH ? 'link' : 'unlink';
    panel.$.font.value = config.font || '';
    panel.$.fontSize.value = config.fontSize || 32;
    panel.$.padding.value = config.fontPadding || 2;
    panel.$.range.value = config.distanceRange || 4;
    panel.$.textureWidth.value = config.textureWidth || 2048;
    panel.$.textureHeight.value = config.textureHeight || 2048;
    panel.$.kerning.value = config.kerning || true;
    panel.$.smartSize.value = config.smartSize || true;
    panel.$.charsetType.value = config.charsetType || 'custom';
    if (config.charsetType === 'custom') {
        panel.$.textArea.value = config.charset || '';
    }
    else {
        panel.$.txtFile.value = config.charset || '';
    }
    panel.$.fieldType.value = config.fieldType || 'msdf';
    onPanelChanged(null, panel);
}
