const PENDING = 'pending';
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected';

class Promise {
  constructor(exector) {
    this.status = PENDING;

    this.value = undefined; // 值
    this.reason = undefined; // 失败原因

    this.onFulfilledCallback = [];
    this.onRejectedCallback = [];

    const resolve = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;

        this.onFulfilledCallback.forEach(cb => {
          cb(this.value);
        });
      }
    }

    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;

        this.onRejectedCallback.forEach(cb => {
          cb(this.reason);
        });
      }
    }

    try {
      exector(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function'? onRejected: reason => { throw new Error(reason instanceof Error ? reason.message:reason) }
    
    return new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.onFulfilledCallback.push(() => {
          try {
            setTimeout(() => {
              const result = onFulfilled(this.value);
              result instanceof Promise ? result.then(resolve, reject) : resolve(result);
            })
          } catch (error) {
            reject(error);
          }
        })
        this.onRejectedCallback.push(() => {
          try {
            setTimeout(() => {
              const result = onRejected(this.reason);
              result instanceof Promise ? result.then(resolve, reject) : resolve(result);
            });
          } catch (error) {
            reject(error);
          }
        })
      } else if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const result = onFulfilled(this.value);
            result instanceof Promise ? result.then(resolve, reject) : resolve(result);
          } catch (error) {
            reject(error);
          }
        })
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const result = onRejected(this.value);
            result instanceof Promise ? result.then(resolve, reject) : resolve(result);
          } catch (error) {
            reject(error);
          }
        })
      }
    });
  }
}