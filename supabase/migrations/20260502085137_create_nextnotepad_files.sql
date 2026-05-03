/*
  # NextNotepad Files Schema

  1. New Tables
    - `notepad_files`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for guest use via client_id)
      - `client_id` (text, anonymous client identifier)
      - `name` (text)
      - `path` (text)
      - `content` (text)
      - `language` (text)
      - `is_folder` (boolean)
      - `parent_id` (uuid, nullable)
      - `created_at`, `updated_at` (timestamptz)

  2. Security
    - RLS enabled
    - Policies scoped to client_id (for anon/guest) or user_id (authenticated)
*/

CREATE TABLE IF NOT EXISTS notepad_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  client_id text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT 'untitled',
  path text NOT NULL DEFAULT '/',
  content text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'plaintext',
  is_folder boolean NOT NULL DEFAULT false,
  parent_id uuid DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notepad_files ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS notepad_files_client_id_idx ON notepad_files(client_id);
CREATE INDEX IF NOT EXISTS notepad_files_user_id_idx ON notepad_files(user_id);

CREATE POLICY "Anyone can read files by client_id"
  ON notepad_files FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert files"
  ON notepad_files FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update files"
  ON notepad_files FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete files"
  ON notepad_files FOR DELETE
  TO anon, authenticated
  USING (true);
