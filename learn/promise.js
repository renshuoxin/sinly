Promise.all = function(promises) {
  let result = [];
  let index = 0;
  return new Promise((resolve, reject) => {
    for(let i = 0; i < promises.length; i++) {
      let p = promises[i];
      Promise.resolve(p).then((value) => {
        result[index++] = value;
        if(index == promises.length) {
          resolve(result);
        }
      }, function(error) {
        reject(error);
      })
    }
  })
}

Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    for(let i = 0; i < promises.length; i++) {
      let p = promises[i];
      Promise.resolve(p).then((value) => {
        resolve(value);
      }, function(error) {
        reject(error)
      })
    }
  })
}