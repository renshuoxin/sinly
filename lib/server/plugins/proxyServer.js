const { parse } = require('url')
const axios = require('axios')

module.exports = function(options) {
  let pathReg = options.path,
      target = options.target;
  return async (ctx, next) => {
    const parsed = parse(ctx.originalUrl, true);
    const match = parsed.pathname.match(pathReg);
    
    if(ctx.method === 'GET' && match) {
      let url = `${target}${ctx.url}`;
      console.log('proxy:', url)
      if (/\.js$/.test(url)) {
        const result = await axios.get(url);
        // console.log(result.data)
        ctx.set('Content-Type', result.headers['content-type']);
        ctx.set('Cache-Control', 'no-cache');
        ctx.body = result.data;
      } else {
        // 图片的解析
        const result = await axios({
          method: 'get',
          url: url,
          responseType:'stream'
        })
        ctx.body = result.data
      }
    }
    await next();
  }
}