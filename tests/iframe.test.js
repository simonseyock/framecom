describe('works with iframes', () => {
  let parentGlider;
  let childGlider;

  beforeEach(() => {
    const iframe = window.document.createElement('iframe');
    window.document.body.append(iframe);

    parentGlider = PaperGlider.connect().toWindow(iframe.contentWindow);
    childGlider = PaperGlider.connect(iframe.contentWindow).toParent();
  });

  afterEach(() => {
    parentGlider.dispose();
    childGlider.dispose();
    window.document.body.innerHTML = '';
  });

  it('should connect', done => {
    expect(childGlider.isConnected()).toBe(false);
    expect(parentGlider.isConnected()).toBe(false);

    setTimeout(() => {
      expect(childGlider.isConnected()).toBe(true);
      expect(parentGlider.isConnected()).toBe(true);
      done();
    }, 300)
  });

  it('receive gets proper data from send, parent to child', done => {
    childGlider.receive('someaction', (a, b) => {
      expect(a).toBe('somestring');
      expect(b).toBe(4);
      done();
    });
    childGlider.onConnect(() => {
      parentGlider.send('someaction', ['somestring', 4]);
    });
  });

  it('receive gets proper data from send, child to parent', done => {
    parentGlider.receive('someaction', (a, b) => {
      expect(a).toBe('somestring');
      expect(b).toBe(4);
      done();
    });
    childGlider.onConnect(() => {
      childGlider.send('someaction', ['somestring', 4]);
    });
  });

  it('receive only reacts to the right action', done => {
    let counter = 0;
    childGlider.receive('someaction', () => {
      counter++;
    });
    parentGlider.onConnect(() => {
      parentGlider.send('someaction');
      parentGlider.send('otheraction');
      parentGlider.send('someaction');
      setTimeout(() => {
        expect(counter).toBe(2);
        done();
      }, 200);
    });
  });

  it('receive can get removed', done => {
    let counter = 0;
    const end = childGlider.receive('someaction', () => {
      counter++;
    });
    parentGlider.onConnect(() => {
      parentGlider.send('someaction');
      setTimeout(() => {
        end();
        parentGlider.send('someaction');
      }, 0);
      setTimeout(() => {
        expect(counter).toBe(1);
        done();
      }, 200);
    });
  });

  it('request gets data from replyOn', done => {
    let counter = 0;
    parentGlider.replyOn('someaction', (a, b) => a === b);
    childGlider.onConnect(() => {
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
  });

  it('replyOn can be ended', done => {
    let counter = 0;
    const end = parentGlider.replyOn('someaction', () => null);

    childGlider.onConnect(() => {
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
      }, 0);

      setTimeout(() => {
        expect(counter).toBe(1);
        done();
      }, 200);
    });
  });
});

