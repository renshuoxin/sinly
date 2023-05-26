// sum(1)(2, 3, 4)(5)();

function sum() {
  const params = Array.from(arguments);

  return function innerSum(...args) {
    if (args.length === 0) {
      return params.reduce((result, pre) => {
        return result + pre;
      }, 0);
    }

    params.push(...args);
    return innerSum;
  }
}

// console.log(sum(1)(2, 3));
console.log(sum(1)(2, 3, 4)(5)());