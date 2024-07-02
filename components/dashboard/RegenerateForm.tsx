// components/RegenerateForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

const RegenerateForm = ({ streamkeyFromSupabase }: { streamkeyFromSupabase: string }) => {
  const [streamKey, setStreamKey] = useState('(Please regenerate your stream key)');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState<{ [key: string]: boolean }>({});
  const [isStreamKeyVisible, setIsStreamKeyVisible] = useState(false);
  const streamURL = "https://longday-skuxnh08.whip.livekit.cloud/w";

  useEffect(() => {
    if (streamkeyFromSupabase) {
      setStreamKey(streamkeyFromSupabase);
    }
    if(streamKey === '(Please regenerate your stream key)') {
      setIsStreamKeyVisible(true);
    }
  }, [streamkeyFromSupabase]);

  const handleRegenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsRegenerating(true);
      const response = await fetch('/auth/create-ingress', {
        method: 'POST',
      });
      const ingress = await response.json();
      console.log('New Ingress:', ingress);
      setStreamKey(ingress.streamKey); // Assuming `ingress` has a `streamKey` property
      setIsRegenerating(false);

    } catch (error) {
      console.error('Failed to regenerate ingress:', error);
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(prevState => ({ ...prevState, [field]: true }));
      setTimeout(() => {
        setCopySuccess(prevState => ({ ...prevState, [field]: false }));
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text:', err);
    });
  };

  const toggleStreamKeyVisibility = () => {
    setIsStreamKeyVisible(prevState => !prevState);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleRegenerate}>
      <Label className="text-md font-medium text-neutral-500 dark:text-neutral-400 -mb-3 cursor-text">Stream URL</Label>
      <div className='flex flex-row gap-2'>
        <Input id="streamURL" name="streamURL" value={streamURL} disabled={true} className="cursor-text" />
        {copySuccess['streamURL'] ? (
          <Icons.check 
            className="bg-slate-100 text-green-500 dark:text-green-400 text-2xl cursor-pointer rounded-md h-10 w-10 p-2"
          />
        ) : (
          <Icons.copy 
            className="bg-slate-100 text-slate-700 dark:text-white dark:bg-slate-700 text-2xl cursor-pointer rounded-md h-10 w-10 p-2" 
            onClick={() => copyToClipboard(streamURL, 'streamURL')} 
          />
        )}
      </div>
      <Label className="text-md font-medium text-neutral-500 dark:text-neutral-400 -mb-3 cursor-text">Stream Key</Label>
      <div className='flex flex-row gap-2 items-center'>
        <Input 
          id="streamKey" 
          name="streamKey" 
          type={isStreamKeyVisible ? 'text' : 'password'} 
          value={streamKey} 
          disabled={true} 
          className="cursor-text" 
        />
        <Icons.eye
          className={`text-slate-700 dark:text-white text-2xl cursor-pointer rounded-md h-10 w-10 p-2 ${isStreamKeyVisible ? 'text-blue-500' : ''}`}
          onClick={toggleStreamKeyVisibility}
        />
        {copySuccess['streamKey'] ? (
          <Icons.check 
            className="bg-slate-100 text-green-500 dark:text-green-400 text-2xl cursor-pointer rounded-md h-10 w-10 p-2"
          />
        ) : (
          <Icons.copy 
            className="bg-slate-100 text-slate-700 dark:text-white dark:bg-slate-700 text-2xl cursor-pointer rounded-md h-10 w-10 p-2" 
            onClick={() => copyToClipboard(streamKey, 'streamKey')} 
          />
        )}
      </div>

      <Button type="submit" className="mt-2 bg-[#21b0c0] text-background hover:bg-[#3fcfde]">
        {isRegenerating ? 'Regenerating...' : 'Regenerate Stream Key'}
      </Button>

    </form>
  );
};

export default RegenerateForm;
