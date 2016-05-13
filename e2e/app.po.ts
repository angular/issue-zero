export class IssueZeroPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('issue-zero-app h1')).getText();
  }
}
