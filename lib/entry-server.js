import createApp from './client/page/manage/app'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp();

    // 设置服务器端router的位置
    router.push(context.url);
    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents(path);
      if(!matchedComponents.length) {
        return reject({code: 404});
      }

      resolve(app)
    }, reject);
  })
}