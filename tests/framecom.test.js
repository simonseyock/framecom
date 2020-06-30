let parentCom;
let childCom;

beforeEach(() => {
  const FrameCom = require('../index');

  window.document.body.innerHTML = '';
  const iframe = window.document.createElement('iframe');
  window.document.body.append(iframe);

  parentCom = new FrameCom(window, iframe.contentWindow, '*');
  childCom = new FrameCom(iframe.contentWindow, window, '*');
});

afterEach(() => {
  parentCom.dispose();
  childCom.dispose();
});

test('receive gets proper data from send, parent to child', done => {
  childCom.receive('someaction', (a, b) => {
    expect(a).toBe('somestring');
    expect(b).toBe(4);
    done();
  });
  parentCom.send('someaction', ['somestring', 4]);
});

test('receive gets proper data from send, child to parent', done => {
  parentCom.receive('someaction', (a, b) => {
    expect(a).toBe('somestring');
    expect(b).toBe(4);
    done();
  });
  childCom.send('someaction', ['somestring', 4]);
});

test('receive only reacts to the right action', done => {
  let counter = 0;
  childCom.receive('someaction', () => {
    counter++;
  });
  parentCom.send('someaction');
  parentCom.send('otheraction');
  parentCom.send('someaction');
  setTimeout(() => {
    expect(counter).toBe(2);
    done();
  },200);
});

test('receive can get removed', done => {
  let counter = 0;
  const end = childCom.receive('someaction', () => {
    counter++;
  });
  parentCom.send('someaction');
  setTimeout(() => {
    end();
    parentCom.send('someaction');
  }, 0);
  setTimeout(() => {
    expect(counter).toBe(1);
    done();
  },200);
});

test('request gets data from replyOn', done => {
  let counter = 0;
  parentCom.replyOn('someaction', (a, b) => a === b);
  childCom.request('someaction', [2, 3], result => {
    expect(result).toBe(false);
    counter++;
  });
  childCom.request('someaction', [2, 2], result => {
    expect(result).toBe(false);
    counter++;
  });
  setTimeout(() => {
    expect(counter).toBe(2);
    done()
  }, 200);
});

test('replyOn can be ended', done => {
  let counter = 0;
  const end = parentCom.replyOn('someaction', () => null);

  childCom.request('someaction', undefined, () => {
    counter++;
  });
  setTimeout(() => {
    end();
    setTimeout(() => {
      childCom.request('someaction', undefined, () => {
        counter++;
      });
    }, 0);
  },0);

  setTimeout(() => {
    expect(counter).toBe(1);
    done();
  }, 200);
});
