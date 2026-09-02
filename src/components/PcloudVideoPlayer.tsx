'use client';
import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

export default function PcloudVideoPlayer({ url, poster, className }: { url: string, poster?: string, className?: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let cancelled = false;
    let currentBlobUrl: string | null = null;

    async function fetchAndBlob() {
      try {
        let directUrl = url;
        
        // Extract pCloud direct URL if needed
        if (url.includes('pcloud') && url.includes('code=')) {
          const codeMatch = url.match(/code=([^&]+)/);
          if (!codeMatch) {
            setError('Invalid pCloud link');
            setLoading(false);
            return;
          }
          
          const code = codeMatch[1];
          const res = await fetch(`https://api.pcloud.com/getpublinkdownload?code=${code}`, {
            referrerPolicy: "no-referrer"
          });
          const data = await res.json();
          
          if (data.result !== 0 || !data.hosts?.length || !data.path) {
            setError(`pCloud Error: ${data.error || 'Failed to load video'}`);
            setLoading(false);
            return;
          }
          directUrl = `https://${data.hosts[0]}${data.path}`;
        }

        // Fetch video as blob to hide direct URL from IDM
        const response = await fetch(directUrl, { referrerPolicy: "no-referrer" });
        
        if (!response.ok) throw new Error('Failed to fetch video');
        
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        
        const reader = response.body?.getReader();
        if (!reader) throw new Error('Streaming not supported');
        
        const chunks: ArrayBuffer[] = [];
        let received = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value.buffer);
          received += value.length;
          if (total > 0 && !cancelled) {
            setLoadingProgress(Math.round((received / total) * 100));
          }
        }
        
        if (cancelled) return;
        
        const blob = new Blob(chunks, { type: 'video/mp4' });
        currentBlobUrl = URL.createObjectURL(blob);
        setBlobUrl(currentBlobUrl);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError('ভিডিও লোড করতে সমস্যা হয়েছে।');
          setLoading(false);
        }
      }
    }
    
    fetchAndBlob();
    
    return () => {
      cancelled = true;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [url]);

  // Disable right-click on video
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Block keyboard shortcuts for download/inspect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+S (save), Ctrl+U (view source), Ctrl+Shift+I (DevTools)
      if (
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'i') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'j') ||
        (e.key === 'F12')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, []);

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
        <span className="text-sm font-medium animate-pulse">ভিডিও লোড হচ্ছে...</span>
        {loadingProgress > 0 && (
          <div className="w-48 mt-3">
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-red-500 h-1.5 rounded-full transition-all" style={{ width: `${loadingProgress}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1">{loadingProgress}%</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <video 
      ref={videoRef}
      src={blobUrl || undefined} 
      poster={poster}
      controls 
      autoPlay 
      controlsList="nodownload"
      onContextMenu={handleContextMenu}
      className={className}
      style={{ userSelect: 'none' }}
    />
  );
}
