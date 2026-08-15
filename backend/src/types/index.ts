export interface Project {
  id?: string;
  title: string;
  slug: string;
  description: string;
  full_content?: string;
  thumbnail_url: string;
  video_demo_url?: string;
  technologies: string[];
  live_url?: string;
  is_featured?: boolean;
  created_at?: Date;
}

export interface ClientMessage {
  id?: string;
  client_name: string;
  client_email: string;
  subject?: string;
  message: string;
  created_at?: Date;
}