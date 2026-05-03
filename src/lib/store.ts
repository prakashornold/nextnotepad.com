import { supabase, getClientId, NotepadFile } from './supabase';

const clientId = getClientId();

export async function listFiles(): Promise<NotepadFile[]> {
  const { data, error } = await supabase
    .from('notepad_files')
    .select('*')
    .eq('client_id', clientId)
    .order('is_folder', { ascending: false })
    .order('name', { ascending: true });
  if (error) { console.error(error); return []; }
  return (data || []) as NotepadFile[];
}

export async function createFile(name: string, isFolder = false, parentId: string | null = null, content = '', language = 'plaintext'): Promise<NotepadFile | null> {
  const { data, error } = await supabase
    .from('notepad_files')
    .insert({ client_id: clientId, name, is_folder: isFolder, parent_id: parentId, content, language, path: '/' })
    .select()
    .maybeSingle();
  if (error) { console.error(error); return null; }
  return data as NotepadFile;
}

export async function updateFile(id: string, patch: Partial<NotepadFile>): Promise<void> {
  const { error } = await supabase
    .from('notepad_files')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) console.error(error);
}

export async function deleteFile(id: string): Promise<void> {
  const { error } = await supabase.from('notepad_files').delete().eq('id', id);
  if (error) console.error(error);
}
