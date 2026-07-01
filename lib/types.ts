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
  is_exclusive?: boolean
  view_count: number
  category_id: string | null
  published_at: string | null
  created_at: string
  category?: Category | null
  columnist_id?: string | null
  columnist?: Columnist | null
editor_id?: string | null
  editor?: Editor | null
}

export interface Slider {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link: string | null
  order_index: number
  is_active: boolean
  type: string
  created_at: string
}

export interface Columnist {
  id: string
  name: string
  title: string
  photo_url: string | null
  bio: string | null
  slug: string
  is_active: boolean
  order_index: number
  created_at: string
}
export interface Editor {
  id: string
  name: string
  slug: string
  photo_url: string | null
  bio: string | null
  is_active: boolean
  order_index: number
  created_at: string
}
