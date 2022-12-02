import { _decorator, Label, BitmapFont, Material, builtinResMgr, Color, Vec2 } from 'cc';
import { EDITOR } from 'cc/env';

const { ccclass, property, menu } = _decorator;

const tempOffset = new Vec2(0, 0);

@ccclass('LabelPlus')
@menu('2D/LabelPlus')
export class LabelPlus extends Label {
    @property({
        override: true,
        type: BitmapFont,
        visible: true,
    })
    get font() {
        return this._font;
    }
    set font(value) {
        if (this._font === value) {
            return;
        }
        if (EDITOR) {
            this._userDefinedFont = value;
        }
        this._font = value;
        this.destroyRenderData();
        this._fontAtlas = null;
        this.updateRenderData(true);

        this.updateMaterialProperty();
    }
    @property({
        override: true,
    })
    protected _font: BitmapFont | null = null;

    @property({
        override: true,
        visible: false,
    })
    get useSystemFont() {
        return this._isSystemFontUsed;
    }
    set useSystemFont(value) {
        // @ts-ignore
        if (EDITOR && !cc.GAME_VIEW) {
            return;
        }
        console.warn('label plus not surpport system font');
    }
    @property({
        override: true,
    })
    protected _isSystemFontUsed = false;

    @property({
        override: true,
        visible: true
    })
    get spacingX() {
        return this._spacingX;
    }
    set spacingX(value) {
        if (this._spacingX === value) {
            return;
        }

        this._spacingX = value;
        this.markForUpdateRenderData();
    }
    @property({
        override: true
    })
    protected _spacingX = 0;

    @property({
        displayOrder: 4.1,
        range: [-1, 1, 0.01],
        slide: true,
        tooltip: 'i18n:label-plus.label.dilate'
    })
    get dilate() {
        return this._dilate;
    }
    set dilate(value) {
        if (this._dilate === value) {
            return;
        }
        this._dilate = value;
        this.updateDilate();
        this.updateOutlineThickness();
    }
    @property
    protected _dilate: number = 0;

    @property({
        displayOrder: 4.2,
        tooltip: 'i18n:label-plus.label.outline'
    })
    get outline() {
        return this._outline;
    }
    set outline(value) {
        if (this._outline === value) {
            return;
        }
        this._outline = value;
        this.updateMaterial();
        this.updateMaterialProperty();
    }
    @property
    protected _outline: boolean = false;

    @property({
        displayOrder: 4.3,
        visible: function (this: LabelPlus) { return this._outline },
        range: [0, 1, 0.01],
        slide: true,
        tooltip: 'i18n:label-plus.label.outline_thickness'
    })
    get outlineThickness() {
        return this._outlineThickness;
    }
    set outlineThickness(value) {
        if (this._outlineThickness === value) {
            return;
        }
        this._outlineThickness = value;
        this.updateOutlineThickness();
    }

    @property
    protected _outlineThickness: number = 0.2;

    @property({
        displayOrder: 4.4,
        visible: function (this: LabelPlus) { return this._outline },
        tooltip: 'i18n:label-plus.label.outline_color'
    })
    get outlineColor(): Readonly<Color> {
        return this._outlineColor;
    }
    set outlineColor(value) {
        if (this._outlineColor.equals(value)) {
            return;
        }
        this._outlineColor.set(value);
        this.updateOutlineColor();
    }
    @property
    protected _outlineColor: Color = Color.BLACK.clone();


    /**
     * shadow setting
     *
     * @memberof LabelPlus
     */
    @property({
        displayOrder: 4.5,
        tooltip: 'i18n:label-plus.label.shadow'
    })
    get shadow() {
        return this._shadow;
    }
    set shadow(value) {
        if (this._shadow === value) {
            return;
        }
        this._shadow = value;
        this.updateMaterial();
        this.updateMaterialProperty();
    }
    @property
    protected _shadow: boolean = false;

    @property({
        displayOrder: 4.6,
        visible: function (this: LabelPlus) { return this._shadow },
        tooltip: 'i18n:label-plus.label.shadow_color'
    })
    get shadowColor(): Readonly<Color> {
        return this._shadowColor;
    }
    set shadowColor(value) {
        if (this._shadowColor.equals(value)) {
            return;
        }
        this._shadowColor.set(value);
        this.updateShadowColor();
    }
    @property
    protected _shadowColor: Color = Color.BLACK.clone();

    @property({
        displayOrder: 4.7,
        range: [-1, 1, 0.01],
        slide: true,
        visible: function (this: LabelPlus) { return this._shadow },
        tooltip: 'i18n:label-plus.label.shadow_offset'
    })
    get shadowOffsetX() {
        return this._shadowOffset.x;
    }
    set shadowOffsetX(value) {
        if (this._shadowOffset.x === value) {
            return;
        }
        this._shadowOffset.set(value, this._shadowOffset.y);
        this.updateShadowOffset();
    }

    @property({
        displayOrder: 4.8,
        range: [-1, 1, 0.01],
        slide: true,
        visible: function (this: LabelPlus) { return this._shadow },
        tooltip: 'i18n:label-plus.label.shadow_offset'
    })
    get shadowOffsetY() {
        return this._shadowOffset.y;
    }
    set shadowOffsetY(value) {
        if (this._shadowOffset.y === value) {
            return;
        }
        this._shadowOffset.set(this._shadowOffset.x, value);
        this.updateShadowOffset();
    }
    @property
    protected _shadowOffset: Vec2 = new Vec2(0, 0);

    public resetInEditor() {
        super.resetInEditor?.();
        this.font = builtinResMgr.get('label-plus-default-font');
        this.fontSize = 20;
    }

    public onLoad() {
        super.onLoad?.();
        // @ts-ignore
        if (EDITOR && !cc.GAME_VIEW && !this._font) {
            this.font = builtinResMgr.get('label-plus-default-font');
            this.fontSize = 20;
        }
    }

    public onEnable() {
        super.onEnable?.();
        this.updateMaterialProperty();
    }

    private updateMaterialProperty() {
        if (!this.sharedMaterial) {
            return;
        }
        this.updateDilate();
        // outline
        this.updateOutlineThickness();
        this.updateOutlineColor();
        // shadow
        this.updateShadowOffset();
        this.updateShadowColor();
    }

    protected updateDilate() {
        if (!EDITOR && this._dilate === 0) {
            return;
        }
        const mat = this.getMaterialInstance(0)!;
        mat.setProperty('dilate', (this._dilate / 2) + 0.5);
    }

    protected updateOutlineThickness() {
        if (!this._outline) {
            return;
        }
        const thickness = Math.max(0, 0.5 - (this._dilate / 2) - this._outlineThickness * 0.5);
        const mat = this.getMaterialInstance(0)!;
        mat.setProperty('outlineThickness', thickness);
    }

    protected updateOutlineColor() {
        if (!this._outline) {
            return;
        }
        const mat = this.getMaterialInstance(0)!;
        mat.setProperty('outlineColor', this._outlineColor);
    }

    protected updateShadowColor() {
        if (!this._shadow) {
            return;
        }
        const mat = this.getMaterialInstance(0)!;
        mat.setProperty('shadowColor', this._shadowColor);
    }

    protected updateShadowOffset() {
        if (!this._shadow) {
            return;
        }
        const mat = this.getMaterialInstance(0)!;
        const offsetX = 1 / (this?._font?.spriteFrame?.texture.width || Number.MAX_SAFE_INTEGER);
        const offsetY = 1 / (this?._font?.spriteFrame?.texture.height || Number.MAX_SAFE_INTEGER);
        Vec2.multiplyScalar(tempOffset, this._shadowOffset, 2);
        tempOffset.multiply2f(offsetX, offsetY);
        mat.setProperty('shadowOffset', tempOffset);
    }

    protected _updateBuiltinMaterial(): Material {
        let mat: Material;
        mat = builtinResMgr.get(this.getMaterialName());
        return mat;
    }

    private getMaterialName() {
        if (this._outline && this._shadow) {
            return 'label-plus-os-material';
        } else if (this._outline) {
            return 'label-plus-outline-material';
        } else if (this._shadow) {
            return 'label-plus-shadow-material';
        }
        return 'label-plus-material';
    }
}
