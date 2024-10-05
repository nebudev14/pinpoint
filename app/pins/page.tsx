import CreateEventModal from '@/components/create-event-modal';
import { createClient } from '@/utils/supabase/server';
import { currentUser } from '@clerk/nextjs/server';
export default async function Pins() {
  const supabase = createClient();
  const { data: topics } = await supabase.from("topics").select();
  const user =  await currentUser();

  console.log(user?.id);

  // return <pre>{JSON.stringify(pins, null, 2)}</pre>
  return (
    <div className='flex items-center justify-center h-screen'>
      <CreateEventModal topics={topics} />
    </div>
  );
}