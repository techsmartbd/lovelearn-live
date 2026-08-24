"use client";

import React, { useState, useEffect } from 'react';
import { Play, Lock, Trash2, Loader2, Sparkles, CheckCircle2, Cloud } from 'lucide-react';
import PcloudVideoPlayer from '@/components/PcloudVideoPlayer';

type LandingVideo = {
  id: string;
  title: string;
  type: string;
  url: string;
  thumbnail?: string;
  isActive: boolean;
};

export default function AdminLandingVideoPage() {
  const [videos, setVideos] = useState<LandingVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('CLOUD');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchVideos().finally(() => {
      setFetchLoading(false);
    });
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/landing-videos');
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const uploadFile = async (file: File, folderType: 'videos' | 'thumbnails'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', folderType);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || `Failed to upload ${folderType}`);
    }
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalUrl = url;
    let finalThumbnail = thumbnail;

    try {
      if (type === 'CLOUD') {
        if (videoFile) {
          finalUrl = await uploadFile(videoFile, 'videos');
        } else {
          alert('দয়া করে একটি ভিডিও ফাইল সিলেক্ট করুন।');
          setLoading(false);
          return;
        }
      }
      if (thumbnailFile) {
        finalThumbnail = await uploadFile(thumbnailFile, 'thumbnails');
      }
    } catch (err: any) {
      alert(err.message || 'ফাইল আপলোড ব্যর্থ হয়েছে');
      setLoading(false);
      return;
    }

    const payload = {
      title,
      type,
      url: finalUrl,
      thumbnail: finalThumbnail || undefined,
      isActive
    };

    try {
      const res = await fetch('/api/admin/landing-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchVideos();
        resetForm();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save landing video');
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this landing video?')) return;
    try {
      const res = await fetch(`/api/admin/landing-videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchVideos();
      } else {
        alert('Failed to delete landing video');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetActive = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/landing-videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true })
      });
      if (res.ok) {
        await fetchVideos();
      } else {
        alert('Failed to set active video');
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setType('CLOUD');
    setUrl('');
    setThumbnail('');
    setVideoFile(null);
    setThumbnailFile(null);
    setIsActive(false);
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-bold text-sm">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> লোড হচ্ছে...
      </div>
    );
  }

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-1.5 text-[11px] font-bold text-dark outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:bg-dark-2 dark:text-white";
  const selectClass = "w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-1.5 text-[11px] font-bold text-dark outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:bg-dark-2 dark:text-white cursor-pointer";
  const labelClass = "block text-[10px] font-black tracking-wide uppercase mb-1.5 text-slate-500 dark:text-slate-400";

  return (
    <>
      <div className="mb-6 text-left">
        <h2 className="text-xl font-black text-dark dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-red-500" />
          ল্যান্ডিং পেজ ভিডিও গ্যালারি (Landing Page Video Gallery)
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">এখানে ল্যান্ডিং পেজের ভিডিওগুলো আপলোড করুন এবং যেকোনো একটিকে প্রধান ভিডিও হিসেবে সিলেক্ট করুন।</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left Form Column */}
        <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 sticky top-[88px] max-h-[calc(100vh-110px)] overflow-y-auto custom-scrollbar rounded-3xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-gray-dark text-left">
          <h3 className="text-sm font-black text-dark dark:text-white mb-3 border-b border-slate-100 dark:border-slate-850 pb-2">
            নতুন ল্যান্ডিং ভিডিও যোগ করুন
          </h3>
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass}>ভিডিওর শিরোনাম (Video Title)</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className={inputClass} 
                placeholder="যেমন: Master Class Promo Video" 
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>প্লাটফর্ম (Platform)</label>
                <select value={type} onChange={e => setType(e.target.value)} className={selectClass}>
                  <option value="CLOUD">ডিজিটাল ওশান / ক্লাউড</option>
                  <option value="PCLOUD">My PC Cloud</option>
                  <option value="VIMEO">Vimeo</option>
                  <option value="YOUTUBE">YouTube</option>
                  <option value="GOOGLE_DRIVE">Google Drive</option>
                </select>
              </div>

              <div className="flex items-center pt-5 pl-2">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[10px] text-slate-650 dark:text-slate-300">
                  <input 
                    type="checkbox" 
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-red-500 focus:ring-red-500 cursor-pointer"
                  />
                  <span>সরাসরি একটিভ করুন</span>
                </label>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                {type === 'CLOUD' ? 'ভিডিও ফাইল আপলোড করুন' : 'ভিডিওর লিংক বা আইডি'}
              </label>
              {type === 'CLOUD' ? (
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={e => setVideoFile(e.target.files?.[0] || null)}
                  className={inputClass}
                  required
                />
              ) : (
                <input 
                  type="text" 
                  value={url} 
                  onChange={e => setUrl(e.target.value)} 
                  className={inputClass} 
                  placeholder="যেমন: ইউটিউব/ভিমো ভিডিও লিংক" 
                  required 
                />
              )}
            </div>

            <div>
              <label className={labelClass}>থাম্বনেইল ছবি আপলোড করুন</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                className={inputClass}
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full inline-flex justify-center items-center gap-1.5 rounded-xl bg-primary py-2.5 px-4 font-bold text-white hover:bg-opacity-95 transition-all disabled:opacity-50 text-xs cursor-pointer shadow-xs"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                আপলোড ও সেভ করুন
              </button>
            </div>
          </form>
        </div>

        {/* Right Gallery Column */}
        <div className="flex-1 w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-gray-dark text-left">
          <h3 className="text-sm font-black text-dark dark:text-white mb-3 border-b border-slate-100 dark:border-slate-850 pb-2">
            আপলোডকৃত ল্যান্ডিং ভিডিওসমূহ (Landing Video Gallery)
          </h3>
          
          {videos.length === 0 ? (
            <p className="text-slate-500 text-xs font-semibold py-8">কোনো ল্যান্ডিং ভিডিও আপলোড করা হয়নি। বামে আপলোড করুন।</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {videos.map((video) => (
                <div 
                  key={video.id} 
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-3 flex flex-col justify-between hover:border-slate-350 dark:hover:border-slate-700 transition-all group text-left relative ${
                    video.isActive 
                      ? 'border-[#ff0000] ring-2 ring-red-500/10' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Preview */}
                    <div className="aspect-video relative rounded-lg overflow-hidden select-none shadow-3xs bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {playingVideoId === video.id ? (
                        video.type === 'CLOUD' || video.type === 'PCLOUD' ? (
                          <PcloudVideoPlayer 
                            url={video.url}
                            className="w-full h-full object-contain bg-black"
                          />
                        ) : (
                          <iframe
                            src={
                              video.url.includes("vimeo") || video.type === "VIMEO"
                                ? `https://player.vimeo.com/video/${video.url.replace(/[^0-9]/g, '')}`
                                : video.url.includes("embed")
                                ? video.url
                                : `https://www.youtube.com/embed/${video.url.split("v=")[1]}`
                            }
                            className="w-full h-full object-cover bg-black"
                            allowFullScreen
                            allow="autoplay"
                          />
                        )
                      ) : (
                        <>
                          {video.thumbnail ? (
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative p-4 text-center">
                              <Cloud className="w-8 h-8 text-white/50 mb-2" />
                              <span className="text-white text-[10px] font-black tracking-wider uppercase drop-shadow-sm">{video.title}</span>
                            </div>
                          )}

                          {/* Play Button Overlay */}
                          <div 
                            className="absolute inset-0 bg-slate-950/30 hover:bg-slate-950/40 transition-colors flex items-center justify-center cursor-pointer group/play"
                            onClick={() => setPlayingVideoId(video.id)}
                          >
                            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shadow-md group-hover/play:scale-110 transition-transform">
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            </div>
                          </div>

                          {/* Active indicator */}
                          {video.isActive && (
                            <div className="absolute top-1.5 left-1.5 bg-[#ff0000] text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Active / অ্যাক্টিভ</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug line-clamp-1">{video.title}</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                        Platform: {video.type}
                      </p>
                      <p className="text-[8px] text-slate-450 font-medium line-clamp-1">
                        URL: {video.url}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-850 mt-3 flex items-center justify-between">
                    <div>
                      {!video.isActive ? (
                        <button
                          onClick={() => handleSetActive(video.id)}
                          disabled={loading}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-[9px] font-extrabold text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                        >
                          Active to Landing
                        </button>
                      ) : (
                        <span className="text-[9px] font-black text-[#ff0000] tracking-wide">
                          🔴 CURRENT HOMEPAGE
                        </span>
                      )}
                    </div>
                    <div>
                      <button 
                        onClick={() => handleDelete(video.id)} 
                        disabled={loading}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
