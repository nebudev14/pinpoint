import { createClient } from '@/utils/supabase/server';

export default async function Topics() {
  const supabase = createClient();
  const { data: topics } = await supabase.from("topics").select();

  return <pre>{JSON.stringify(topics, null, 2)}</pre>
}