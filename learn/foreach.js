const simulateFetch = function() {
  return new Promise(resolve, reject => {
    setTimeout(() => {
      resolve(1);
    }, 1000)
  })
}

