/**
 * use @wangeditor/editor@^0.13.4 in vue3。
 * @author 翠林 <clinfc@qq.com>
 * @description 支持动态配置的 wangEditor5 for vue3 组件。
 * @see {@link https://github.com/clinfc/wangeditor5-for-vue3/tree/model-json-array|Github}
 */
import { Descendant } from 'slate';
import { IDomEditor, IEditorConfig, IToolbarConfig, Toolbar } from '@wangeditor/editor';
import { App, PropType, Ref } from 'vue';
/**
 * 编辑器配置项
 */
export interface EditorEditableOption {
    /** 编辑器模式 */
    mode?: 'default' | 'simple';
    /** 编辑器初始化的默认内容 */
    defaultContent?: Descendant[] | string | null;
    /** 编辑器配置 */
    config?: Partial<IEditorConfig>;
    /** v-model 数据同步的防抖时长，默认值：3650，单位：毫秒 */
    delay?: number;
    /**
     * 编辑器创建时默认内容的优先级排序，默认值：true。
     * true：v-model > v-model:html > defaultContent。
     * false: defaultContent > v-model > v-model:html。
     */
    extendCache?: boolean;
}
/**
 * 菜单栏的配置项
 */
export interface EditorToolbarOption {
    mode?: 'default' | 'simple';
    config?: Partial<IToolbarConfig>;
}
/**
 * 编辑器
 */
export declare const EditorEditable: import("vue").DefineComponent<{
    /** 编辑器初始化的配置 */
    option: {
        type: PropType<Required<EditorEditableOption>>;
        default: () => Required<EditorEditableOption>;
    };
    /** v-model */
    modelValue: PropType<Descendant[]>;
    /** v-model:html */
    html: StringConstructor;
}, {
    elem: Ref<HTMLDivElement>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "update:html" | "reloadbefore")[], "update:modelValue" | "update:html" | "reloadbefore", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    option?: unknown;
    modelValue?: unknown;
    html?: unknown;
} & {
    option: Required<EditorEditableOption>;
} & {
    html?: string | undefined;
    modelValue?: Descendant[] | undefined;
}> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onUpdate:html"?: ((...args: any[]) => any) | undefined;
    onReloadbefore?: ((...args: any[]) => any) | undefined;
}, {
    option: Required<EditorEditableOption>;
}>;
/**
 * 菜单栏
 */
export declare const EditorToolbar: import("vue").DefineComponent<{
    option: {
        type: PropType<EditorToolbarOption>;
        default: () => {};
    };
}, {
    elem: Ref<HTMLDivElement>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "reloadbefore"[], "reloadbefore", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    option?: unknown;
} & {
    option: EditorToolbarOption;
} & {}> & {
    onReloadbefore?: ((...args: any[]) => any) | undefined;
}, {
    option: EditorToolbarOption;
}>;
/**
 * vue hook，用于实现编辑器配置项的动态绑定
 * @param {Object} editableOption 编辑器主体部分的配置
 * @param {Object} toolbarOption 菜单栏配置
 * @param {Number} reloadDelay 防抖时长，用于重载的延迟控制，单位：毫秒
 */
export declare function useWangEditor(editableOption?: EditorEditableOption | null, toolbarOption?: EditorToolbarOption | null, reloadDelay?: number): {
    editable: {
        mode: "default" | "simple";
        defaultContent: string | ({
            children: (any | {
                text: string;
            })[];
        } | {
            text: string;
        })[] | null;
        config: {
            customAlert?: ((info: string, type: import("@wangeditor/core/dist/core/src/config/interface").AlertType) => void) | undefined;
            onCreated?: ((editor: IDomEditor) => void) | undefined;
            onChange?: ((editor: IDomEditor) => void) | undefined;
            onDestroyed?: ((editor: IDomEditor) => void) | undefined;
            onMaxLength?: ((editor: IDomEditor) => void) | undefined;
            onFocus?: ((editor: IDomEditor) => void) | undefined;
            onBlur?: ((editor: IDomEditor) => void) | undefined;
            customPaste?: ((editor: IDomEditor, e: ClipboardEvent) => boolean) | undefined;
            scroll?: boolean | undefined;
            placeholder?: string | undefined;
            readOnly?: boolean | undefined;
            autoFocus?: boolean | undefined;
            decorate?: ((nodeEntry: import("slate").NodeEntry<import("slate").Node>) => import("slate").BaseRange[]) | undefined;
            maxLength?: number | undefined;
            MENU_CONF?: {
                [x: string]: {
                    [x: string]: any;
                };
            } | undefined;
            hoverbarKeys?: {
                [x: string]: {
                    match?: ((editor: IDomEditor, n: import("slate").Node) => boolean) | undefined;
                    menuKeys: string[];
                };
            } | undefined;
        };
        delay: number;
        extendCache: boolean;
    };
    toolbar: {
        mode: "default" | "simple";
        config: {
            toolbarKeys?: (string | {
                key: string;
                title: string;
                iconSvg?: string | undefined;
                menuKeys: string[];
            })[] | undefined;
            insertKeys?: {
                index: number;
                keys: string | (string | {
                    key: string;
                    title: string;
                    iconSvg?: string | undefined;
                    menuKeys: string[];
                })[];
            } | undefined;
            excludeKeys?: string[] | undefined;
            modalAppendToBody?: boolean | undefined;
        };
    };
    getEditable: () => IDomEditor | undefined;
    getToolbar: () => Toolbar | undefined;
    clearContent: () => void;
    reloadEditor: () => void;
};
/**
 * 全局注册 EditorToolbar 和 EditorEditable 组件。
 * @param {Object} app vue实例
 * @example
 *  import App from './App.vue'
 *  import { createApp } from 'vue'
 *  createApp(App).use(wangeditor).mount('#app')
 */
export default function wangeditor(app: App): void;
