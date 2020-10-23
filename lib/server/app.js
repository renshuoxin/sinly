const Koa = require('koa')
const views = require('koa-views')
const koaBody = require('koa-body')
const koaBodyParser = require('koa-bodyparser')
const path = require('path')
const Router = require('koa-router')
const proxyServer = require('./plugins/proxyServer.js')
const conf = require('./conf')

const Vue = require('vue')
const ssr = require('vue-server-renderer')
const fs = require('fs')

const app = new Koa();
const router = new Router();
const upload = require('./route/upload')
const article = require('./route/article')

app.use(async (ctx, next)=>{
  if (ctx.url === '/favicon.ico') {
    ctx.body = ''
  } else {
    await next()
  }
})

// 模板引擎
app.use(views(path.join(__dirname, '../views'), {
  extension: 'pug'   //view的默认扩展名
}))

// body parser, 如果没有此中间件，无法解析ctx.request.body(undefined)
// app.use(koaBodyParser({
//   returnRawBody: true,
//   formLimit: "10mb",
//   textLimit: "10mb",
//   jsonLimit: "10mb",
//   xmlLimit: "10mb",
//   enableTypes: ['json','form','text'],
//   onerror: function (err, ctx) {
//     ctx.throw('body parse error', 422);
//   }
// }))
// http://www.ptbird.cn/koa-body.html
app.use(koaBody({
  multipart:true,
  formLimit: "5mb",
  textLimit: "5mb",
  jsonLimit: "5mb",
  maxFieldsSize: "5mb",
  maxFileSize: "20mb"
}))

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

router.post('/upload', async (ctx, next) => {
  let result = await upload(ctx);
  ctx.response.body = result;
})
router.get('/article', async (ctx, next) => {
  let result = await article(ctx);
  ctx.response.body = result;
})
// 服务端渲染
router.get('/ssr', async (ctx, next) => {
  // 使用页面模板的方式进行服务端渲染
  // 1、创建Vue实例
  const app = new Vue({
    data: {
      url: ctx.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })
  const context = {
    title: 'hello world'
  }
  // 2、创建render实例
  const renderer = ssr.createRenderer({
    template: fs.readFileSync(path.join(__dirname, '../views/ssrBase.html'), 'utf-8')
  })
  // 3、将Vue实例渲染为HTML
  renderer.renderToString(app, context, (err, html) => {
    ctx.body = html; // html 将是注入应用程序内容的完整页面
  })
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use(async (ctx, next) => {
  await next();
  if(!ctx.response.body) {
    if(ctx.url.indexOf('/mobile') > -1) {
      await ctx.render('mobile');
    } else {
      await ctx.render('index');
    }
  }
})

app.listen(3001, () => {
  console.log('server listen to 3001')
})