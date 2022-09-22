import json from './assets/json/article.json'

export type Article = {
  title: string
  content: any[]
  html: string
}

export const articleList = json as Article[]

export * from './components'
