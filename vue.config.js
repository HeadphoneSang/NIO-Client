const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions:{
    electronBuilder:{
      nodeIntegration: true,
      builderOptions: {
        // build配置在此处
        // options placed here will be merged with default configuration and passed to electron-builder
        productName: "云上云下",
        appId: "com.chbcraft.app",
        
        extraResources: [
            { "from": "./config.json", "to": "../" },
            { "from": "./public/icons", "to": "../" },
        ],
        "mac": { "icon": "./public/favicon.icns" },
        "win": { "icon": "./public/favicon.ico" },  // 配置打包后，在win下的应用图标。ico图片至少要是256*256尺寸的，尺寸太小，会打包失败。
        nsis: {
          oneClick: false, // 一键安装
          perMachine: true, // 是否开启安装时权限限制（此电脑或当前用户）
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          installerIcon: "./public/favicon.ico", // 安装图标
          uninstallerIcon: "./public/favicon.ico", //卸载图标
          installerHeaderIcon: "./public/favicon.ico", // 安装时头部图标
          createDesktopShortcut: true, // 创建桌面图标
        }
      }
    },
  },
})
