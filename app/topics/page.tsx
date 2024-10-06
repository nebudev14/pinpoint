import CreateTopicModal from '@/components/create-topic-modal';
import { createClient } from '@/utils/supabase/server';
import { currentUser } from '@clerk/nextjs/server';
import { SetStateAction } from 'react';

export default async function Topics() {
  const supabase = createClient();
  const { data: topics } = await supabase.from("topics").select();
  const user =  await currentUser();

  console.log(user?.id);

  // return <pre>{JSON.stringify(topics, null, 2)}</pre>
  return (
    <div className='flex items-center justify-center h-screen'>
      <CreateTopicModal open={false} setOpen={function (value: SetStateAction<boolean>): void {
        throw new Error('Function not implemented.');
      } }/>
    </div>
  );
}