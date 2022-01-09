/**
 * use @wangeditor/editor@^0.13.4 in vue3。
 * @author 翠林 <clinfc@qq.com>
 * @description 支持动态配置的 wangEditor5 for vue3 组件。
 * @see {@link https://github.com/clinfc/wangeditor5-for-vue3|Github}
 */
import debounce from 'lodash.debounce';
import { createEditor, createToolbar } from '@wangeditor/editor';
import { computed, defineComponent, h, isProxy, onBeforeUnmount, onMounted, reactive, ref, shallowReactive, toRaw, toRef, unref, watch, } from 'vue';
const EDITABLE_HANDLE = new WeakMap();
const TOOLBAR_HANDLE = new WeakMap();
/** 编辑器 与 Toolbar 间的映射关系 */
const EDITABLE_TOOLBAR = new WeakMap();
/** Toolbar 与 编辑器 间的映射关系 */
const TOOLBAR_EDITABLE = new WeakMap();
const TIMER = new WeakMap();
function setTimer(option, fn) {
    let timer = TIMER.get(option);
    if (timer) {
        if (timer[1]) {
            clearTimeout(timer[1]);
            timer[1] = null;
        }
    }
    else {
        TIMER.set(option, (timer = [365 /* RELOAD */, null]));
    }
    if (fn) {
        timer[1] = setTimeout(() => {
            timer[1] = null;
            fn();
        }, timer[0]);
    }
}
/**
 * vue hook，在 EditorEditable 组件中使用
 */
function injectEditor(option, reload, clearContent) {
    function reset() {
        const instance = reload();
        if (!instance)
            return;
        const temp = EDITABLE_HANDLE.get(option);
        if (!temp) {
            EDITABLE_HANDLE.set(option, { instance, reload: reset });
        }
        else {
            temp.instance = instance;
        }
        // 自动重载 toolbar
        const toolbar = EDITABLE_TOOLBAR.get(option);
        if (toolbar) {
            const treload = TOOLBAR_HANDLE.get(toolbar)?.reload;
            if (treload) {
                setTimer(toolbar);
                treload();
            }
        }
    }
    EDITABLE_HANDLE.set(option, { clearContent, reload: reset });
    return reset;
}
/**
 * vue hook，在 EditorToolbar 组件中使用
 */
function injectToolbar(option, reload) {
    function reset() {
        const editableOptions = TOOLBAR_EDITABLE.get(option);
        if (!editableOptions)
            return;
        const editable = EDITABLE_HANDLE.get(editableOptions);
        if (!editable || !editable.instance)
            return;
        const instance = reload(editable.instance);
        if (!instance)
            return;
        const temp = TOOLBAR_HANDLE.get(option);
        if (!temp) {
            TOOLBAR_HANDLE.set(option, { instance, reload: reset });
        }
        else {
            temp.instance = instance;
        }
    }
    TOOLBAR_HANDLE.set(option, { reload: reset });
    return reset;
}
/**
 * 编辑器
 */
export const EditorEditable = defineComponent({
    name: 'EditorEditable',
    props: {
        /** 编辑器初始化的配置 */
        option: {
            type: Object,
            default: () => ({
                mode: 'default',
                config: {},
                delay: 3650 /* UPDATE */,
                defaultContent: null,
                extendCache: true,
            }),
        },
        /** v-model */
        modelValue: Array,
        /** v-model:html */
        html: String,
        /** v-model:json */
        json: String,
    },
    emits: ['update:modelValue', 'update:html', 'update:json', 'reloadbefore'],
    setup(props, { emit }) {
        const elem = ref(null);
        const mval = toRef(props, 'modelValue');
        const html = toRef(props, 'html');
        const json = toRef(props, 'json');
        let instance = null;
        /**
         * 编辑器内容缓存
         */
        const cache = shallowReactive({
            mval: [],
            json: '[]',
            html: '',
        });
        /**
         * 判断用户是否 v-model
         */
        const modelMval = computed(() => Array.isArray(mval.value));
        /**
         * 判断用户是否 v-model:json
         */
        const modelJson = computed(() => typeof json.value === 'string');
        /**
         * 判断用户是否 v-model:html
         */
        const modelHtml = computed(() => typeof html.value === 'string');
        /**
         * 更新数据，将编辑器内容（json）同步到父组件。实现 v-model + v-model:json。
         */
        function updateMval(e) {
            // 异步执行时，编辑器可能已销毁重建
            if (e != instance)
                return;
            cache.mval = e.isEmpty() ? [] : e.children;
            const jsonStr = JSON.stringify(cache.mval);
            if (cache.json !== jsonStr) {
                cache.json = jsonStr;
                emit('update:modelValue', cache.mval);
                if (modelJson.value)
                    emit('update:json', jsonStr);
            }
        }
        /**
         * 更新数据，将编辑器内容（html）同步到父组件。实现 v-model:html。
         */
        function updateJson(e) {
            // 异步执行时，编辑器可能已销毁重建
            if (e != instance)
                return;
            const jsonStr = JSON.stringify(e.isEmpty() ? [] : e.children);
            if (cache.json !== jsonStr) {
                cache.json = jsonStr;
                emit('update:json', jsonStr);
            }
        }
        /**
         * 更新数据，将编辑器内容（html）同步到父组件。实现 v-model:html。
         */
        function updateHtml(e) {
            // 异步执行时，编辑器可能已销毁重建
            if (e != instance)
                return;
            const html = e.isEmpty() ? '' : e.getHtml();
            if (cache.html !== html) {
                cache.html = html;
                emit('update:html', html);
            }
        }
        /** 手动更新数据 */
        function executeUpdate(instance) {
            if (modelMval.value)
                updateMval(instance);
            else if (modelJson.value)
                updateJson(instance);
            modelHtml.value && updateHtml(instance);
        }
        /** 封装 change 事件，实现数据 v-model v-model:json 和 v-model:html */
        const changes = [];
        function watchOptionOnChange() {
            changes.length = 0;
            const { delay, config } = props.option;
            if (modelMval.value)
                changes.push(debounce(updateMval, delay));
            else if (modelJson.value)
                changes.push(debounce(updateJson, delay));
            modelHtml.value && changes.push(debounce(updateHtml, delay));
            if (config && config.onChange) {
                changes.push(config.onChange);
            }
        }
        const globalCallback = {
            customAlert(info, type) {
                props.option.config.customAlert?.(info, type);
            },
            onCreated(editor) {
                props.option.config.onCreated?.(editor);
            },
            onDestroyed(editor) {
                props.option.config.onDestroyed?.(editor);
            },
            onMaxLength(editor) {
                props.option.config.onMaxLength?.(editor);
            },
            onFocus(editor) {
                props.option.config.onFocus?.(editor);
            },
            onBlur(editor) {
                props.option.config.onBlur?.(editor);
            },
            onChange(editor) {
                changes.forEach((change) => change(editor));
            },
        };
        /**
         * 初始化编辑器
         */
        function initialize() {
            if (!elem.value)
                return;
            if (instance) {
                // 强制更新数据，避免数据丢失
                executeUpdate(instance);
                // 发布 reloadbefore 事件
                emit('reloadbefore', instance);
                instance.destroy();
            }
            else {
                watchOptionOnChange();
            }
            // 解除 vue 副作用，否则将意外不断
            const { mode, config, defaultContent, extendCache } = toRaw(props.option);
            const option = {
                selector: elem.value,
                mode: mode ?? 'default',
                config: {
                    ...config,
                    ...globalCallback,
                },
            };
            let content;
            if (extendCache) {
                content =
                    cache.json.length > 2
                        ? cache.json
                        : cache.html || (Array.isArray(defaultContent) ? JSON.stringify(defaultContent) : defaultContent);
            }
            else {
                content = Array.isArray(defaultContent)
                    ? JSON.stringify(defaultContent)
                    : defaultContent || (cache.json.length ? cache.json : cache.html);
            }
            if (content) {
                if (Array.isArray(content)) {
                    instance = createEditor({ ...option, content });
                }
                else {
                    try {
                        const json = JSON.parse(content);
                        instance = createEditor({ ...option, content: json });
                    }
                    catch (error) {
                        instance = createEditor(option);
                        instance.dangerouslyInsertHtml(content);
                    }
                }
                modelMval.value && updateMval(instance);
                modelHtml.value && updateHtml(instance);
                return instance;
            }
            instance = createEditor(option);
            return instance;
        }
        /**
         * 清除组件中的富文本内容和缓存
         */
        function clearContent() {
            // 如果不进行只读模式拦截，那么只需时将报错
            // 只读模式 || 为初始 || 无内容
            if (props.option.config.readOnly || !instance || instance.isEmpty())
                return;
            instance.clear();
            // 强制进行数据同步，避免延迟机制导致数据异常
            executeUpdate(instance);
        }
        const reload = injectEditor(props.option, initialize, clearContent);
        onMounted(reload);
        onBeforeUnmount(() => {
            if (instance) {
                // 强制进行数据更新，避免延迟机制导致数据丢失
                executeUpdate(instance);
                instance.blur();
                setTimeout(() => {
                    instance?.destroy();
                    instance = null;
                }, 1000);
            }
        });
        function watchOptionReload() {
            // 编辑器变更会自动更新 toolbar
            const toolbar = EDITABLE_TOOLBAR.get(props.option);
            toolbar && setTimer(toolbar);
            setTimer(props.option, reload);
        }
        // 编辑器支持重载的配置项
        watch(() => props.option.mode, watchOptionReload);
        watch(() => props.option.config.maxLength, watchOptionReload);
        watch(() => props.option.config.customPaste, watchOptionReload);
        watch(() => props.option.config.hoverbarKeys, watchOptionReload, { deep: true });
        // 监听 v-model
        watch(mval, () => {
            if (!modelMval.value)
                return;
            const value = unref(mval);
            const jsonStr = JSON.stringify(value);
            if (jsonStr === cache.json)
                return;
            if (instance) {
                instance.clear();
                instance.insertFragment(value);
            }
            else {
                cache.mval = value;
                cache.json = jsonStr;
            }
        }, { immediate: true });
        watch(json, () => {
            // 以 v-model 为主，无 v-model 时才会继续操作
            if (modelMval.value)
                return;
            const jsonStr = unref(json) || '[]';
            if (jsonStr === cache.json)
                return;
            try {
                const temp = JSON.parse(jsonStr);
                if (instance) {
                    instance.clear();
                    instance.insertFragment(temp);
                }
                else {
                    cache.json = jsonStr;
                }
            }
            catch (e) {
                console.error(Error(`v-model:json's value is not a json string!`));
            }
        }, { immediate: true });
        // 监听 v-model:html
        watch(html, () => {
            // 以 v-model/v-model:json 为主，无 v-model/v-model:json 时才会继续操作
            if (modelMval.value || modelJson.value)
                return;
            const value = unref(html);
            if (!modelHtml.value || value === cache.html)
                return;
            if (instance) {
                instance.clear();
                instance.dangerouslyInsertHtml(value);
            }
            else {
                cache.html = value;
            }
        }, { immediate: true });
        // 监听 v-model 延迟
        watch(() => props.option.delay, watchOptionOnChange);
        // readOnly
        watch(() => props.option.config.readOnly, (nv) => instance && (nv ? instance.disable() : instance.enable()));
        // placeholder
        watch(() => props.option.config.placeholder, (nv) => {
            const target = elem.value?.querySelector('.w-e-text-placeholder');
            if (target instanceof HTMLElement)
                target.innerText = nv ?? '';
        });
        // scroll
        watch(() => props.option.config.scroll, (nv) => {
            const target = elem.value?.querySelector('.w-e-scroll');
            if (target instanceof HTMLElement)
                target.style.overflowY = nv ? 'auto' : '';
        });
        return { elem };
    },
    render() {
        return h('div', { ref: 'elem' });
    },
});
/**
 * 菜单栏
 */
export const EditorToolbar = defineComponent({
    name: 'EditorToolbar',
    props: {
        option: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['reloadbefore'],
    setup(props, { emit }) {
        const elem = ref(null);
        let instance = null;
        function initialize(editor) {
            if (!elem.value)
                return;
            if (instance) {
                emit('reloadbefore', instance);
                instance.destroy();
                delete elem.value.dataset.wEToolbar;
            }
            instance = createToolbar({ ...props.option, editor, selector: elem.value });
            return instance;
        }
        const reload = injectToolbar(props.option, initialize);
        watch(() => props.option, () => {
            const editable = TOOLBAR_EDITABLE.get(props.option);
            // 编辑器变更会自动更新 toolbar
            if (!editable || TIMER.get(editable)?.[1] !== null)
                return;
            setTimer(props.option, reload);
        }, { deep: true });
        onMounted(reload);
        onBeforeUnmount(() => {
            instance?.destroy();
            instance = null;
        });
        return { elem };
    },
    render() {
        return h('div', { ref: 'elem' });
    },
});
/**
 * vue hook，用于实现编辑器配置项的动态绑定
 * @param {Object} editableOption 编辑器主体部分的配置
 * @param {Object} toolbarOption 菜单栏配置
 * @param {Number} reloadDelay 防抖时长，用于重载的延迟控制，单位：毫秒
 */
export function useWangEditor(editableOption = null, toolbarOption = null, reloadDelay = 365 /* RELOAD */) {
    const editable = reactive({
        mode: 'default',
        defaultContent: null,
        config: {},
        delay: 3650 /* UPDATE */,
        extendCache: true,
        ...(isProxy(editableOption) ? toRaw(editableOption) : editableOption), // 配置项可能被复用，解除与之前依赖的关联
    });
    const toolbar = reactive({
        mode: 'default',
        config: {},
        ...(isProxy(toolbarOption) ? toRaw(toolbarOption) : toolbarOption), // 配置项可能被复用，解除与之前依赖的关联
    });
    EDITABLE_TOOLBAR.set(editable, toolbar);
    TOOLBAR_EDITABLE.set(toolbar, editable);
    TIMER.set(editable, [reloadDelay, null]);
    TIMER.set(toolbar, [reloadDelay, null]);
    /**
     * 获取编辑器实例
     */
    function getEditable() {
        return EDITABLE_HANDLE.get(editable)?.instance;
    }
    /**
     * 获取菜单栏实例
     */
    function getToolbar() {
        return TOOLBAR_HANDLE.get(toolbar)?.instance;
    }
    /**
     * 清除富文本内容缓存
     */
    function clearContent() {
        EDITABLE_HANDLE.get(editable)?.clearContent?.();
    }
    /**
     * 重载编辑器（销毁重建)
     */
    function reloadEditor() {
        const reload = EDITABLE_HANDLE.get(editable)?.reload;
        if (reload) {
            setTimer(toolbar);
            setTimer(editable);
            reload();
        }
    }
    return { editable, toolbar, getEditable, getToolbar, clearContent, reloadEditor };
}
/**
 * 全局注册 EditorToolbar 和 EditorEditable 组件。
 * @param {Object} app vue实例
 * @example
 *  import App from './App.vue'
 *  import { createApp } from 'vue'
 *  createApp(App).use(wangeditor).mount('#app')
 */
export default function wangeditor(app) {
    app.component(EditorToolbar.name, EditorToolbar);
    app.component(EditorEditable.name, EditorEditable);
}
//# sourceMappingURL=wangeditor.js.map