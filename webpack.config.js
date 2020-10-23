const path = require('path')
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    manage: path.join(__dirname, './lib/client/page/manage/main.js'),
    mobile: path.join(__dirname, './lib/client/page/mobile/mobile.js')
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './lib/client/dist'),     //目标输出目录（存储在硬盘上的绝对路径）
    // 用来转换url中的相对路径;配置了publicPath,webpack在打包时才能根据配置动态修改uri中的相对值
    // url('./images/apple.png'), 打包后页面中变为url('/dist/[hash:8].apple.png')；也就是说为入口页面中静态资源指定基础路径，最后生成为：静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径。比较常用于生产环境，指定cdn服务基础路径地址
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.fn\.pug$/,
        // 函数形态的pug template, 可以传入数据构建
        use: ['pug-loader']
      },
      {
        test: /\.pug$/,
        exclude: /\.fn\.pug$/,
        oneOf: [
          // 这条规则应用到 Vue 组件内的 `<template lang="pug">`
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          },
          // // 这条规则应用到 JavaScript 内的 pug 导入
          // // TODO, 全面禁用，统一使用函数形态的template
          // {
          //   use: ['raw-loader', 'pug-plain-loader']
          // }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      { //webpack打包后图片的存放路径为output.path + name
        test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: '[hash:8].[name].[ext]'
          }
        }]
      }
    ]
  },
  resolve:{
    alias:{
        'vue$':'vue/dist/vue.js',
        images: path.join(__dirname, './lib/client/images'),
        learn: path.join(__dirname, './learn')
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['/dist']
    }),
    // 将定义过的其他规则复制并应用到.vue文件相应语言的块
    new vueLoaderPlugin(),
    // 模块热替换
    new webpack.HotModuleReplacementPlugin()
  ]
}