export interface Category {
  id: string
  name: string
  slug: string
  color: string
  created_at: string
}

export interface News {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  image_url: string | null
  category_id: string
  category?: Category
  author: string
  is_published: boolean
  is_breaking: boolean
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Slider {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link: string | null
  order_index: number
  is_active: boolean
  created_at: string
}

export interface BreakingNews {
  id: string
  content: string
  is_active: boolean
  created_at: string
}