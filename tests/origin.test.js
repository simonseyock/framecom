describe('origin is respected', () => {
  let com;

  afterEach(() => {
    com.dispose();
    window.document.body.innerHTML = '';
  });

  it('message is accepted if origin is right', done => {
    const iframeOrigin = 'http://localhost:9877';
    const iframe = window.document.createElement('iframe');
    iframe.src = iframeOrigin + '/tests/cross-origin-content/';

    com = PaperGlider.connectIframe(iframe, iframeOrigin);

    window.document.body.append(iframe);

    com.onConnect(() => {
      com.request('someaction', ['value'], res => {
        expect(res.text).toBe('reply');
        expect(res.value).toBe('value');
        done();
      });
    });
  });

  xit('glider does not connect if origin is not right', done => {
    const iframeRealOrigin = 'http://localhost:9877';
    const iframeWrongOrigin = 'http://localhost:9878';
    const iframe = window.document.createElement('iframe');
    iframe.src = iframeRealOrigin + '/tests/cross-origin-content/';

    com = PaperGlider.connectIframe(iframe, iframeWrongOrigin);

    window.document.body.append(iframe);

    let called = false;
    com.onConnect(() => {
      called = true;
    });
    setTimeout(() => {
      expect(called).toBe(false);
      done();
    }, 500);
  });
});
