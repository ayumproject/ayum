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
  summary: string | null
  content: string
  image_url: string | null
  author: string
  is_published: boolean
  is_breaking: boolean
  view_count: number
  category_id: string | null
  published_at: string | null
  created_at: string
  category?: Category | null
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