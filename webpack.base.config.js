const path = require('path')
const vueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, './lib/dist')     //目标输出目录（存储在硬盘上的绝对路径）
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
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          }
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