"use client";

import React, { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('header');

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
    NAGAD_NUMBER: '01800000000'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

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
      if (res.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings");
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
        <h1 className="text-2xl font-bold text-slate-800">Landing Page CMS</h1>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-5xl overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50 flex-wrap">
          {[
            { id: 'header', label: 'Header & Video' },
            { id: 'problem', label: 'Problem Section' },
            { id: 'offer', label: 'Offer Section' },
            { id: 'misc', label: 'Testimonials, FAQ & Footer' },
            { id: 'contact', label: 'Contact' },
            { id: 'payment', label: 'Payment Gateways' }
          ].map(tab => (
            <button 
              key={tab.id}
              type="button"
              className={`px-6 py-3 font-semibold text-sm ${activeTab === tab.id ? 'border-b-2 border-red-500 text-red-600 bg-white' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          
          {activeTab === 'header' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Hero Headline</label>
                <input type="text" value={settings.HERO_HEADLINE} onChange={e => handleChange('HERO_HEADLINE', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Hero Subheadline</label>
                <textarea value={settings.HERO_SUBHEADLINE} onChange={e => handleChange('HERO_SUBHEADLINE', e.target.value)} className="w-full px-3 py-2 border rounded-md" rows={2}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Video Box Title</label>
                  <input type="text" value={settings.VIDEO_TEXT} onChange={e => handleChange('VIDEO_TEXT', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Video Box Subtitle</label>
                  <input type="text" value={settings.VIDEO_SUBTEXT} onChange={e => handleChange('VIDEO_SUBTEXT', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Call to Action (CTA) Button Text</label>
                  <input type="text" value={settings.CTA_BUTTON_TEXT} onChange={e => handleChange('CTA_BUTTON_TEXT', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">CTA Subtext (Above button)</label>
                  <input type="text" value={settings.CTA_SUBTEXT} onChange={e => handleChange('CTA_SUBTEXT', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'problem' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Problem Title</label>
                <input type="text" value={settings.PROBLEM_TITLE} onChange={e => handleChange('PROBLEM_TITLE', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Problem Subtitle</label>
                <textarea value={settings.PROBLEM_SUBTITLE} onChange={e => handleChange('PROBLEM_SUBTITLE', e.target.value)} className="w-full px-3 py-2 border rounded-md" rows={2}></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Problem Point 1</label>
                <input type="text" value={settings.PROBLEM_POINT_1} onChange={e => handleChange('PROBLEM_POINT_1', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Problem Point 2</label>
                <input type="text" value={settings.PROBLEM_POINT_2} onChange={e => handleChange('PROBLEM_POINT_2', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Problem Point 3</label>
                <input type="text" value={settings.PROBLEM_POINT_3} onChange={e => handleChange('PROBLEM_POINT_3', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Mid Banner Text</label>
                <input type="text" value={settings.MID_BANNER} onChange={e => handleChange('MID_BANNER', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
          )}

          {activeTab === 'offer' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Offer Badge</label>
                <input type="text" value={settings.OFFER_BADGE} onChange={e => handleChange('OFFER_BADGE', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Regular Price</label>
                  <input type="text" value={settings.REGULAR_PRICE} onChange={e => handleChange('REGULAR_PRICE', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Offer Price</label>
                  <input type="text" value={settings.OFFER_PRICE} onChange={e => handleChange('OFFER_PRICE', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Offer Point 1</label>
                <input type="text" value={settings.OFFER_POINT_1} onChange={e => handleChange('OFFER_POINT_1', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Offer Point 2</label>
                <input type="text" value={settings.OFFER_POINT_2} onChange={e => handleChange('OFFER_POINT_2', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Offer Point 3</label>
                <input type="text" value={settings.OFFER_POINT_3} onChange={e => handleChange('OFFER_POINT_3', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Offer Point 4</label>
                <input type="text" value={settings.OFFER_POINT_4} onChange={e => handleChange('OFFER_POINT_4', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
          )}

          {activeTab === 'misc' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Testimonials Title</label>
                <input type="text" value={settings.TESTIMONIALS_TITLE} onChange={e => handleChange('TESTIMONIALS_TITLE', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Testimonials Subtitle</label>
                <input type="text" value={settings.TESTIMONIALS_SUB} onChange={e => handleChange('TESTIMONIALS_SUB', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="border-t pt-4">
                <label className="block text-sm font-semibold mb-1">FAQ Title</label>
                <input type="text" value={settings.FAQ_TITLE} onChange={e => handleChange('FAQ_TITLE', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">FAQ Point 1</label>
                <input type="text" value={settings.FAQ_POINT_1} onChange={e => handleChange('FAQ_POINT_1', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">FAQ Point 2</label>
                <input type="text" value={settings.FAQ_POINT_2} onChange={e => handleChange('FAQ_POINT_2', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">FAQ Point 3</label>
                <input type="text" value={settings.FAQ_POINT_3} onChange={e => handleChange('FAQ_POINT_3', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="border-t pt-4">
                <label className="block text-sm font-semibold mb-1">Footer Copyright Text</label>
                <input type="text" value={settings.FOOTER_COPYRIGHT} onChange={e => handleChange('FOOTER_COPYRIGHT', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">WhatsApp Number</label>
                <input type="text" value={settings.WHATSAPP_NUMBER} onChange={e => handleChange('WHATSAPP_NUMBER', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                <p className="text-xs text-gray-500 mt-1">Used for the floating WhatsApp button.</p>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">bKash Personal Number</label>
                <input type="text" value={settings.BKASH_NUMBER} onChange={e => handleChange('BKASH_NUMBER', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                <p className="text-xs text-gray-500 mt-1">This number will be shown to users during checkout for Send Money.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Nagad Personal Number</label>
                <input type="text" value={settings.NAGAD_NUMBER} onChange={e => handleChange('NAGAD_NUMBER', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <button type="submit" disabled={loading} className="bg-[#ff0000] text-white py-2 px-8 rounded-md font-bold hover:bg-[#cc0000] transition-colors">
              {loading ? "Saving..." : "Save All Settings"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
