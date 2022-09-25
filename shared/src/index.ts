function join(...path: string[]) {
  path.push('')
  return path.join('/').replace(/\/{2,}/g, '/')
}

export const ORIGIN = 'https://clinfc.github.io'

export const BASE_PATH = '/wangeditor5-for-vue3'

export const V0_PATH = join(BASE_PATH, 'v0')

export const V1_PATH = join(BASE_PATH)

export const ELPLUS_PATH = join(BASE_PATH, 'element-plus')

export const BASE_URL = join(ORIGIN, BASE_PATH)

export const V0_URL = join(ORIGIN, V0_PATH)

export const V1_URL = join(ORIGIN, V1_PATH)

export const ELPLUS_URL = join(ORIGIN, ELPLUS_PATH)
