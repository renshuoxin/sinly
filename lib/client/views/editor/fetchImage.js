import Vue from 'vue';

// 最大重试次数
const MAX_REPEAT = 3;


function fetching (imageUrl, referer, repeat = MAX_REPEAT) {
  if(!imageUrl) {
    return Promise.reject(null)
  }
  let fetchingUrl = `/localApi/api/getImageFromUrl?src=${encodeURIComponent(imageUrl)}`
  if (referer) {
    fetchingUrl += `&referer=${encodeURIComponent(referer)}`
  }

  return Promise.resolve('https://vfiles.gtimg.cn/vupload/20210927/24f1601632724887935.png');
  // const p = Vue.http(fetchingUrl, {
  //   timeout: 120000
  // }).then(function(result) {
  //   repeat--
  //     //成功
  //   if (result.status === 200 && result.data.status === 'success') {
  //     return result.data.inner_addr
  //   }
  //   if (repeat > 0) {
  //     // 还可以重试
  //     return fetching(imageUrl, referer, repeat)
  //   }
  //   //失败
  //   return Promise.reject(null)
  // }).catch(error => {
  //   return Promise.reject(null)
  // })
  // return p
};

// 并行可控并发的执行 promise 任务
class Parallel extends Vue {
  constructor (max) {
    super();
    // this.remain标识异步任务是否已经执行完毕
    this.max = this.remain = max;
    this.jobs = [];
    this.running = false;
  }
  add (task) {
    this.jobs.push(task);
  }
  run () {
    if (this.remain === 0) {
      return
    }
    if (this.jobs.length === 0 && this.remain >= this.max) {
      this.remain = this.max;
      this.running = false;
      return this.$emit('finished');
    }
    while (this.jobs.length && this.remain > 0) {
      const task = this.jobs.pop();
      this.remain--;
      task().then( (result) => {
        this.remain++;
        this.$emit('done', result);
        this.run();
      }, (result)=> {
        this.remain++;
        this.$emit('error', result);
        this.run();
      })
    }
  }
  start () {
    if (this.running) {
      return
    }
    this.$emit('start');
    this.running = true;
    this.run();
  }
  fetch (url, data, referer, repeat) {
    function task () {
      return fetching(url, referer, repeat).then( url => {
        return {
          url: url,
          data: data
        }
      }).catch(error => {
        return Promise.reject({
          data: data
        })
      })
    }
    this.add(task);
    this.start();
  }
}


const pool = new Parallel(5)

export default pool
