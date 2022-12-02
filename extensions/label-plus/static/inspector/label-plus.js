const { setHidden, isMultipleInvalid, setTooltip, setLabel } = require('../utils/prop');
const { template, $, update } = require('./base');
exports.template = template;
exports.$ = $;
exports.update = update;
exports.style = /* css */`
ui-tab {
    flex: none;
}
`;

exports.ready = function () {
    this.elements = {
        __scriptAsset: {
            update(element, dump) {
                setHidden(true, element);
            },
        },
        horizontalAlign: {
            create(dump) {
                const oldVer = Editor.App.version < '3.6.0';
                const iconPath = 'packages://scene/static/icons/';
                const prop = document.createElement('ui-prop');
                prop.dump = dump;
                const label = document.createElement('ui-label');
                label.setAttribute('slot', 'label');
                setLabel(label, dump);
                const content = document.createElement('ui-tab');
                content.setAttribute('slot', 'content');
                content.addEventListener('change', (event) => {
                    if (event.target.value !== -1) {
                        dump.value = event.target.value;
                        if (dump.values) {
                            dump.values.forEach((_, index) => dump.values[index] = dump.value);
                        }
                        prop.dispatch('change-dump');
                    }
                });

                for (let index = 0; index < dump.enumList.length; index++) {
                    const element = dump.enumList[index];
                    const image = document.createElement(oldVer ? 'ui-image' : 'ui-icon');
                    const button = document.createElement('ui-button');
                    const iconName = element.name.toLocaleLowerCase();
                    if (iconName === 'center') {
                        image.setAttribute('value', `${oldVer ? iconPath : ''}align-h-${iconName}${oldVer ? '.png' : ''}`);
                    } else {
                        image.setAttribute('value', `${oldVer ? iconPath : ''}align-${iconName}${oldVer ? '.png' : ''}`);
                    }
                    if (oldVer) {
                        image.style.height = '20px';
                        image.style.width = '22px';
                        image.style.verticalAlign = 'middle';
                        image.setAttribute('fill', true);
                    }
                    setTooltip(image, { tooltip: `${dump.tooltip}_${iconName}` });
                    image.setAttribute('readonly', true);
                    button.appendChild(image);
                    content.appendChild(button);
                }
                prop.appendChild(label);
                prop.appendChild(content);
                return prop;
            },
            update(element, dump) {
                const tab = element.querySelector('ui-tab');
                if (isMultipleInvalid(dump.horizontalAlign)) {
                    tab.value = -1;
                } else {
                    tab.value = dump.horizontalAlign.value;
                }
            },
        },
        verticalAlign: {
            create(dump) {
                const oldVer = Editor.App.version < '3.6.0';
                const iconPath = 'packages://scene/static/icons/';
                const prop = document.createElement('ui-prop');
                prop.dump = dump;
                const label = document.createElement('ui-label');
                label.setAttribute('slot', 'label');
                setLabel(label, dump);
                const content = document.createElement('ui-tab');
                content.setAttribute('slot', 'content');
                content.addEventListener('change', (event) => {
                    if (event.target.value !== -1) {
                        dump.value = event.target.value;
                        if (dump.values) {
                            dump.values.forEach((_, index) => dump.values[index] = dump.value);
                        }
                        prop.dispatch('change-dump');
                    }
                });

                for (let index = 0; index < dump.enumList.length; index++) {
                    const element = dump.enumList[index];
                    const image = document.createElement(oldVer ? 'ui-image' : 'ui-icon');
                    const button = document.createElement('ui-button');
                    const iconName = element.name.toLocaleLowerCase();
                    if (iconName === 'center') {
                        image.setAttribute('value', `${oldVer ? iconPath : ''}align-v-${iconName}${oldVer ? '.png' : ''}`);
                    } else {
                        image.setAttribute('value', `${oldVer ? iconPath : ''}align-${iconName}${oldVer ? '.png' : ''}`);
                    }
                    if (oldVer) {
                        image.style.height = '20px';
                        image.style.width = '22px';
                        image.style.verticalAlign = 'middle';
                        image.setAttribute('fill', true);
                        image.setAttribute('tooltip', dump.tooltip);
                        image.setAttribute('readonly', true);
                    }
                    setTooltip(image, { tooltip: `${dump.tooltip}_${iconName}` });
                    button.appendChild(image);
                    content.appendChild(button);
                }
                prop.appendChild(label);
                prop.appendChild(content);
                return prop;
            },
            update(element, dump) {
                const tab = element.querySelector('ui-tab');
                if (isMultipleInvalid(dump.verticalAlign)) {
                    tab.value = -1;
                } else {
                    tab.value = dump.verticalAlign.value;
                }
            },
        },
        fontFamily: {
            update(element, dump) {
                setHidden(true, element);
            },
        },
        spacingX: {
            update(element, dump) {
                setHidden(false, element);
            },
        },
        cacheMode: {
            update(element, dump) {
                setHidden(true, element);
            },
        },
        isBold: {
            update(element, dump) {
                setHidden(true, element);
            },
        },
        isItalic: {
            update(element, dump) {
                setHidden(true, element);
            },
        },
        isUnderline: {
            update(element, dump) {
                setHidden(true, element);
            },
        },

    };
};
