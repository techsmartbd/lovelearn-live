'use client';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function PcloudVideoPlayer({ url, poster, className }: { url: string, poster?: string, className?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  let streamUrl = url;
  if (url.includes('pcloud') && url.includes('code=')) {
    const codeMatch = url.match(/code=([^&]+)/);
    if (codeMatch) {
      streamUrl = `/api/pcloud/stream?code=${codeMatch[1]}`;
    }
  }

  if (error) {
    return (
      <div className={"flex flex-col items-center justify-center bg-slate-900 text-white " + (className || '')}>
        <span className="text-red-500 font-bold text-sm px-4 text-center">{error}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
          <span className="text-sm font-medium animate-pulse">ভিডিও লোড হচ্ছে...</span>
        </div>
      )}
      <video 
        src={streamUrl} 
        poster={poster}
        controls 
        autoPlay 
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        className={className}
        style={{ userSelect: 'none' }}
        onLoadedData={() => setLoading(false)}
        onError={() => { setError('ভিডিও লোড করতে সমস্যা হয়েছে।'); setLoading(false); }}
      />
    </div>
  );
}
