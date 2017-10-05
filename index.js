const PENDING = '___pending___';
const REJECTED = '___rejected___';
const FULFILLED = '___fulfilled___';

const State = (value, onComplete, onError) => {
  const result = {
    state: PENDING,
    value: null
  };

  if (value && typeof value.then === 'function') {
    value.then(
      (v) => {
        result.state = FULFILLED;
        result.value = v;
        if (typeof onComplete === 'function') onComplete(v);
      },
      (e) => {
        result.state = REJECTED;
        result.value = e;
        if (typeof onError === 'function') onError(e);
      }
    );
  } else {
    if (value instanceof Error) {
      result.state = REJECTED;
      result.value = value;
    } else {
      result.state = FULFILLED;
      result.value = value;
    }
  }

  return result;
}

module.exports = {
  State,
  PENDING,
  REJECTED,
  FULFILLED
};
