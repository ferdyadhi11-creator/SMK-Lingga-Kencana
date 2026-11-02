export type Program = {
  id: number;
  name: string;
  short?: string;
  description?: string | null;
  image_url?: string | null;
};

export type NewsItem = {
  id: number;
  category: string;
  date?: string | null;
  title: string;
  excerpt: string;
  content?: string | null;
  image_url?: string | null;
};
