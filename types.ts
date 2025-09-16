export interface Plumber {
  id: string;
  name: string;
  phone: string;
  city: string;
  bio: string;
  address?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  ratings: number[];
  is_verified: boolean;
  likes: number;
  dislikes: number;
  comment_count: number;
  created_at?: string;
}

export interface Comment {
  id: string;
  created_at: string;
  plumber_id: string;
  author: string;
  content: string;
}

export type Page = 'home' | 'directory' | 'about' | 'contact' | 'privacy' | 'plumberDetail';

export type Language = 'en' | 'fr' | 'ar';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}