"use client";

import React, { useState, useEffect } from 'react';
import { Play, Lock, Edit2, Trash2, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import PcloudVideoPlayer from '@/components/PcloudVideoPlayer';

type Video = {
  id: string;
  title: string;
  description?: string;
  type: string;
  url: string;
  thumbnail?: string;
  packageId?: string;
  isPremium: boolean;
  isActive: boolean;
};

type Package = {
  id: string;
  title: string;
};

export default function AdminTutorialVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  
  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('CLOUD');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [packageId, setPackageId] = useState('');
  const [isPremium, setIsPremium] = useState(true);
  const [isActive, setIsActive] = useState(true);
  
  // Course states
  const [courses, setCourses] = useState<{id: string; title: string; _count?: {videos: number}}[]>([]);
  const [courseId, setCourseId] = useState('');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState('');
  const [courseThumbnailFile, setCourseThumbnailFile] = useState<File | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseLoading, setCourseLoading] = useState(false);
  const [coursePackageId, setCoursePackageId] = useState('');

  useEffect(() => {
    Promise.all([fetchVideos(), fetchPackages(), fetchCourses()]).finally(() => {
      setFetchLoading(false);
    });
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/videos');
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/packages');
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
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
        } else if (!editingId) {
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
      description: description || undefined,
      type, 
      url: finalUrl, 
      thumbnail: finalThumbnail || undefined,
      packageId: packageId || undefined,
      courseId: courseId || undefined,
      isPremium,
      isActive
    };
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
        const data = await res.json();
        alert(data.error || "Failed to save video");
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(video.id);
    setTitle(video.title);
    setDescription(video.description || '');
    setType(video.type);
    setUrl(video.url);
    setThumbnail(video.thumbnail || '');
    setPackageId(video.packageId || '');
    setCourseId((video as any).courseId || '');
    setIsPremium(video.isPremium);
    setIsActive(video.isActive !== undefined ? video.isActive : true);
  };

  const resetForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(null);
    setTitle('');
    setDescription('');
    setType('CLOUD');
    setUrl('');
    setThumbnail('');
    setThumbnailFile(null);
    setVideoFile(null);
    setPackageId('');
    setCourseId('');
    setIsPremium(true);
    setIsActive(true);
  };

  const resetCourseForm = () => {
    setCourseTitle('');
    setCourseDescription('');
    setCourseThumbnail('');
    setCourseThumbnailFile(null);
    setCoursePackageId('');
    setEditingCourseId(null);
    setShowCourseForm(false);
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCourseLoading(true);

    let finalThumbnail = courseThumbnail;
    if (courseThumbnailFile) {
      try {
        finalThumbnail = await uploadFile(courseThumbnailFile, 'thumbnails');
      } catch (err: any) {
        alert(err.message || 'Failed to upload thumbnail');
        setCourseLoading(false);
        return;
      }
    }

    const payload = {
      title: courseTitle,
      description: courseDescription || undefined,
      thumbnail: finalThumbnail || undefined,
      packageId: coursePackageId || undefined,
      isActive: true
    };

    const endpoint = editingCourseId ? `/api/admin/courses/${editingCourseId}` : '/api/admin/courses';
    const method = editingCourseId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchCourses();
        resetCourseForm();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save course');
      }
    } catch (e) {
      console.error(e);
    }
    setCourseLoading(false);
  };

  const handleEditCourse = (course: any) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCourseDescription(course.description || '');
    setCourseThumbnail(course.thumbnail || '');
    setCoursePackageId(course.packageId || '');
    setShowCourseForm(true);
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure? Videos will be unassigned but not deleted.')) return;
    try {
      await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      await fetchCourses();
    } catch (e) {
      console.error(e);
    }
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
          টিউটোরিয়াল ভিডিও ম্যানেজমেন্ট (Course Curriculum)
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">এখানে স্টুডেন্ট ড্যাশবোর্ডের কারিকুলাম ভিডিওগুলো যোগ, এডিট অথবা ডিলিট করুন।</p>
      </div>

      {/* Course Management Section */}
      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-gray-dark text-left">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-dark dark:text-white">কোর্স/গ্রুপ ম্যানেজমেন্ট</h3>
          <button
            onClick={() => { resetCourseForm(); setShowCourseForm(!showCourseForm); }}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-[11px] font-bold cursor-pointer"
          >
            {showCourseForm ? 'বন্ধ করুন' : '+ নতুন কোর্স তৈরি করুন'}
          </button>
        </div>

        {showCourseForm && (
          <form onSubmit={handleCourseSubmit} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-4 space-y-3">
            <div>
              <label className={labelClass}>কোর্সের নাম *</label>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className={inputClass}
                placeholder="যেমন: মাস্টার লাভার্স কোর্স"
                required
              />
            </div>
            <div>
              <label className={labelClass}>বিবরণ</label>
              <input
                type="text"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                className={inputClass}
                placeholder="কোর্সের সংক্ষিপ্ত বিবরণ"
              />
            </div>
            <div>
              <label className={labelClass}>থাম্বনেইল</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCourseThumbnailFile(e.target.files?.[0] || null)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>কোর্স প্যাকেজ (ঐচ্ছিক)</label>
              <select value={coursePackageId} onChange={(e) => setCoursePackageId(e.target.value)} className={selectClass}>
                <option value="">প্যাকেজ নির্বাচন করুন</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={courseLoading}
                className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-xl bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-700 transition-all disabled:opacity-50 text-[11px] cursor-pointer"
              >
                {courseLoading ? 'সেভ হচ্ছে...' : editingCourseId ? 'আপডেট করুন' : 'তৈরি করুন'}
              </button>
              {editingCourseId && (
                <button
                  type="button"
                  onClick={resetCourseForm}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all text-[11px] font-bold cursor-pointer"
                >
                  বাতিল
                </button>
              )}
            </div>
          </form>
        )}

        {/* Courses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {courses.map((course) => (
            <div key={course.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-dark dark:text-white">{course.title}</p>
                <p className="text-[10px] text-slate-500">{course._count?.videos || 0}টি ভিডিও</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditCourse(course)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="text-slate-500 text-[11px] font-semibold col-span-full py-2">এখনো কোনো কোর্স তৈরি হয়নি</p>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left Form Column */}
        <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 sticky top-[88px] max-h-[calc(100vh-110px)] overflow-y-auto custom-scrollbar rounded-3xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-gray-dark text-left">
          <h3 className="text-sm font-black text-dark dark:text-white mb-3 border-b border-slate-100 dark:border-slate-850 pb-2">
            {editingId ? "টিউটোরিয়াল এডিট করুন" : "নতুন টিউটোরিয়াল যোগ করুন"}
          </h3>
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass}>ভিডিওর শিরোনাম (Video Title)</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className={inputClass} 
                placeholder="যেমন: TypeScript Masterclass" 
                required
              />
            </div>
            
            <div>
              <label className={labelClass}>ডেসক্রিপশন (হালকা)</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className={inputClass} 
                placeholder="ভিডিও সম্পর্কে ছোট বিবরণ..." 
                rows={2}
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
              <div>
                <label className={labelClass}>ভিডিও অ্যাক্সেস টাইপ</label>
                <select value={isPremium ? "true" : "false"} onChange={e => setIsPremium(e.target.value === "true")} className={selectClass}>
                  <option value="true">Premium (Locked)</option>
                  <option value="false">Free (Unlocked)</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>ড্যাশবোর্ডে স্ট্যাটাস</label>
              <select value={isActive ? "true" : "false"} onChange={e => setIsActive(e.target.value === "true")} className={selectClass}>
                <option value="true">Show on Dashboard (Active)</option>
                <option value="false">Hide from Dashboard (Inactive)</option>
              </select>
            </div>

            {isPremium && (
              <div>
                <label className={labelClass}>আনলক করার জন্য কোর্স প্যাকেজ</label>
                <select value={packageId} onChange={e => setPackageId(e.target.value)} className={selectClass} required={isPremium}>
                  <option value="">কোর্স প্যাকেজ নির্বাচন করুন</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className={labelClass}>কোর্স/গ্রুপ (ঐচ্ছিক)</label>
              <select value={courseId} onChange={e => setCourseId(e.target.value)} className={selectClass}>
                <option value="">কোর্স সিলেক্ট করুন</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
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
                  required={!editingId}
                />
              ) : (
                <input 
                  type="text" 
                  value={url} 
                  onChange={e => setUrl(e.target.value)} 
                  className={inputClass} 
                  placeholder="ভিডিও লিংক (ইউটিউব/ভিমো)"
                  required 
                />
              )}
              {editingId && type === 'CLOUD' && (
                <p className="text-[9px] text-slate-500 mt-1">
                  বর্তমান ফাইল: <span className="font-semibold break-all">{url}</span>
                </p>
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
              {thumbnail && (
                <p className="text-[9px] text-slate-500 mt-1">
                  বর্তমান থাম্বনেইল: <span className="font-semibold break-all">{thumbnail}</span>
                </p>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-xl bg-primary py-2.5 px-4 font-bold text-white hover:bg-opacity-95 transition-all disabled:opacity-50 text-xs cursor-pointer shadow-xs"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editingId ? "আপডেট করুন" : "টিউটোরিয়াল যোগ করুন"}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all dark:bg-dark-3 dark:text-white font-bold text-xs cursor-pointer"
                >
                  বাতিল
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Preview Grid Column */}
        <div className="flex-1 w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-gray-dark text-left">
          <h3 className="text-sm font-black text-dark dark:text-white mb-3 border-b border-slate-100 dark:border-slate-850 pb-2">
            অ্যাক্টিভ কারিকুলাম ভিডিওসমূহ (Active Curriculum Videos)
          </h3>
          
          {videos.length === 0 ? (
            <p className="text-slate-500 text-xs font-semibold py-8">কোনো ভিডিও খুঁজে পাওয়া যায়নি। বামে নতুন ভিডিও অ্যাড করুন।</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {videos.map((video) => (
                <div key={video.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-350 dark:hover:border-slate-700 transition-all group text-left relative">
                  <div className="space-y-2.5">
                    {/* Thumbnail Preview or Video Player */}
                    <div className="aspect-[16/10] relative rounded-lg overflow-hidden select-none shadow-3xs bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {playingVideoId === video.id ? (
                        video.type === "CLOUD" || video.type === "PCLOUD" ? (
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
                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                              <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">No Thumbnail</span>
                            </div>
                          )}

                          {/* Locked Overlay / Play Button */}
                          <div 
                            className="absolute inset-0 bg-slate-950/30 hover:bg-slate-950/40 transition-colors flex items-center justify-center cursor-pointer group/play"
                            onClick={() => setPlayingVideoId(video.id)}
                          >
                            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shadow-md group-hover/play:scale-110 transition-transform">
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug line-clamp-1">{video.title}</h4>
                      {video.description && (
                        <p className="text-[9px] text-slate-500 font-medium line-clamp-1">{video.description}</p>
                      )}
                      <p className="text-[8px] text-slate-400 font-medium line-clamp-1 mt-1">
                        URL: {video.url}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-850 mt-3 flex items-center justify-end">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(video)} 
                        className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 transition-colors cursor-pointer"
                        title="এডিট করুন"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(video.id)} 
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
