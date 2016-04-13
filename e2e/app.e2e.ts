import { IssueCliPage } from './app.po';

describe('issue-cli App', function() {
  let page: IssueCliPage;

  beforeEach(() => {
    page = new IssueCliPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('issue-cli Works!');
  });
});
