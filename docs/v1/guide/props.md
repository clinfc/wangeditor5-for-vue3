# 属性和事件

## WeToolbar

### 属性

| prop     | 描述                  | 类型     | 必选   | 默认值 |
| :------- | :-------------------- | :------- | :----- | :----- |
| `handle` | `provide/inject` 句柄 | `Symbol` | `true` | -      |

### 事件

| event      | 描述                 | 回调函数                            |
| :--------- | :------------------- | :---------------------------------- |
| `reload`   | 菜单栏即将重载的事件 | `(e: WeToolbarReloadEvent) => void` |
| `reloaded` | 菜单栏重载结束的事件 | `(e: WeToolbarReloadEvent) => void` |

## WeEditable

### 属性

| prop            | 描述                                                                        | 类型                         | 必选    | 默认值 |
| :-------------- | :-------------------------------------------------------------------------- | :--------------------------- | :------ | :----- |
| `handle`        | `provide/inject` 句柄                                                       | `Symbol`                     | `true`  | -      |
| `json(v-model)` | 双向绑定 `JSON`(`String`/`Array`) 数据。使用 `.string` 修饰符时绑定为字符串 | `SlateDescendant[]`/`string` | `false` | -      |
| `html(v-model)` | 双向绑定 `HTML`(`String`) 数据                                              | `string`                     | `false` | -      |

### 事件

| event      | 描述                 | 回调函数                             |
| :--------- | :------------------- | :----------------------------------- |
| `reload`   | 编辑区即将重载的事件 | `(e: WeEditableReloadEvent) => void` |
| `reloaded` | 编辑区重载结束的事件 | `(e: WeEditableReloadEvent) => void` |

## WeEditor

### 属性

| prop            | 描述                                                                        | 类型                         | 必选    | 默认值 |
| :-------------- | :-------------------------------------------------------------------------- | :--------------------------- | :------ | :----- |
| `handle`        | `provide/inject` 句柄                                                       | `Symbol`                     | `true`  | -      |
| `json(v-model)` | 双向绑定 `JSON`(`String`/`Array`) 数据。使用 `.string` 修饰符时绑定为字符串 | `SlateDescendant[]`/`string` | `false` | -      |
| `html(v-model)` | 双向绑定 `HTML`(`String`) 数据                                              | `string`                     | `false` | -      |
| `toolbarAttrs`  | 传递到 `WeToolbar` 的 `attributes`                                          | `Record<string, any>`        | `false` | `{}`   |
| `editableAttrs` | 传递到 `WeEditable` 的 `attributes`                                         | `Record<string, any>`        | `false` | `{}`   |

### 事件

| event      | 描述                        | 回调函数                     |
| :--------- | :-------------------------- | :--------------------------- |
| `reload`   | 菜单栏/编辑区即将重载的事件 | `(e: WeReloadEvent) => void` |
| `reloaded` | 菜单栏/编辑区重载结束的事件 | `(e: WeReloadEvent) => void` |
