import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RegenerateForm from '@/components/dashboard/RegenerateForm';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function PrivatePage({ params: { slug } }: PageProps) {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    redirect('/');
  }

  if (authData.user.user_metadata.username !== slug) {
    redirect(`/channel/${authData.user.user_metadata.username}/home`);
  }

  async function getStreamKey() {
    const { data, error } = await supabase.rpc('get_stream_key');
    if (error) {
      console.error('Error fetching stream key:', error);
      return null;
    }
    return data;
  }

  const streamKey = await getStreamKey();

  console.log('Stream Key:', streamKey);

  return (
    <>
      <h1 className="text-7xl float-left ml-4 md:ml-24 mr-24 mt-8 font-bold">👋 Hey, {authData.user.user_metadata.username}</h1>
      <h2 className='text-4xl float-left ml-4 md:ml-24 mr-24 mt-8 font-bold'>Welcome to <u>your</u> streaming dashboard!</h2>

      <div className='ml-4 md:ml-24 mr-24 mt-8 flex flex-row gap-5'>
        <div className='dark:bg-slate-800 bg-slate-200 p-4 rounded-md w-1/3'>
          <h3 className='text-3xl font-bold mb-3'>Your Overall Stats</h3>
          <div className='flex flex-row gap-16 justify-center items-center h-[85%]'>
            <div className='flex flex-col justify-center items-center'>
              <p className='text-5xl font-bold'>0</p>
              <p className='text-2xl'>Streams</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <p className='text-5xl font-bold'>0</p>
              <p className='text-2xl'>Followers</p>
            </div>
          </div>
        </div>
        <div className='dark:bg-slate-800 bg-slate-200 p-4 rounded-md w-1/3'>
          <h3 className='text-3xl font-bold mb-3'>Stream Public Info</h3>
          <form className="flex flex-col gap-4">
            <Label className="text-md font-medium text-neutral-500 dark:text-neutral-400 -mb-3">Stream Title</Label>
            <Input id="streamTitle" name="streamTitle" placeholder="Title" />
            <Label className="text-md font-medium text-neutral-500 dark:text-neutral-400 -mb-3">Stream Genre</Label>
            <Input id="streamGenre" name="streamGenre" placeholder="Stream Genre" />
            <Button type="submit" className="mt-2 bg-[#21b0c0] text-background dark:bg-[#3fcfde]">
              Update Stream Info
            </Button>
          </form>
        </div>
        <div className='dark:bg-slate-800 bg-slate-200 p-4 rounded-md w-1/3'>
          <h3 className='text-3xl font-bold mb-3'>Stream Secret Info</h3>
          <RegenerateForm streamkeyFromSupabase={streamKey}/>
        </div>
      </div>
      <div className='ml-4 md:ml-24 mr-24 mt-8 flex flex-row'>
        <div className='dark:bg-slate-800 bg-slate-200 p-4 rounded-md w-full'>
          <h3 className='text-3xl font-bold mb-3'>Spotlight</h3>
        </div>
      </div>
    </>
  );
}
