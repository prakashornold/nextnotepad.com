import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key);

const CLIENT_KEY = 'nextnotepad_client_id';
export function getClientId(): string {
  let id = localStorage.getItem(CLIENT_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLIENT_KEY, id);
  }
  return id;
}

export type NotepadFile = {
  id: string;
  user_id: string | null;
  client_id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  is_folder: boolean;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};
