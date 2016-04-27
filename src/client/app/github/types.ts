export type Repo = {
  name: string;
  full_name: string;
  owner: User;
}

export type User = {
  avatar_url: string;
  login: string;
}

export enum GithubObjects {
  User,
  Repo,
  Issue
}