import json from './assets/json/article.json'

export type Article = {
  title: string
  content: any[]
  html: string
}

export const articleList = json as Article[]

export const articleJsonList = json.map(({ title, content }) => ({ title, content }))

export const articleHtmlList = json.map(({ title, html }) => ({ title, content: html }))

export * from './components'
