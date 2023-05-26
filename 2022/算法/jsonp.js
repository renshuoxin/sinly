/**
 * 实现jsonp
 * @param {*} options 
 */
function jsonp(options) {
  const { url, params, timeout } = options;
  const callbackId = `jsonp_${Date.now()}_${Math.ceil(Math.random() * 1000000)}`;

  const searchParams = Object.keys(params).map((key) => `${key}=${params[key]}`);
  const newUrl = `${url}?${searchParams.join('&')}&callback=${callbackId}`;

  const pro = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.setAttribute('src', newUrl);

    window[callbackId] = (data) => {
      resolve(data);
    }

    script.addEventListener('error', () => {
      reject(new Error(`JSONP request to ${newUrl} failed`));
      document.body.removeChild(script);
    });

    document.body.appendChild(script);
  });

  const timeoutPro = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('timeout');
    }, timeout);
  })


  return Promise.race([timeoutPro, pro]);
}


jsonp({
  url: 'XXX',
  params: {
    a: 1,
  },
  timeout: 5000
}).then(() => {

}).catch(() => {

});