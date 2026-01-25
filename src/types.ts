export type Idea = {
  _id: string;
  title: string;
  description: string;
  summary: string;
  tags: string[];
  createdAt: string;
  user: string;
};

export type User = { id: string; name: string; email: string };
