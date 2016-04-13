export class IssueCliPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('issue-cli-app p')).getText();
  }
}
