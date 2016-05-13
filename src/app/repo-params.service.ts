import {Injectable} from '@angular/core';
import {Location} from '@angular/common';

@Injectable()
export class RepoParamsService {
  constructor(private location:Location) {}

  getRepo ():{org: string, repo: string} {
    var [path, org, repo] = /issues\/([a-zA-Z\+\-0-9]+)\/([a-zA-Z\+\-0-9]+)/.exec(this.location.path());
    return {org, repo};
  }
}
