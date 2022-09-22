import { App } from 'vue'
import deepClone from 'lodash.clonedeep'
import { ArrayValudOf, TypeMap } from './types'

/**
 * 类型判断
 * @param tar 需要被判断类型的变量
 * @param type 数据类型
 */
export function is<T extends keyof TypeMap>(tar: any, type: T): tar is TypeMap[T] {
  return (
    Object.prototype.toString
      .call(tar)
      .replace(/(\[.+?\s|\])/g, '')
      .toLowerCase() === type
  )
}

/**
 * 给组件包装 install 函数
 * @param component 组件
 */
export function withInstall<T extends { name: string }>(component: T) {
  function install(app: App) {
    app.component(component.name!, component)
  }

  return Object.assign(component, { install })
}

/**
 * 数据合并（深度合并）
 * @param from 被合并的
 * @param to 合并到
 * @param compel 强制覆盖
 */
export function deepMerge<T1 extends object, T2 extends object>(from: T1, to: T2, compel: boolean = false) {
  for (let key in from) {
    const value = from[key]

    if (Reflect.has(to, key)) {
      const oldValue = Reflect.get(to, key)
      if (is(oldValue, 'object') && is(value, 'object')) {
        deepMerge(value, oldValue, compel)
        continue
      } else if (!compel) {
        continue
      }
    }

    Reflect.set(to, key, is(value, 'object') ? deepClone(value) : value)
  }
}

/**
 * 对 TypeScript 类型推导 Pick 的 JavaScript 实现
 * @param data 数据源
 * @param keys 被保留的键
 */
export function pick<T, K extends keyof T>(data: T, keys: K[]) {
  const temp = {} as Pick<T, ArrayValudOf<typeof keys>>
  keys.forEach((key) => Reflect.set(temp, key, data[key]))
  return temp
}

/**
 * 对 TypeScript 类型推导 Omit 的 JavaScript 实现
 * @param data 数据源
 * @param keys 被剔除的键
 */
export function omit<T, K extends keyof T>(data: T, keys: K[]) {
  const temp: Omit<T, ArrayValudOf<typeof keys>> = { ...data }
  keys.forEach((key) => Reflect.deleteProperty(temp, key))
  return temp
}
