const { expect } = require('chai');
const { State, PENDING, FULFILLED, REJECTED } = require('./index');

describe('State(value, onFulfilled, onRejected)', () => {
  describe('synchronous values', () => {
    it('returns REJECTED for throwables', () => {
      const error = new Error('😱');
      expect(State(error).state).to.equal(REJECTED);
      expect(State(error).value).to.equal(error);
    });

    it('returns FULFILLED and passes on value for all primitives', () => {
      const num = 0;
      expect(State(num).state).to.equal(FULFILLED);
      expect(State(num).value).to.equal(num);

      const str = '';
      expect(State(str).state).to.equal(FULFILLED);
      expect(State(str).value).to.equal(str);

      const bool = false;
      expect(State(bool).state).to.equal(FULFILLED);
      expect(State(bool).value).to.equal(bool);

      const undef = undefined;
      expect(State(undef).state).to.equal(FULFILLED);
      expect(State(undef).value).to.equal(undef);

      const nul = null;
      expect(State(nul).state).to.equal(FULFILLED);
      expect(State(nul).value).to.equal(nul);
    });

    it('returns FULFILLED and passes on value for objects and arrays', () => {
      const obj = {};
      expect(State(obj).state).to.equal(FULFILLED);
      expect(State(obj).value).to.equal(obj);

      const arr = [];
      expect(State(arr).state).to.equal(FULFILLED);
      expect(State(arr).value).to.equal(arr);
    });
  });

  describe('promise values', () => {
    it('starts off in a pending state', () => {
      const promise = new Promise((res) => {
        res('value');
      });
      expect(State(promise).state).to.equal(PENDING);
      expect(State(promise).value).to.equal(null);
    });

    describe('when promise is fulfilled', () => {
      it('become FULFILLED once the promise is fulfilled', (done) => {
        const value = '👍';
        const promise = new Promise((res) => {
          res(value);
        });
        const result = State(promise);

        setTimeout(() => {
          expect(result.state).to.equal(FULFILLED);
          expect(result.value).to.equal(value);
          done();
        }, 10);
      });

      it('calls onFulfilled when it is given', (done) => {
        const promise = new Promise(res => res());
        State(promise, done);
      });
    });

    describe('when promise is rejected', () => {
      it('become REJECTED once the promise is rejected', (done) => {
        const error = new Error('😱');
        const promise = new Promise((res, rej) => {
          rej(error);
        });
        const result = State(promise);
        setTimeout(() => {
          expect(result.state).to.equal(REJECTED);
          expect(result.value).to.equal(error);
          done();
        });
      });

      it('calls onRejected when it is given', (done) => {
        const promise = new Promise((res, rej) => rej());
        State(promise, null, done);
      });
    });
  });
});
