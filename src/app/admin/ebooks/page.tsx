"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Lock, Edit2, Trash2, Loader2, Sparkles, FileText } from 'lucide-react';

type Ebook = {
  id: string;
  title: string;
  description?: string;
  pdfUrl: string;
  thumbnail?: string;
  packageId?: string;
  isPremium: boolean;
};

type Package = {
  id: string;
  title: string;
};

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openingEbookId, setOpeningEbookId] = useState<string | null>(null);

  const handleReadEbook = async (ebook: Ebook) => {
    try {
      setOpeningEbookId(ebook.id);
      
      if (ebook.pdfUrl && ebook.pdfUrl.includes("code=")) {
        const codeMatch = ebook.pdfUrl.match(/code=([^&]+)/);
        if (codeMatch) {
          const code = codeMatch[1];
          const res = await fetch(`https://api.pcloud.com/getpublinkdownload?code=${code}`, {
            referrerPolicy: "no-referrer"
          });
          const data = await res.json();
          if (data.result === 0 && data.hosts?.length > 0 && data.path) {
            window.open(`https://${data.hosts[0]}${data.path}`, '_blank');
            return;
          }
        }
      }
      
      if (ebook.pdfUrl) {
        window.open(ebook.pdfUrl, '_blank');
      }
    } catch (err) {
      console.error("Error opening ebook:", err);
      alert("বইটি খুলতে সমস্যা হচ্ছে।");
    } finally {
      setOpeningEbookId(null);
    }
  };
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [sourceType, setSourceType] = useState('UPLOAD');
  const [thumbnail, setThumbnail] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [packageId, setPackageId] = useState('');
  const [isPremium, setIsPremium] = useState(true);

  useEffect(() => {
    Promise.all([fetchEbooks(), fetchPackages()]).finally(() => {
      setFetchLoading(false);
    });
  }, []);

  const fetchEbooks = async () => {
    try {
      const res = await fetch('/api/admin/ebooks');
      if (res.ok) {
        const data = await res.json();
        setEbooks(data);
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

  const uploadFile = async (file: File, folderType: 'ebooks' | 'thumbnails'): Promise<string> => {
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

    let finalPdfUrl = pdfUrl;
    let finalThumbnail = thumbnail;

    try {
      if (sourceType === 'UPLOAD') {
        if (pdfFile) {
          finalPdfUrl = await uploadFile(pdfFile, 'ebooks');
        } else if (!editingId) {
          alert('দয়া করে একটি ই-বুক পিডিএফ ফাইল সিলেক্ট করুন।');
          setLoading(false);
          return;
        }
      } else {
        if (!pdfUrl) {
          alert('দয়া করে pCloud লিংটি দিন।');
          setLoading(false);
          return;
        }
        finalPdfUrl = pdfUrl;
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
      pdfUrl: finalPdfUrl,
      thumbnail: finalThumbnail || undefined,
      packageId: packageId || undefined,
      isPremium
    };

    const endpoint = editingId ? `/api/admin/ebooks/${editingId}` : '/api/admin/ebooks';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchEbooks();
        resetForm();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save ebook');
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ebook?')) return;
    try {
      const res = await fetch(`/api/admin/ebooks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchEbooks();
      } else {
        alert('Failed to delete ebook');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (ebook: Ebook) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(ebook.id);
    setTitle(ebook.title);
    setDescription(ebook.description || '');
    setPdfUrl(ebook.pdfUrl);
    setSourceType(ebook.pdfUrl.includes('pcloud') ? 'PCLOUD' : 'UPLOAD');
    setThumbnail(ebook.thumbnail || '');
    setPackageId(ebook.packageId || '');
    setIsPremium(ebook.isPremium);
  };

  const resetForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPdfUrl('');
    setSourceType('UPLOAD');
    setThumbnail('');
    setPdfFile(null);
    setThumbnailFile(null);
    setPackageId('');
    setIsPremium(true);
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-bold text-sm">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> লোড হচ্ছে...
      </div>
    );
  }

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-slate-885 bg-transparent px-3 py-1.5 text-[11px] font-bold text-dark outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:bg-dark-2 dark:text-white";
  const selectClass = "w-full rounded-xl border border-slate-200 dark:border-slate-885 bg-transparent px-3 py-1.5 text-[11px] font-bold text-dark outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:bg-dark-2 dark:text-white cursor-pointer";
  const labelClass = "block text-[10px] font-black tracking-wide uppercase mb-1.5 text-slate-500 dark:text-slate-400";

  return (
    <>
      <div className="mb-6 text-left">
        <h2 className="text-xl font-black text-dark dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-red-500" />
          ই-বুক ম্যানেজমেন্ট (E-Books List)
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">এখানে পিডিএফ রিসোর্স এবং ই-বুকগুলো যোগ, এডিট অথবা ডিলিট করুন।</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left Form Column */}
        <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 sticky top-[88px] max-h-[calc(100vh-110px)] overflow-y-auto custom-scrollbar rounded-3xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-gray-dark text-left">
          <h3 className="text-sm font-black text-dark dark:text-white mb-3 border-b border-slate-100 dark:border-slate-850 pb-2">
            {editingId ? 'ই-বুক এডিট করুন' : 'নতুন ই-বুক যোগ করুন'}
          </h3>
          <form className="space-y-2.5" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass}>ই-বুকের শিরোনাম (Ebook Title)</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className={inputClass} 
                placeholder="যেমন: মাস্টার সেলিং গাইডবুক" 
                required
              />
            </div>

            <div>
              <label className={labelClass}>সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className={inputClass} 
                placeholder="যেমন: এই বইটি বিক্রির কলাকৌশল শেখাবে..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>অ্যাক্সেস টাইপ</label>
                <select value={isPremium ? 'true' : 'false'} onChange={e => setIsPremium(e.target.value === 'true')} className={selectClass}>
                  <option value="true">Premium (Locked)</option>
                  <option value="false">Free (Unlocked)</option>
                </select>
              </div>

              {isPremium && (
                <div>
                  <label className={labelClass}>কোর্স প্যাকেজ</label>
                  <select value={packageId} onChange={e => setPackageId(e.target.value)} className={selectClass} required={isPremium}>
                    <option value="">প্যাকেজ নির্বাচন করুন</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>পিডিএফ সোর্স (Source)</label>
                <select value={sourceType} onChange={e => setSourceType(e.target.value)} className={selectClass}>
                  <option value="UPLOAD">ফাইল আপলোড</option>
                  <option value="PCLOUD">My PC Cloud লিংক</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                {sourceType === 'UPLOAD' ? 'ই-বুক পিডিএফ ফাইল আপলোড' : 'pCloud ডিরেক্ট লিংক'}
              </label>
              {sourceType === 'UPLOAD' ? (
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={e => setPdfFile(e.target.files?.[0] || null)}
                  className={inputClass}
                  required={!editingId}
                />
              ) : (
                <input 
                  type="text" 
                  value={pdfUrl}
                  onChange={e => setPdfUrl(e.target.value)}
                  placeholder="https://my.pcloud.com/..."
                  className={inputClass}
                  required
                />
              )}
              {editingId && (
                <p className="text-[9px] text-slate-500 mt-1">
                  বর্তমান ফাইল/লিংক: <span className="font-semibold break-all">{pdfUrl}</span>
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>কভার ফটো / থাম্বনেইল ছবি</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                className={inputClass}
              />
              {thumbnail && (
                <p className="text-[9px] text-slate-500 mt-1">
                  বর্তমান কভার: <span className="font-semibold break-all">{thumbnail}</span>
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
                {editingId ? 'আপডেট করুন' : 'ই-বুক যোগ করুন'}
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
            অ্যাক্টিভ ই-বুক রিসোর্সসমূহ (Active E-Books)
          </h3>
          
          {ebooks.length === 0 ? (
            <p className="text-slate-500 text-xs font-semibold py-8">কোনো ই-বুক পাওয়া যায়নি। বামে নতুন ই-বুক যোগ করুন।</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {ebooks.map((ebook) => (
                <div key={ebook.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-350 dark:hover:border-slate-700 transition-all group text-left relative">
                  <div className="space-y-2.5">
                    {/* Cover Preview */}
                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden select-none shadow-3xs bg-slate-100 dark:bg-slate-800">
                      {ebook.thumbnail ? (
                        <img src={ebook.thumbnail} alt={ebook.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center relative p-4 text-center">
                          <FileText className="w-8 h-8 text-white/80 mb-2" />
                          <span className="text-white text-[10px] font-black tracking-wider uppercase drop-shadow-sm">{ebook.title}</span>
                        </div>
                      )}

                      {/* Locked Overlay / PDF indicator */}
                      <div 
                        className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        onClick={() => handleReadEbook(ebook)}
                      >
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                          {openingEbookId === ebook.id ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>

                      {ebook.isPremium ? (
                        <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white px-1.5 py-0.5 rounded text-[7px] font-bold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </div>
                      ) : (
                        <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white px-1.5 py-0.5 rounded text-[7px] font-bold">
                          Free / Unlocked
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug line-clamp-1">{ebook.title}</h4>
                      {ebook.description && (
                        <p className="text-[9px] text-slate-500 font-bold line-clamp-2">{ebook.description}</p>
                      )}
                      <p className="text-[8px] text-slate-450 font-medium line-clamp-1 mt-1">
                        URL/PDF: {ebook.pdfUrl}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-850 mt-3 flex items-center justify-between">
                    <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wide">
                      {ebook.isPremium ? 'Premium' : 'Free'}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(ebook)} 
                        className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 transition-colors"
                        title="এডিট করুন"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(ebook.id)} 
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
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
