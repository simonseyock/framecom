let parentGlider;
let childGlider;

beforeEach(() => {
  const PaperGlider = require('../index');

  window.document.body.innerHTML = '';
  const iframe = window.document.createElement('iframe');
  window.document.body.append(iframe);

  parentGlider = new PaperGlider(window, iframe.contentWindow, '*');
  childGlider = new PaperGlider(iframe.contentWindow, iframe.contentWindow.parent, '*');
});

afterEach(() => {
  parentGlider.dispose();
  childGlider.dispose();
});

test('receive gets proper data from send, parent to child', done => {
  childGlider.receive('someaction', (a, b) => {
    expect(a).toBe('somestring');
    expect(b).toBe(4);
    done();
  });
  parentGlider.send('someaction', ['somestring', 4]);
});

test('receive gets proper data from send, child to parent', done => {
  parentGlider.receive('someaction', (a, b) => {
    expect(a).toBe('somestring');
    expect(b).toBe(4);
    done();
  });
  childGlider.send('someaction', ['somestring', 4]);
});

test('receive only reacts to the right action', done => {
  let counter = 0;
  childGlider.receive('someaction', () => {
    counter++;
  });
  parentGlider.send('someaction');
  parentGlider.send('otheraction');
  parentGlider.send('someaction');
  setTimeout(() => {
    expect(counter).toBe(2);
    done();
  },200);
});

test('receive can get removed', done => {
  let counter = 0;
  const end = childGlider.receive('someaction', () => {
    counter++;
  });
  parentGlider.send('someaction');
  setTimeout(() => {
    end();
    parentGlider.send('someaction');
  }, 0);
  setTimeout(() => {
    expect(counter).toBe(1);
    done();
  },200);
});

test('request gets data from replyOn', done => {
  let counter = 0;
  parentGlider.replyOn('someaction', (a, b) => a === b);
  childGlider.request('someaction', [2, 3], result => {
    expect(result).toBe(false);
    counter++;
  });
  childGlider.request('someaction', [2, 2], result => {
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
  const end = parentGlider.replyOn('someaction', () => null);

  childGlider.request('someaction', undefined, () => {
    counter++;
  });
  setTimeout(() => {
    end();
    setTimeout(() => {
      childGlider.request('someaction', undefined, () => {
        counter++;
      });
    }, 0);
  },0);

  setTimeout(() => {
    expect(counter).toBe(1);
    done();
  }, 200);
});
