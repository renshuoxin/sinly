// 1、创建http server
const http = require('http')

class Application {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  listen(port) {
    const app = http.createServer(this.callback);
    app.listen(port);
  }

  callback() {
    return (ctx) => {
      let fn = this.compose();
      return fn(ctx).then(respond).catch(onerror);
    }
  }

  compose() {
    return function(ctx, next) {
      let index = -1;
      return dispatch(0);
      function dispatch(i) {
        index = i;
        let fn = this.middlewares[i];
        if (i === this.middlewares.length) {
          fn = next;
        }
  
        if (!fn) return Promise.resolve();
        try {
          return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
        } catch (error) {
          return Promise.reject(error);
        }
      }
    };
  }
}