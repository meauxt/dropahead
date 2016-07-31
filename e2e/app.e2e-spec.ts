import { DropaheadPage } from './app.po';

describe('dropahead App', function() {
  let page: DropaheadPage;

  beforeEach(() => {
    page = new DropaheadPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
