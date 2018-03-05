
export interface Link {
  href: string;
}

export interface LabeledLink {
  href: string;
  name: string;
}

export interface Links {
  watchers: Link;
  branches: Link;
  tags: Link;
  commits: Link;
  clone: LabeledLink[];
  self: Link;
  source: Link;
  html: Link;
  avatar: Link;
  hooks: Link;
  forks: Link;
  downloads: Link;
  pullrequests: Link;
}

export interface ProjectLinks {
  self: Link;
  html: Link;
  avatar: Link;
}

export interface Project {
  key: string;
  type: string;
  uuid: string;
  links: ProjectLinks;
  name: string;
}

export interface OwnerLinks {
  self: Link;
  html: Link;
  avatar: Link;
}

export interface Owner {
  username: string;
  display_name: string;
  type: string;
  uuid: string;
  links: OwnerLinks;
}

export interface IBitbucketRepository {
  scm: string;
  website: string;
  has_wiki: boolean;
  name: string;
  links: Links;
  fork_policy: string;
  uuid: string;
  project: Project;
  language: string;
  created_on: Date;
  mainbranch: LabeledLink;
  full_name: string;
  has_issues: boolean;
  owner: Owner;
  updated_on: Date;
  size: number;
  type: string;
  slug: string;
  is_private: boolean;
  description: string;
}

export interface BitbucketRepositoriesResponse {
  pagelen: number;
  values: IBitbucketRepository[];
  page: number;
  size: number;
}


