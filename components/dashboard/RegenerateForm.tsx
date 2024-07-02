// components/RegenerateForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { set } from 'react-hook-form';

const RegenerateForm = ({ streamkeyFromSupabase }: { streamkeyFromSupabase: string }) => {
  const [streamKey, setStreamKey] = useState('Stream Key');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (streamkeyFromSupabase) {
      setStreamKey(streamkeyFromSupabase);
    }
  }, [streamkeyFromSupabase]);

  const handleRegenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/auth/create-ingress', {
        method: 'POST',
      });

      // show loading state on button
      setIsRegenerating(true);


      const ingress = await response.json();
      console.log('New Ingress:', ingress);
      // Update the state with the new stream key if needed
      setStreamKey(ingress.streamKey); // Assuming `ingress` has a `streamKey` property
      setIsRegenerating(false);
    } catch (error) {
      console.error('Failed to regenerate ingress:', error);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleRegenerate}>
      <Label className="text-md font-medium text-neutral-500 dark:text-neutral-400 -mb-3 cursor-text">Stream URL</Label>
      <div className='flex flex-row gap-2'>
        <Input id="streamURL" name="streamURL" value={"https://testing-3bv8jaze.whip.livekit.cloud/w"} disabled={true} className="cursor-text" />
        <Icons.copy className="bg-slate-100 text-slate-700 dark:text-white dark:bg-slate-700 text-2xl cursor-pointer rounded-md h-10 w-10 p-2" />
      </div>
      <Label className="text-md font-medium text-neutral-500 dark:text-neutral-400 -mb-3 cursor-text">Stream Key</Label>
      <div className='flex flex-row gap-2'>
        <Input id="streamKey" name="streamKey" value={streamKey} disabled={true} className="cursor-text" />
        <Icons.copy className="bg-slate-100 text-slate-700 dark:text-white dark:bg-slate-700 text-2xl cursor-pointer rounded-md h-10 w-10 p-2" />
      </div>
      {/* <Button type="submit" className="mt-2 bg-[#21b0c0] text-background dark:bg-[#3fcfde]">
        Regenerate Stream Key
      </Button> */}

      <Button type="submit" className="mt-2 bg-[#21b0c0] text-background dark:bg-[#3fcfde]" disabled={isRegenerating}>
        {isRegenerating ? 'Regenerating...' : 'Regenerate Stream Key'}
      </Button>
    </form>
  );
};

export default RegenerateForm;
