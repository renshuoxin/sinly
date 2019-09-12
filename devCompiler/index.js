const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const conf = require('../lib/server/conf')

const config = require('../webpack.config.js')
const options = {
  // contentBase: path.resolve(__dirname, '../lib/client/dist'),
  // 设置打包后资源存放的位置
  publicPath: '/dist/',
  hot: true,
  host: conf.wdsHost,
  port: conf.wdsPort
};
//修改webpack配置对象，使其包含HMR入口起点以启动HMR
webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config)
const server = new webpackDevServer(compiler, options);

server.listen(conf.wdsPort, conf.wdsHost, () => {
  console.log(`dev server listening on port ${conf.wdsPort}`);
})