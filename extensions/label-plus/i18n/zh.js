'use strict';
module.exports = {
    title: 'Label Plus',
    menu: 'Label Plus',
    comp_setting: '组件设置',
    fix_preview: '修复模拟器预览',
    open_panel: 'SDF BMFont 生成器',
    panel_title: 'SDF BMFont 生成器',
    description: 'SDF BMFont生成, 以及渲染组件, 提供描边、阴影、粗细调节等功能。',
    default_font: '默认字体',
    comp_name: 'Label Plus (文本)',
    label: {
        dilate: '粗细',
        outline: '是否开启描边',
        outline_thickness: '描边厚度',
        outline_color: '描边颜色',
        shadow: '是否开启阴影',
        shadow_color: '阴影颜色',
        shadow_offset: '阴影偏移',
    },
    generate: {
        font_file: '生成 BMFont 使用的字体资源',
        font_size: 'BMFont 字体大小',
        padding: ' BMFont 边距',
        texture_size: '生成的纹理尺寸',
        kerning: '是否保存字距信息',
        smart_size: '开启后会自动缩小到适合的尺寸',
        charset: '字符集类型, 从文件读取或手动输入',
        charset_file: '生成 BMfont 使用的文本资源',
        range: '距离场范围',
        field_type: '距离场类型 \n - SDF -> 单通道 \n - MSDF 多通道'
    }
};