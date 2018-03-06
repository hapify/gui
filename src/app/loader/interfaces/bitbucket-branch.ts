
export interface Link {
  href: string;
}

export interface RepositoryLinks {
  self: Link;
  html: Link;
  avatar: Link;
}

export interface Repository {
  links: RepositoryLinks;
  type: string;
  name: string;
  full_name: string;
  uuid: string;
}

export interface TargetLinks {
  self: Link;
  comments: Link;
  patch: Link;
  html: Link;
  diff: Link;
  approve: Link;
  statuses: Link;
}

export interface UserLinks {
  self: Link;
  html: Link;
  avatar: Link;
}

export interface User {
  username: string;
  display_name: string;
  type: string;
  uuid: string;
  links: UserLinks;
}

export interface Author {
  raw: string;
  type: string;
  user: User;
}

export interface ParentLinks {
  self: Link;
  html: Link;
}

export interface Parent {
  hash: string;
  type: string;
  links: ParentLinks;
}

export interface Target {
  hash: string;
  repository: Repository;
  links: TargetLinks;
  author: Author;
  parents: Parent[];
  date: Date;
  message: string;
  type: string;
}

export interface BranchLinks {
  commits: Link;
  self: Link;
  html: Link;
}

export interface IBitbucketBranch {
  type: string;
  name: string;
  links: BranchLinks;
  target: Target;
}

export interface BitbucketBranchesResponse {
  pagelen: number;
  values: IBitbucketBranch[];
  page: number;
  size: number;
}
