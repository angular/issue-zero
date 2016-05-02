import {Injectable} from 'angular2/core';
import {Location} from 'angular2/router';


@Injectable()
export class RepoParams {

  constructor(private location:Location) {}

  getRepo ():{org: string, repo: string} {
    var [path, org, repo] = /issues\/([a-zA-Z\+\-0-9]+)\/([a-zA-Z\+\-0-9]+)/.exec(this.location.path());

    return {org, repo};
  }

}
