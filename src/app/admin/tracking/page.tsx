"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, Trash2, ShieldCheck } from 'lucide-react';

export default function AdminTrackingPage() {
  const [fetchLoading, setFetchLoading] = useState(true);

  // Password visibility states
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [showGoogleSecret, setShowGoogleSecret] = useState(false);

  // Section saving states
  const [savingMeta, setSavingMeta] = useState(false);
  const [savingGoogle, setSavingGoogle] = useState(false);
  const [savingCustom, setSavingCustom] = useState(false);

  // Section removing states
  const [removingMeta, setRemovingMeta] = useState(false);
  const [removingGoogle, setRemovingGoogle] = useState(false);
  const [removingCustom, setRemovingCustom] = useState(false);

  // Settings states
  const [metaPixelId, setMetaPixelId] = useState('');
  const [metaAccessToken, setMetaAccessToken] = useState('');
  const [googleTagId, setGoogleTagId] = useState('');
  const [googleMeasurementSecret, setGoogleMeasurementSecret] = useState('');
  const [customHeader, setCustomHeader] = useState('');
  const [customFooter, setCustomFooter] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setMetaPixelId(data.META_PIXEL_ID || '');
        setMetaAccessToken(data.META_ACCESS_TOKEN || '');
        setGoogleTagId(data.GOOGLE_TAG_ID || '');
        setGoogleMeasurementSecret(data.GOOGLE_MEASUREMENT_API_SECRET || '');
        setCustomHeader(data.CUSTOM_SCRIPT_HEADER || '');
        setCustomFooter(data.CUSTOM_SCRIPT_FOOTER || '');
      }
    } catch (e) {
      console.error("Failed to load tracking settings", e);
    } finally {
      setFetchLoading(false);
    }
  };

  const saveSection = async (
    payload: Record<string, string>,
    setSaving: (loading: boolean) => void,
    sectionName: string
  ) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(`${sectionName} কনফিগারেশন সফলভাবে সেভ করা হয়েছে!`);
      } else {
        alert("সংরক্ষণ করতে ব্যর্থ হয়েছে।");
      }
    } catch (e) {
      console.error(e);
      alert("ত্রুটি ঘটেছে।");
    } finally {
      setSaving(false);
    }
  };

  const removeSection = async (
    keys: string[],
    clearCallbacks: (() => void)[],
    setRemoving: (loading: boolean) => void,
    sectionName: string
  ) => {
    const isConfirmed = window.confirm(`আপনি কি নিশ্চিত যে এই ${sectionName} কনফিগারেশনটি মুছে ফেলতে চান?`);
    if (!isConfirmed) return;

    setRemoving(true);
    try {
      // Create payload with empty values to clear settings in DB
      const payload = keys.reduce((acc, curr) => {
        acc[curr] = '';
        return acc;
      }, {} as Record<string, string>);

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        clearCallbacks.forEach(cb => cb());
        alert(`${sectionName} কনফিগারেশন মুছে ফেলা হয়েছে!`);
      } else {
        alert("মুছে ফেলতে ব্যর্থ হয়েছে।");
      }
    } catch (e) {
      console.error(e);
      alert("ত্রুটি ঘটেছে।");
    } finally {
      setRemoving(false);
    }
  };

  if (fetchLoading) return <div className="p-8 text-slate-500 font-medium">Loading tracking configs...</div>;

  const inputClass = "w-full rounded-xl border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-stroke-dark dark:bg-dark-2 dark:text-white dark:focus:border-primary text-sm font-semibold";
  const textareaClass = "w-full rounded-xl border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark font-mono outline-none transition focus:border-primary active:border-primary dark:border-stroke-dark dark:bg-dark-2 dark:text-white dark:focus:border-primary text-xs";
  const labelClass = "block text-xs font-bold mb-2 text-slate-700 dark:text-slate-300";

  return (
    <>
      <div className="mb-8 text-left">
        <h2 className="text-heading-6 font-bold text-dark dark:text-white">
          Tracking System Settings
        </h2>
        <p className="font-medium text-slate-500 text-xs mt-1">Configure Meta Pixel, Google Analytics, and custom header/footer tracking script integrations.</p>
      </div>

      <div className="space-y-6 max-w-5xl text-left">
        
        {/* Meta Section */}
        <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-stroke-dark dark:bg-gray-dark p-6 space-y-4">
          <div className="border-b border-stroke dark:border-stroke-dark pb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h3 className="font-extrabold text-sm text-dark dark:text-white">Meta (Facebook) Pixel & Conversion API</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4">
              <label className={labelClass}>Meta Pixel ID</label>
              <input 
                type="text" 
                placeholder="যেমন: 123456789012345" 
                value={metaPixelId} 
                onChange={e => setMetaPixelId(e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div className="md:col-span-8">
              <label className={labelClass}>Meta Conversions API Access Token</label>
              <div className="relative">
                <input 
                  type={showMetaToken ? "text" : "password"} 
                  placeholder="EAA..." 
                  value={metaAccessToken} 
                  onChange={e => setMetaAccessToken(e.target.value)} 
                  className={inputClass} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowMetaToken(!showMetaToken)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showMetaToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-4 flex-wrap gap-3">
            <p className="text-[10px] text-slate-400 font-semibold leading-normal max-w-xl">
              সার্ভার-সাইড পিক্সেল ট্র্যাকিং (Conversion API) সফল করার জন্য আপনার মেটা ইভেন্ট ম্যানেজার থেকে জেনারেট করা এক্সেস টোকেনটি এখানে পেস্ট করুন।
            </p>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => removeSection(
                  ['META_PIXEL_ID', 'META_ACCESS_TOKEN'], 
                  [() => setMetaPixelId(''), () => setMetaAccessToken('')], 
                  setRemovingMeta, 
                  'মেটা পিক্সেল'
                )}
                disabled={removingMeta || (!metaPixelId && !metaAccessToken)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2.5 px-5 font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> {removingMeta ? "মুছা হচ্ছে..." : "Remove"}
              </button>
              <button 
                type="button"
                onClick={() => saveSection({ META_PIXEL_ID: metaPixelId, META_ACCESS_TOKEN: metaAccessToken }, setSavingMeta, 'মেটা পিক্সেল')}
                disabled={savingMeta}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-opacity-90 text-white py-2.5 px-6 font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> {savingMeta ? "সেভ হচ্ছে..." : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* Google Analytics Section */}
        <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-stroke-dark dark:bg-gray-dark p-6 space-y-4">
          <div className="border-b border-stroke dark:border-stroke-dark pb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="font-extrabold text-sm text-dark dark:text-white">Google Analytics (G4) & Tag Manager</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4">
              <label className={labelClass}>Measurement ID / GTM ID</label>
              <input 
                type="text" 
                placeholder="যেমন: G-XXXXXXXXXX অথবা GTM-XXXXXXX" 
                value={googleTagId} 
                onChange={e => setGoogleTagId(e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div className="md:col-span-8">
              <label className={labelClass}>Measurement Protocol API Secret</label>
              <div className="relative">
                <input 
                  type={showGoogleSecret ? "text" : "password"} 
                  placeholder="Google Measurement API Secret Key" 
                  value={googleMeasurementSecret} 
                  onChange={e => setGoogleMeasurementSecret(e.target.value)} 
                  className={inputClass} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowGoogleSecret(!showGoogleSecret)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showGoogleSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-4 flex-wrap gap-3">
            <p className="text-[10px] text-slate-400 font-semibold leading-normal max-w-xl">
              গুগল মেজারমেন্ট প্রোটোকলের মাধ্যমে সার্ভার সাইড পেমেন্ট ট্র্যাকিং সক্রিয় করতে আপনার অ্যানালিটিক্স এডমিন প্যানেল থেকে এপিআই সিক্রেট কী বসান।
            </p>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => removeSection(
                  ['GOOGLE_TAG_ID', 'GOOGLE_MEASUREMENT_API_SECRET'], 
                  [() => setGoogleTagId(''), () => setGoogleMeasurementSecret('')], 
                  setRemovingGoogle, 
                  'গুগল অ্যানালিটিক্স'
                )}
                disabled={removingGoogle || (!googleTagId && !googleMeasurementSecret)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2.5 px-5 font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> {removingGoogle ? "মুছা হচ্ছে..." : "Remove"}
              </button>
              <button 
                type="button"
                onClick={() => saveSection({ GOOGLE_TAG_ID: googleTagId, GOOGLE_MEASUREMENT_API_SECRET: googleMeasurementSecret }, setSavingGoogle, 'গুগল অ্যানালিটিক্স')}
                disabled={savingGoogle}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-opacity-90 text-white py-2.5 px-6 font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> {savingGoogle ? "সেভ হচ্ছে..." : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* Custom Script Integrations */}
        <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-stroke-dark dark:bg-gray-dark p-6 space-y-5">
          <div className="border-b border-stroke dark:border-stroke-dark pb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <h3 className="font-extrabold text-sm text-dark dark:text-white">Custom Script Integrations</h3>
          </div>

          <div>
            <label className={labelClass}>Header Scripts (Injected inside &lt;head&gt;)</label>
            <textarea 
              rows={4} 
              placeholder="<!-- Paste your custom pixel/analytics header script code here -->" 
              value={customHeader} 
              onChange={e => setCustomHeader(e.target.value)} 
              className={textareaClass}
            />
          </div>

          <div>
            <label className={labelClass}>Footer Scripts (Injected before &lt;/body&gt;)</label>
            <textarea 
              rows={4} 
              placeholder="<!-- Paste your custom footer script code here -->" 
              value={customFooter} 
              onChange={e => setCustomFooter(e.target.value)} 
              className={textareaClass}
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-4 flex-wrap gap-3">
            <p className="text-[10px] text-slate-400 font-semibold leading-normal max-w-xl">
              এখানে কাস্টম HTML স্ক্রিপ্ট ট্যাগ ইনজেকশন কনফিগারেশন সেভ করতে পারবেন।
            </p>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => removeSection(
                  ['CUSTOM_SCRIPT_HEADER', 'CUSTOM_SCRIPT_FOOTER'], 
                  [() => setCustomHeader(''), () => setCustomFooter('')], 
                  setRemovingCustom, 
                  'কাস্টম স্ক্রিপ্ট'
                )}
                disabled={removingCustom || (!customHeader && !customFooter)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2.5 px-5 font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> {removingCustom ? "মুছা হচ্ছে..." : "Remove"}
              </button>
              <button 
                type="button"
                onClick={() => saveSection({ CUSTOM_SCRIPT_HEADER: customHeader, CUSTOM_SCRIPT_FOOTER: customFooter }, setSavingCustom, 'কাস্টম স্ক্রিপ্ট')}
                disabled={savingCustom}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-opacity-90 text-white py-2.5 px-6 font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> {savingCustom ? "সেভ হচ্ছে..." : "Save"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
