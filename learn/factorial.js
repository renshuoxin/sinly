// function factorial(n) {
//   if(n == 1) return n;
//   return n * factorial(n - 1);
// }

function tailFactorial(n, result) {
  if(n === 1) return result;
  return tailFactorial(n - 1, n * result)
}

function makeFactorial(result) {
  return function(n) {
    return tailFactorial(n, result)
  }
}

let factorial = makeFactorial(1)
console.log(factorial(5));