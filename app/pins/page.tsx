import { createClient } from '@/utils/supabase/server';

export default async function Pins() {
  const supabase = createClient();
  const { data: pins } = await supabase.from("pins").select();

  return <pre>{JSON.stringify(pins, null, 2)}</pre>
}