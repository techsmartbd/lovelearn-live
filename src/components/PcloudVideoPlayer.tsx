'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function PcloudVideoPlayer({ url, poster, className }: { url: string, poster?: string, className?: string }) {
  const [directUrl, setDirectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPcloud() {
      try {
        const codeMatch = url.match(/code=([^&]+)/);
        if (!codeMatch) {
          setDirectUrl(url); // Fallback to direct url if no code found
          setLoading(false);
          return;
        }
        
        const code = codeMatch[1];
        const res = await fetch(`https://api.pcloud.com/getpublinkdownload?code=${code}`, {
          referrerPolicy: "no-referrer"
        });
        const data = await res.json();
        
        if (data.result === 0 && data.hosts?.length > 0 && data.path) {
          setDirectUrl(`https://${data.hosts[0]}${data.path}`);
        } else {
          setError(`pCloud Error: ${data.error || 'Failed to load video'}`);
        }
      } catch (err) {
        setError('Network error connecting to pCloud.');
      } finally {
        setLoading(false);
      }
    }
    
    if (url.includes('pcloud') && url.includes('code=')) {
      fetchPcloud();
    } else {
      setDirectUrl(url);
      setLoading(false);
    }
  }, [url]);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900 text-white ${className}`}>
        <span className="text-red-500 font-bold text-sm px-4 text-center">{error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900 text-white ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
        <span className="text-sm font-medium animate-pulse">Connecting to My PC Cloud...</span>
      </div>
    );
  }

  return (
    <video 
      src={directUrl || url} 
      poster={poster}
      controls 
      autoPlay 
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      className={className}
    />
  );
}
