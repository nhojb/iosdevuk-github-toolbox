export type Response = {
  items: Issue[];
};

export type Issue = {
  id: number;
  repository_url: string;
  number: number;
  state: "open" | "closed";
  title: string;
  body?: string;
  comments: number;
  updated_at: string;
  html_url: string;
  user?: User;
  repository?: Repository;
  pull_request?: PullRequest;
};

export type Repository = {
  id: number;
  full_name: string;
};

export type PullRequest = {
  merged_at: string;
  html_url: string;
};

export type User = {
  id: number;
  login: string;
  name?: string;
  avatar_url: string;
};
