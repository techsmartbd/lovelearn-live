"use client";

import React, { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('header');
  const [reviewBanners, setReviewBanners] = useState<string[]>([]);
  const [uploadingReview, setUploadingReview] = useState(false);

  // Form state
  const [settings, setSettings] = useState<Record<string, string>>({
    WHATSAPP_NUMBER: '8801700000000',
    HERO_HEADLINE: 'Python, Pandas, Numpy এ কি আপনার দুর্বলতা আছে?',
    HERO_SUBHEADLINE: 'Learn Machine Learning through 15+ real-world projects! ১০ জনের মধ্যে ৮ জন স্টুডেন্টই বেসিক শেখার পর আটকে যায়।',
    VIDEO_TEXT: '৯৯% স্টুডেন্ট এই ভুলটি করেন!',
    VIDEO_SUBTEXT: 'ভিডিওটি শেষ পর্যন্ত মনোযোগ দিয়ে দেখুন, স্পেশাল অফার আছে!',
    CTA_SUBTEXT: 'অর্ডার করতে নিচের বাটনে ক্লিক করুন',
    CTA_BUTTON_TEXT: 'অর্ডার করতে চাই',
    PROBLEM_TITLE: 'আপনার বর্তমান স্কিল নিয়ে কি আপনি সত্যিই খুশি?',
    PROBLEM_SUBTITLE: 'দিন দিন কি ক্যারিয়ার নিয়ে হতাশা বাড়ছে? জবের ইন্টারভিউতে আটকে যাচ্ছেন?',
    PROBLEM_POINT_1: 'No idea about Model Deployment?',
    PROBLEM_POINT_2: 'Never worked with real-world datasets?',
    PROBLEM_POINT_3: 'Only know the basics but can\'t build projects?',
    MID_BANNER: 'ক্যারিয়ার গড়তে আজই এনরোল করুন, Machine Learning Course!',
    TESTIMONIALS_TITLE: '৩,২৫০+ স্টুডেন্ট কি বলছে?',
    TESTIMONIALS_SUB: 'আমাদের কোর্স সম্পর্কে স্টুডেন্টদের রিভিউ।',
    OFFER_BADGE: 'আজকের এক্সক্লুসিভ অফার!',
    OFFER_POINT_1: '60+ Premium Video Lessons',
    OFFER_POINT_2: '15+ Real World Project Source Code',
    OFFER_POINT_3: 'Private Support Group Access',
    OFFER_POINT_4: 'Lifetime Access & Updates',
    REGULAR_PRICE: '৫,০০০ টাকা',
    OFFER_PRICE: '৯৯০৳',
    FAQ_TITLE: 'কোর্স সম্পর্কে তথ্য ও জিজ্ঞাসা',
    FAQ_POINT_1: 'কোর্সটি কাদের জন্য?',
    FAQ_POINT_2: 'আমি কি ভিডিওগুলো ডাউনলোড করতে পারব?',
    FAQ_POINT_3: 'পেমেন্ট করার পর কিভাবে এক্সেস পাব?',
    FOOTER_COPYRIGHT: 'Copyright © 2026 | All Rights Reserved by Night Syllabus.',
    BKASH_NUMBER: '01700000000',
    NAGAD_NUMBER: '01800000000',
    META_PIXEL_ID: '',
    GOOGLE_TAG_ID: ''
  });

  useEffect(() => {
    fetchSettings();
    fetchReviewBanners();
  }, []);

  const fetchReviewBanners = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviewBanners(data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadReview = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingReview(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'reviews');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setReviewBanners(prev => [...prev, data.url]);
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload review banner");
    } finally {
      setUploadingReview(false);
      e.target.value = '';
    }
  };

  const fetchSettings = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        // Merge fetched data with default state
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error(e);
    }
    setFetchLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      const reviewsRes = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewBanners)
      });

      if (res.ok && reviewsRes.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings");
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (fetchLoading) return <div className="p-8 text-slate-500 font-medium">Loading settings...</div>;

  const inputClass = "w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary";
  const labelClass = "block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300";

  return (
    <>
      <div className="mb-8">
        <h2 className="text-heading-6 font-bold text-dark dark:text-white">
          Landing Page CMS
        </h2>
        <p className="font-medium text-slate-500">Edit the copy, FAQ, packages, and tracking codes for the landing page.</p>
      </div>

      <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-stroke-dark dark:bg-gray-dark max-w-5xl overflow-hidden">
        <div className="flex border-b border-stroke dark:border-dark-3 bg-gray-2 dark:bg-dark-2 flex-wrap">
          {[
            { id: 'header', label: 'Header & Video' },
            { id: 'problem', label: 'Problem Section' },
            { id: 'offer', label: 'Offer Section' },
            { id: 'misc', label: 'Testimonials, FAQ & Footer' },
            { id: 'reviews', label: 'Review Banners' }
          ].map(tab => (
            <button 
              key={tab.id}
              type="button"
              className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === tab.id ? 'border-b-2 border-primary text-primary bg-white dark:bg-gray-dark' : 'text-slate-500 hover:text-slate-800'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
          
          {activeTab === 'header' && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Hero Headline</label>
                <input type="text" value={settings.HERO_HEADLINE} onChange={e => handleChange('HERO_HEADLINE', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Hero Subheadline</label>
                <textarea value={settings.HERO_SUBHEADLINE} onChange={e => handleChange('HERO_SUBHEADLINE', e.target.value)} className={inputClass} rows={3}></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Video Box Title</label>
                  <input type="text" value={settings.VIDEO_TEXT} onChange={e => handleChange('VIDEO_TEXT', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Video Box Subtitle</label>
                  <input type="text" value={settings.VIDEO_SUBTEXT} onChange={e => handleChange('VIDEO_SUBTEXT', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Call to Action (CTA) Button Text</label>
                  <input type="text" value={settings.CTA_BUTTON_TEXT} onChange={e => handleChange('CTA_BUTTON_TEXT', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>CTA Subtext (Above button)</label>
                  <input type="text" value={settings.CTA_SUBTEXT} onChange={e => handleChange('CTA_SUBTEXT', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'problem' && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Problem Title</label>
                <input type="text" value={settings.PROBLEM_TITLE} onChange={e => handleChange('PROBLEM_TITLE', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Problem Subtitle</label>
                <textarea value={settings.PROBLEM_SUBTITLE} onChange={e => handleChange('PROBLEM_SUBTITLE', e.target.value)} className={inputClass} rows={3}></textarea>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Problem Point 1</label>
                  <input type="text" value={settings.PROBLEM_POINT_1} onChange={e => handleChange('PROBLEM_POINT_1', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Problem Point 2</label>
                  <input type="text" value={settings.PROBLEM_POINT_2} onChange={e => handleChange('PROBLEM_POINT_2', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Problem Point 3</label>
                  <input type="text" value={settings.PROBLEM_POINT_3} onChange={e => handleChange('PROBLEM_POINT_3', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Mid Banner Text</label>
                <input type="text" value={settings.MID_BANNER} onChange={e => handleChange('MID_BANNER', e.target.value)} className={inputClass} />
              </div>
            </div>
          )}

          {activeTab === 'offer' && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Offer Badge</label>
                <input type="text" value={settings.OFFER_BADGE} onChange={e => handleChange('OFFER_BADGE', e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Regular Price</label>
                  <input type="text" value={settings.REGULAR_PRICE} onChange={e => handleChange('REGULAR_PRICE', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Offer Price</label>
                  <input type="text" value={settings.OFFER_PRICE} onChange={e => handleChange('OFFER_PRICE', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Offer Point 1</label>
                  <input type="text" value={settings.OFFER_POINT_1} onChange={e => handleChange('OFFER_POINT_1', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Offer Point 2</label>
                  <input type="text" value={settings.OFFER_POINT_2} onChange={e => handleChange('OFFER_POINT_2', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Offer Point 3</label>
                  <input type="text" value={settings.OFFER_POINT_3} onChange={e => handleChange('OFFER_POINT_3', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Offer Point 4</label>
                  <input type="text" value={settings.OFFER_POINT_4} onChange={e => handleChange('OFFER_POINT_4', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'misc' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Testimonials Title</label>
                  <input type="text" value={settings.TESTIMONIALS_TITLE} onChange={e => handleChange('TESTIMONIALS_TITLE', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Testimonials Subtitle</label>
                  <input type="text" value={settings.TESTIMONIALS_SUB} onChange={e => handleChange('TESTIMONIALS_SUB', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="border-t border-stroke dark:border-dark-3 pt-5">
                <label className={labelClass}>FAQ Title</label>
                <input type="text" value={settings.FAQ_TITLE} onChange={e => handleChange('FAQ_TITLE', e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>FAQ Point 1</label>
                  <input type="text" value={settings.FAQ_POINT_1} onChange={e => handleChange('FAQ_POINT_1', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>FAQ Point 2</label>
                  <input type="text" value={settings.FAQ_POINT_2} onChange={e => handleChange('FAQ_POINT_2', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>FAQ Point 3</label>
                  <input type="text" value={settings.FAQ_POINT_3} onChange={e => handleChange('FAQ_POINT_3', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="border-t border-stroke dark:border-dark-3 pt-5">
                <label className={labelClass}>Footer Copyright Text</label>
                <input type="text" value={settings.FOOTER_COPYRIGHT} onChange={e => handleChange('FOOTER_COPYRIGHT', e.target.value)} className={inputClass} />
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-dark dark:text-white mb-1">Review Banners</h3>
                <p className="text-sm text-slate-500 mb-4">Manage the 5+ user review banners on your landing page. Upload new square banners (they will be automatically rounded and styled with a digital glow).</p>
              </div>

              {/* Upload Zone */}
              <div className="border-2 border-dashed border-slate-300 dark:border-dark-3 rounded-xl p-8 text-center flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/20">
                <input 
                  type="file" 
                  accept="image/*" 
                  id="review-upload-input" 
                  className="hidden" 
                  onChange={handleUploadReview}
                  disabled={uploadingReview}
                />
                <label 
                  htmlFor="review-upload-input"
                  className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 py-3 px-6 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-350 dark:hover:bg-slate-750 transition-all select-none gap-2"
                >
                  {uploadingReview ? "Uploading..." : "Upload New Review Banner"}
                </label>
                <p className="text-xs text-slate-400 mt-2">Format: PNG, JPG, JPEG (Square ratio recommended)</p>
              </div>

              {/* List of current review banners */}
              {reviewBanners.length === 0 ? (
                <p className="text-sm text-slate-500 font-medium text-center py-4">No review banners uploaded yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviewBanners.map((banner, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 border border-stroke dark:border-dark-3 rounded-xl justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-sm text-slate-400 w-8">#{index + 1}</span>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-black border border-stroke dark:border-stroke-dark relative">
                          <img src={banner} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 truncate max-w-[200px] sm:max-w-xs">{banner}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => {
                            if (index === 0) return;
                            const updated = [...reviewBanners];
                            const temp = updated[index];
                            updated[index] = updated[index - 1];
                            updated[index - 1] = temp;
                            setReviewBanners(updated);
                          }}
                          disabled={index === 0}
                          className="p-2 border border-stroke dark:border-dark-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-600 dark:text-slate-400 cursor-pointer"
                        >
                          ↑
                        </button>
                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => {
                            if (index === reviewBanners.length - 1) return;
                            const updated = [...reviewBanners];
                            const temp = updated[index];
                            updated[index] = updated[index + 1];
                            updated[index + 1] = temp;
                            setReviewBanners(updated);
                          }}
                          disabled={index === reviewBanners.length - 1}
                          className="p-2 border border-stroke dark:border-dark-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-600 dark:text-slate-400 cursor-pointer"
                        >
                          ↓
                        </button>
                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = reviewBanners.filter((_, i) => i !== index);
                            setReviewBanners(updated);
                          }}
                          className="p-2 border border-red-200 dark:border-red-950 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          <div className="pt-6 border-t border-stroke dark:border-dark-3 flex justify-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="inline-flex justify-center rounded-lg bg-primary py-3 px-8 font-semibold text-white hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save All Settings"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
