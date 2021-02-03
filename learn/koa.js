// 1、创建http server
const http = require('http')

// 原生实现
let server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('hello world');
});

server.listen(3000, () => {
  console.log('server start in 3000')
})


// koa 实现
class Application {
  constructor() {
    this.middlewares = [];
  }

  use(fn) {
    this.middlewares.push(fn);
    return this;
  }

  listen() {
    let server = http.createServer(this.callback());
    server.listen(port);
  }
  // 2、中间件机制
  compose() {
    return function(ctx, next) {
      function createNext(middleware, oldNext) {
        return async () => {
          await middleware(ctx, oldNext);
        }
      }
      let len = this.middlewares.length;

      let next = async () => {
        return Promise.resolve();
      }

      for(let i = len - 1; i >= 0; i--) {
        next = createNext(this.middlewares[i], next);
      }
      await next();
    }
  }

  callback() {
    return (req, res) => {
      let fn = this.compose();
      return fn(ctx).then(respond).catch(onerror);
    }
  }
  // 3、错误处理机制
  onerror(err, ctx) {
    if (err.code === 'ENOENT') {
        ctx.status = 404;
    }
    else {
        ctx.status = 500;
    }
    let msg = err.message || 'Internal error';
    ctx.res.end(msg);
    // 触发error事件
    this.emit('error', err);
  }
}

function compose(middlewares) {
  return function(ctx, next) {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      index = i;
      let fn = middlewares[i];
      if(i === middlewares.length) {
        fn = next;
      }
      if(!fn) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(fn(ctx, function next() {
          return dispatch(i + 1);
        }));
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
}

app.use(async function(ctx, next) {
  console.log('f1 start');
  await next();
  console.log('f1 end');
})
app.use(async function(ctx, next) {
  console.log('f2 start');
  await next();
  console.log('f2 end');
})
app.use(async function(ctx, next) {
  console.log('f3 start');
  await next();
  console.log('f3 end');
})

f1(ctx, next) {
  console.log('f1 start');
  async f2(ctx, next) {
    console.log('f2 start');
    async f3(ctx, next) {
      console.log('f3 start');
      await Promise.resolve();
      console.log('f3 end');
    }
    console.log('f2 end');
  }
  console.log('f1 end');
}

function compose(middlewares) {
  return function(ctx, next) {
    return dispatch(0);
    function dispatch(i) {
      let fn = middlewares[i];
      if(i === middlewares.length) {
        fn = next;
      }
      if(!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(ctx, function next() {
          return dispatch(i + 1);
        }))
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
}