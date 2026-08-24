"use client";

import React, { useState, useEffect } from 'react';

type Video = {
  id: string;
  title: string;
  type: string;
  url: string;
  thumbnail?: string;
};

export default function AdminTutorialVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('YOUTUBE');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch('/api/admin/videos');
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (e) {
      console.error(e);
    }
    setFetchLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { title, type, url, thumbnail };
    const endpoint = editingId ? `/api/admin/videos/${editingId}` : '/api/admin/videos';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchVideos();
        resetForm();
      } else {
        alert("Failed to save video");
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchVideos();
      } else {
        alert("Failed to delete video");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingId(video.id);
    setTitle(video.title);
    setType(video.type);
    setUrl(video.url);
    setThumbnail(video.thumbnail || '');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setType('YOUTUBE');
    setUrl('');
    setThumbnail('');
  };

  return (
    <>
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Tutorial Videos Management</h1>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 self-start">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">
            {editingId ? "Edit Tutorial Video" : "Add New Tutorial Video"}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1">Video Title (Optional)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Leave empty to auto-fetch from link" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                  <option value="YOUTUBE">YouTube</option>
                  <option value="VIMEO">Vimeo</option>
                  <option value="GOOGLE_DRIVE">Google Drive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Video URL / Embed ID</label>
                <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Thumbnail URL (Optional)</label>
              <input type="text" value={thumbnail} onChange={e => setThumbnail(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="https://..." />
            </div>
            
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="flex-1 bg-[#ff0000] text-white py-2 px-6 rounded-md font-bold hover:bg-[#cc0000] transition-colors">
                {loading ? "Saving..." : (editingId ? "Update Video" : "Add Video")}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md font-bold hover:bg-slate-300 transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Active Tutorial Videos</h2>
          
          {fetchLoading ? (
            <p className="text-slate-500 text-sm">Loading videos...</p>
          ) : videos.length === 0 ? (
            <p className="text-slate-500 text-sm">No tutorial videos found. Add one!</p>
          ) : (
            <div className="space-y-3">
              {videos.map((video) => (
                <div key={video.id} className="p-4 bg-slate-50 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{video.title}</p>
                    <p className="text-xs text-slate-500">
                      {video.type} - {video.url.substring(0, 30)}...
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(video)} className="text-blue-500 text-sm font-bold hover:underline">Edit</button>
                    <button onClick={() => handleDelete(video.id)} className="text-red-500 text-sm font-bold hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
