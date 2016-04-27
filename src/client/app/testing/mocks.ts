export class MockLocalStorage {
  private _cache = {};
  getItem (key:string): string {
    return key in this._cache ? this._cache[key] : null;
  }

  setItem (key:string, value:string): void {
    // Matches localStorage semantics
    this._cache[key] = value.toString();
  }
}
