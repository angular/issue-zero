import { IssueZeroPage } from './app.po';

describe('issue-zero App', function() {
  let page: IssueZeroPage;

  beforeEach(() => {
    page = new IssueZeroPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('issue-zero works!');
  });
});
