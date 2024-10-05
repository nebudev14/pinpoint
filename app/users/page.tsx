import { createClient } from '@/utils/supabase/server';

export default async function Users() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("users").select();

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}