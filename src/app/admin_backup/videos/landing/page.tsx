"use client";

import React, { useState, useEffect } from 'react';

export default function AdminLandingVideoPage() {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  // Settings keys: LANDING_VIDEO_URL, LANDING_VIDEO_THUMBNAIL
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setUrl(data.LANDING_VIDEO_URL || '');
        setThumbnail(data.LANDING_VIDEO_THUMBNAIL || '');
      }
    } catch (e) {
      console.error(e);
    }
    setFetchLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { 
      LANDING_VIDEO_URL: url,
      LANDING_VIDEO_THUMBNAIL: thumbnail
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Landing Page Video updated successfully!");
      } else {
        alert("Failed to save video settings");
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (fetchLoading) return <div className="p-8">Loading...</div>;

  return (
    <>
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Landing Page Video</h1>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-2xl">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold mb-2">Video URL / Embed Link</label>
            <input 
              type="text" 
              value={url} 
              onChange={e => setUrl(e.target.value)} 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="e.g. YouTube or Vimeo link" 
              required 
            />
            <p className="text-xs text-gray-500 mt-1">This is the main video shown on the homepage.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Thumbnail URL</label>
            <input 
              type="text" 
              value={thumbnail} 
              onChange={e => setThumbnail(e.target.value)} 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="https://..." 
            />
            <p className="text-xs text-gray-500 mt-1">Custom cover image for the video player.</p>
          </div>
          
          <div className="pt-4 border-t">
            <button type="submit" disabled={loading} className="bg-[#ff0000] text-white py-2 px-8 rounded-md font-bold hover:bg-[#cc0000] transition-colors">
              {loading ? "Saving..." : "Save Video"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
