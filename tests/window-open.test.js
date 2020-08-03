describe('works with window open', () => {
  let parentGlider;
  let childGlider;

  beforeEach(() => {
    window.document.body.innerHTML = '';
    const child = window.open('', 'child')

    parentGlider = PaperGlider.connectChild(child);
    childGlider = new PaperGlider(child);
    childGlider.init(child.opener);
  });

  afterEach(() => {
    parentGlider.dispose();
    childGlider.dispose();
  });

  it('receive gets proper data from send, parent to child', done => {
    childGlider.receive('someaction', (a, b) => {
      expect(a).toBe('somestring');
      expect(b).toBe(4);
      done();
    });
    parentGlider.send('someaction', ['somestring', 4]);
  });

  it('receive gets proper data from send, child to parent', done => {
    parentGlider.receive('someaction', (a, b) => {
      expect(a).toBe('somestring');
      expect(b).toBe(4);
      done();
    });
    childGlider.send('someaction', ['somestring', 4]);
  });
});
