import { dest, parallel, src } from 'gulp'

const folder: Record<'from' | 'to', string>[] = [
  { from: 'docs/v1/.vuepress/dist/**/*', to: 'pages' },
  { from: 'docs/v0/.vuepress/dist/**/*', to: 'pages/v0' },
  { from: 'example/elplus/dist/**/*', to: 'pages/element-plus' }
]

export const copyPages = parallel(
  ...folder.map(({ from, to }) => {
    return function () {
      return src(from).pipe(dest(to))
    }
  })
)
