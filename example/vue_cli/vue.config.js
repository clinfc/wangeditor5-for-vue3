const path = require('path')
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, 'loaders')],
    },
  },
})
