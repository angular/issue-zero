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

export type Issue = {
  id: number;
  url: string;
  user: User;
  body: string;
  title: string;
  number: number;
  labels: Label[]
  // Additional properties
  org: string;
  repo: string;
  isPendingRemoval?: boolean;
}

export type Label = {
  url: string;
  name: string;
  color: string;
}
