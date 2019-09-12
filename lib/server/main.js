// import Koa from 'koa'
const Koa = require('koa')
const views = require('koa-views')
const koaBody = require('koa-body')
const path = require('path')
const Router = require('koa-router')
const proxyServer = require('./plugins/proxyServer.js')
const conf = require('./conf')

const app = new Koa();
const router = new Router();

app.use(async (ctx, next)=>{
  if (ctx.url === '/favicon.ico') {
    ctx.body = ''
  } else {
    await next()
  }
})

// 模板引擎
app.use(views(path.join(__dirname, '../views'), {
  extension: 'jade'   //view的默认扩展名
}))

// body parser, 如果没有此中间件，无法解析ctx.request.body(undefined)
app.use(koaBody())

// 开发环境下静态资源代理
app.use(proxyServer({
  target: `http://${conf.wdsHost}:${conf.wdsPort}`,
  path: /\/dist\//
}))

// 路由
router.get('/users/:id', async (ctx, next) => {
  let start = Date.now();
  ctx.response.body = 'get users';
  let duration = Date.now() - start;
  console.log(`[${ctx.method}]${ctx.url}:${duration}`);
})

router.post('/users', async (ctx, next) => {
  let body = ctx.request.body;
  console.log(body)
  ctx.response.body = 'post users';
})
app.use(router.routes())
app.use(router.allowedMethods())

app.use(async (ctx, next) => {
  await next();
  if(!ctx.response.body) {
    await ctx.render('index');
  }
})

app.listen(3000, () => {
  console.log('server listen to 3000')
})