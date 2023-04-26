const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions:{
    electronBuilder:{
      nodeIntegration: true,
      builderOptions: {
        // build配置在此处
        // options placed here will be merged with default configuration and passed to electron-builder
        appId: "com.emr.app",
        extraResources: [
            { "from": "./config.json", "to": "../" }
        ],
        "mac": { "icon": "./public/favicon.icns" },
        "win": { "icon": "./public/favicon.ico" }  // 配置打包后，在win下的应用图标。ico图片至少要是256*256尺寸的，尺寸太小，会打包失败。
      }
    },
  },
})
