"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Key, Phone, CreditCard, Activity, Save, Loader2, CheckCircle2, AlertCircle, MessageSquare, Copy, Trash2, RefreshCw, Smartphone, Tag, Plus, Edit2, Check, X, Ticket } from 'lucide-react';

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  // Form states for settings
  const [settings, setSettings] = useState<Record<string, string>>({
    WHATSAPP_NUMBER: '8801700000000',
    BKASH_NUMBER: '01700000000',
    BKASH_TYPE: 'PERSONAL',
    NAGAD_NUMBER: '01800000000',
    NAGAD_TYPE: 'PERSONAL',
    ROCKET_NUMBER: '01900000000',
    ROCKET_TYPE: 'PERSONAL',
    UPAY_NUMBER: '01500000000',
    UPAY_TYPE: 'PERSONAL',
    META_PIXEL_ID: '',
    GOOGLE_TAG_ID: '',
    PROMOTION_DROPDOWN_ENABLED: 'true',
    PROMO_CODE_ENABLED: 'true'
  });

  // Password change states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // SMS Logs states
  const [smsLogs, setSmsLogs] = useState<any[]>([]);
  const [smsLogsLoading, setSmsLogsLoading] = useState(false);

  // Promotions States
  const [promotionsData, setPromotionsData] = useState<{ offers: any[]; promoCodes: any[] }>({ offers: [], promoCodes: [] });
  const [promotionsLoading, setPromotionsLoading] = useState(false);

  // Offer modal states
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [offerForm, setOfferForm] = useState({ title: '', subtitle: '', discountPct: '0', isActive: true });
  const [savingOffer, setSavingOffer] = useState(false);

  // Promo Code modal states
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<any>(null);
  const [codeForm, setCodeForm] = useState({ code: '', discountType: 'FLAT', discountVal: '50', isActive: true });
  const [savingCode, setSavingCode] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === 'sms_logs') {
      fetchSmsLogs();
    } else if (activeTab === 'promotions') {
      fetchAdminPromotions();
    }
  }, [activeTab]);

  const fetchAdminPromotions = async () => {
    setPromotionsLoading(true);
    try {
      const res = await fetch('/api/admin/promotions');
      const data = await res.json();
      if (data.success) {
        setPromotionsData({
          offers: data.offers || [],
          promoCodes: data.promoCodes || []
        });
      }
    } catch (e) {
      console.error("Failed to fetch admin promotions:", e);
    } finally {
      setPromotionsLoading(false);
    }
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOffer(true);
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'OFFER',
          id: editingOffer?.id,
          title: offerForm.title,
          subtitle: offerForm.subtitle,
          discountPct: offerForm.discountPct,
          isActive: offerForm.isActive
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(editingOffer ? "প্রমোশন অফার সম্পাদনা সফল হয়েছে!" : "নতুন প্রমোশন অফার তৈরি সফল হয়েছে!");
        setOfferModalOpen(false);
        setEditingOffer(null);
        setOfferForm({ title: '', subtitle: '', discountPct: '0', isActive: true });
        fetchAdminPromotions();
      } else {
        alert(data.error || "সংরক্ষণ করতে ব্যর্থ হয়েছে।");
      }
    } catch (e) {
      console.error(e);
      alert("সার্ভার এরর, আবার চেষ্টা করুন।");
    } finally {
      setSavingOffer(false);
    }
  };

  const handleToggleOfferStatus = async (offer: any) => {
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'OFFER',
          id: offer.id,
          title: offer.title,
          subtitle: offer.subtitle,
          discountPct: offer.discountPct,
          isActive: !offer.isActive
        })
      });
      if (res.ok) {
        fetchAdminPromotions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই প্রমোশন অপশনটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/promotions?type=OFFER&id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminPromotions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCode(true);
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PROMO_CODE',
          id: editingCode?.id,
          code: codeForm.code,
          discountType: codeForm.discountType,
          discountVal: codeForm.discountVal,
          isActive: codeForm.isActive
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(editingCode ? "প্রমো কোড সম্পাদনা সফল হয়েছে!" : "নতুন প্রমো কোড তৈরি সফল হয়েছে!");
        setCodeModalOpen(false);
        setEditingCode(null);
        setCodeForm({ code: '', discountType: 'FLAT', discountVal: '50', isActive: true });
        fetchAdminPromotions();
      } else {
        alert(data.error || "সংরক্ষণ করতে ব্যর্থ হয়েছে।");
      }
    } catch (e) {
      console.error(e);
      alert("সার্ভার এরর, আবার চেষ্টা করুন।");
    } finally {
      setSavingCode(false);
    }
  };

  const handleToggleCodeStatus = async (codeItem: any) => {
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PROMO_CODE',
          id: codeItem.id,
          code: codeItem.code,
          discountType: codeItem.discountType,
          discountVal: codeItem.discountVal,
          isActive: !codeItem.isActive
        })
      });
      if (res.ok) {
        fetchAdminPromotions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই প্রমো কোডটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/promotions?type=PROMO_CODE&id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminPromotions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSmsLogs = async () => {
    setSmsLogsLoading(true);
    try {
      const res = await fetch('/api/admin/sms-logs');
      const data = await res.json();
      if (data.success) {
        setSmsLogs(data.logs || []);
      }
    } catch (e) {
      console.error("Failed to fetch SMS logs:", e);
    } finally {
      setSmsLogsLoading(false);
    }
  };

  const deleteSmsLog = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই SMS লগটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/sms-logs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSmsLogs(prev => prev.filter(item => item.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearAllSmsLogs = async () => {
    if (!confirm("আপনি কি নিশ্চিত যে সমস্ত SMS লগ স্থায়ীভাবে মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch('/api/admin/sms-logs?clearAll=true', { method: 'DELETE' });
      if (res.ok) {
        setSmsLogs([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSettings = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({
          ...prev,
          WHATSAPP_NUMBER: data.WHATSAPP_NUMBER || prev.WHATSAPP_NUMBER,
          BKASH_NUMBER: data.BKASH_NUMBER || prev.BKASH_NUMBER,
          BKASH_TYPE: data.BKASH_TYPE || 'PERSONAL',
          NAGAD_NUMBER: data.NAGAD_NUMBER || prev.NAGAD_NUMBER,
          NAGAD_TYPE: data.NAGAD_TYPE || 'PERSONAL',
          ROCKET_NUMBER: data.ROCKET_NUMBER || prev.ROCKET_NUMBER || '01900000000',
          ROCKET_TYPE: data.ROCKET_TYPE || 'PERSONAL',
          UPAY_NUMBER: data.UPAY_NUMBER || prev.UPAY_NUMBER || '01500000000',
          UPAY_TYPE: data.UPAY_TYPE || 'PERSONAL',
          META_PIXEL_ID: data.META_PIXEL_ID || '',
          GOOGLE_TAG_ID: data.GOOGLE_TAG_ID || '',
          PROMOTION_DROPDOWN_ENABLED: data.PROMOTION_DROPDOWN_ENABLED || 'true',
          PROMO_CODE_ENABLED: data.PROMO_CODE_ENABLED || 'true'
        }));
      }
    } catch (e) {
      console.error('Failed to load general settings', e);
    }
    setFetchLoading(false);
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleTogglePromotionSetting = async (key: 'PROMOTION_DROPDOWN_ENABLED' | 'PROMO_CODE_ENABLED') => {
    const newVal = settings[key] === 'true' ? 'false' : 'true';
    const updated = { ...settings, [key]: newVal };
    setSettings(updated);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: newVal })
      });
      if (!res.ok) {
        alert('টগল সংরক্ষণ ব্যর্থ হয়েছে');
        setSettings(prev => ({ ...prev, [key]: settings[key] }));
      }
    } catch (e) {
      console.error(e);
      alert('সার্ভার ত্রুটি');
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert("General Settings saved successfully!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving settings.");
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'সবগুলো ঘর পূরণ করা আবশ্যক' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMessage({ type: 'success', text: data.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে' });
      }
    } catch (e) {
      console.error(e);
      setPasswordMessage({ type: 'error', text: 'সার্ভার ত্রুটি, আবার চেষ্টা করুন' });
    }
    setPasswordLoading(false);
  };

  if (fetchLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-500 font-medium dark:text-slate-400">
        <Loader2 className="animate-spin mr-2" /> Loading settings...
      </div>
    );
  }

  const inputClass = "w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary";
  const labelClass = "block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300";

  return (
    <>
      <div className="mb-8">
        <h2 className="text-heading-6 font-bold text-dark dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" /> General Settings
        </h2>
        <p className="font-medium text-slate-500">Configure global parameters, payment numbers, analytics tracking, and administrative security.</p>
      </div>

      <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-stroke-dark dark:bg-gray-dark max-w-5xl overflow-hidden">
        {/* Tabs navigation */}
        <div className="flex border-b border-stroke dark:border-dark-3 bg-gray-2 dark:bg-dark-2 flex-wrap">
          {[
            { id: 'general', label: 'General & Tracking', icon: Phone },
            { id: 'payment', label: 'Payment Gateways', icon: CreditCard },
            { id: 'promotions', label: 'Promotions', icon: Tag },
            { id: 'sms_logs', label: 'SMS Transactions Log', icon: MessageSquare },
            { id: 'security', label: 'Admin Security', icon: Key }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                type="button"
                className={`px-6 py-3 font-semibold text-sm transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'border-b-2 border-primary text-primary bg-white dark:bg-gray-dark' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content body */}
        <div className="p-6 md:p-8">
          {activeTab === 'general' && (
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input 
                  type="text" 
                  value={settings.WHATSAPP_NUMBER} 
                  onChange={e => handleSettingChange('WHATSAPP_NUMBER', e.target.value)} 
                  className={inputClass} 
                  placeholder="e.g. 8801700000000"
                />
                <p className="text-xs text-slate-500 mt-2">Used for floating WhatsApp widgets and contact integrations. Specify country code without "+" sign.</p>
              </div>

              <div className="border-t border-stroke dark:border-dark-3 pt-6">
                <h3 className="text-md font-bold mb-4 text-dark dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" /> Web Analytics & Event Tracking
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Meta Pixel ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 123456789012345" 
                      value={settings.META_PIXEL_ID} 
                      onChange={e => handleSettingChange('META_PIXEL_ID', e.target.value)} 
                      className={inputClass} 
                    />
                    <p className="text-xs text-slate-500 mt-2">Enter your Meta (Facebook) Pixel ID to track landing page conversions.</p>
                  </div>
                  <div>
                    <label className={labelClass}>Google Tag Manager (GTM) ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. GTM-N1A2B3C" 
                      value={settings.GOOGLE_TAG_ID} 
                      onChange={e => handleSettingChange('GOOGLE_TAG_ID', e.target.value)} 
                      className={inputClass} 
                    />
                    <p className="text-xs text-slate-500 mt-2">Enter your GTM container ID to inject Tag Manager scripts.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stroke dark:border-dark-3 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="inline-flex justify-center items-center gap-2 rounded-lg bg-primary py-3 px-8 font-semibold text-white hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save General Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'promotions' && (
            <div className="space-y-8 text-left">
              {/* Header Info */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" /> Promotions & Promo Codes Management
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  চেকআউট মোডালের প্রমোশন ড্রপডাউন অফারসমূহ এবং কাস্টম প্রমো কোড (Promo Codes) কাস্টমাইজ করুন।
                </p>
              </div>

              {/* Section 1: Promotion Offers List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-500" /> প্রমোশন ড্রপডাউন অফারসমূহ (Promotions List)
                    </h4>
                    <p className="text-xs text-slate-500">চেকআউট মোডালে "প্রমোশন নির্বাচন করুন" মেনুতে এই অফারগুলো দেখাবে।</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Active</span>
                      <button
                        type="button"
                        onClick={() => handleTogglePromotionSetting('PROMOTION_DROPDOWN_ENABLED')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${settings.PROMOTION_DROPDOWN_ENABLED === 'true' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                        title={settings.PROMOTION_DROPDOWN_ENABLED === 'true' ? 'সক্রিয় - চেকআউটে দেখাবে' : 'নিষ্ক্রিয় - চেকআউটে লুকানো'}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.PROMOTION_DROPDOWN_ENABLED === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className={`text-[10px] font-bold ${settings.PROMOTION_DROPDOWN_ENABLED === 'true' ? 'text-emerald-600' : 'text-slate-500'}`}>{settings.PROMOTION_DROPDOWN_ENABLED === 'true' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingOffer(null);
                        setOfferForm({ title: '', subtitle: '', discountPct: '0', isActive: true });
                        setOfferModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-opacity-90 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> নতুন প্রমোশন যোগ করুন
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        <th className="py-3 px-5">Title (অফার নাম)</th>
                        <th className="py-3 px-5">Subtitle (সাবটাইটেল)</th>
                        <th className="py-3 px-5 text-center">Discount (%)</th>
                        <th className="py-3 px-5 text-center">Status (স্ট্যাটাস)</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {promotionsData.offers.map((offer: any) => (
                        <tr key={offer.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                            {offer.title} {offer.isDefault && <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 px-2 py-0.5 rounded-md ml-1 font-semibold">ডিফল্ট</span>}
                          </td>
                          <td className="py-3.5 px-5 text-slate-600 dark:text-slate-400 font-medium">
                            {offer.subtitle}
                          </td>
                          <td className="py-3.5 px-5 text-center font-black text-emerald-600 dark:text-emerald-400">
                            {offer.discountPct}% OFF
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleOfferStatus(offer)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                offer.isActive
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {offer.isActive ? "✓ সক্রিয়" : "✕ নিষ্ক্রিয়"}
                            </button>
                          </td>
                          <td className="py-3.5 px-5 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingOffer(offer);
                                setOfferForm({ title: offer.title, subtitle: offer.subtitle, discountPct: offer.discountPct.toString(), isActive: offer.isActive });
                                setOfferModalOpen(true);
                              }}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                              title="সম্পাদনা করুন"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {!offer.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleDeleteOffer(offer.id)}
                                className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {promotionsData.offers.length === 0 && !promotionsLoading && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                            কোনো প্রমোশন অফার পাওয়া যায়নি।
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: Promo Codes List */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-blue-500" /> কাস্টম প্রমো কোডসমূহ (Promo Codes)
                    </h4>
                    <p className="text-xs text-slate-500">গ্রাহক ডিসকাউন্ট কোড বক্সে এটি বসালে ছাড় পাবে।</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Active</span>
                      <button
                        type="button"
                        onClick={() => handleTogglePromotionSetting('PROMO_CODE_ENABLED')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${settings.PROMO_CODE_ENABLED === 'true' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                        title={settings.PROMO_CODE_ENABLED === 'true' ? 'সক্রিয় - চেকআউটে দেখাবে' : 'নিষ্ক্রিয় - চেকআউটে লুকানো'}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.PROMO_CODE_ENABLED === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className={`text-[10px] font-bold ${settings.PROMO_CODE_ENABLED === 'true' ? 'text-blue-600' : 'text-slate-500'}`}>{settings.PROMO_CODE_ENABLED === 'true' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCode(null);
                        setCodeForm({ code: '', discountType: 'FLAT', discountVal: '50', isActive: true });
                        setCodeModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> নতুন প্রমো কোড যোগ করুন
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        <th className="py-3 px-5">Code (কোড)</th>
                        <th className="py-3 px-5 text-center">Type (টাইপ)</th>
                        <th className="py-3 px-5 text-center">Discount Value (ছাড়ের পরিমাণ)</th>
                        <th className="py-3 px-5 text-center">Status (স্ট্যাটাস)</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {promotionsData.promoCodes.map((codeItem: any) => (
                        <tr key={codeItem.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-5">
                            <span className="px-3 py-1 rounded-full font-mono font-black text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              {codeItem.code}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-center font-bold text-slate-700 dark:text-slate-300">
                            {codeItem.discountType === 'PERCENT' ? 'পার্সেন্টেজ (%)' : 'ফ্ল্যাট ফি (৳)'}
                          </td>
                          <td className="py-3.5 px-5 text-center font-black text-emerald-600 dark:text-emerald-400">
                            {codeItem.discountType === 'PERCENT' ? `${codeItem.discountVal}%` : `৳ ${codeItem.discountVal}`}
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleCodeStatus(codeItem)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                codeItem.isActive
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {codeItem.isActive ? "✓ সক্রিয়" : "✕ নিষ্ক্রিয়"}
                            </button>
                          </td>
                          <td className="py-3.5 px-5 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCode(codeItem);
                                setCodeForm({ code: codeItem.code, discountType: codeItem.discountType, discountVal: codeItem.discountVal.toString(), isActive: codeItem.isActive });
                                setCodeModalOpen(true);
                              }}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                              title="সম্পাদনা করুন"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCode(codeItem.id)}
                              className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {promotionsData.promoCodes.length === 0 && !promotionsLoading && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                            কোনো প্রমো কোড পাওয়া যায়নি।
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal 1: Add/Edit Offer */}
              {offerModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {editingOffer ? "প্রমোশন অপশন সম্পাদনা করুন" : "নতুন প্রমোশন অপশন যোগ করুন"}
                      </h3>
                      <button onClick={() => setOfferModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveOffer} className="space-y-4">
                      <div>
                        <label className={labelClass}>Title (অফারের নাম)</label>
                        <input
                          type="text"
                          required
                          value={offerForm.title}
                          onChange={e => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                          className={inputClass}
                          placeholder="e.g. 10% Deposit Bonus"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Subtitle (বাংলা সাবটাইটেল)</label>
                        <input
                          type="text"
                          required
                          value={offerForm.subtitle}
                          onChange={e => setOfferForm(prev => ({ ...prev, subtitle: e.target.value }))}
                          className={inputClass}
                          placeholder="e.g. ১০% প্রমোশন অফার"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Discount Percentage (%)</label>
                        <input
                          type="number"
                          step="any"
                          required
                          min="0"
                          max="100"
                          value={offerForm.discountPct}
                          onChange={e => setOfferForm(prev => ({ ...prev, discountPct: e.target.value }))}
                          className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                          placeholder="e.g. 10"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Status (স্ট্যাটাস)</label>
                        <select
                          value={offerForm.isActive ? 'ACTIVE' : 'INACTIVE'}
                          onChange={e => setOfferForm(prev => ({ ...prev, isActive: e.target.value === 'ACTIVE' }))}
                          className={inputClass}
                        >
                          <option value="ACTIVE">সক্রিয় (Active)</option>
                          <option value="INACTIVE">নিষ্ক্রিয় (Inactive)</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setOfferModalOpen(false)}
                          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                        >
                          বাতিল
                        </button>
                        <button
                          type="submit"
                          disabled={savingOffer}
                          className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {savingOffer && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          {savingOffer ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal 2: Add/Edit Promo Code */}
              {codeModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {editingCode ? "প্রমো কোড সম্পাদনা করুন" : "নতুন প্রমো কোড তৈরি করুন"}
                      </h3>
                      <button onClick={() => setCodeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveCode} className="space-y-4">
                      <div>
                        <label className={labelClass}>Promo Code (কোড নাম)</label>
                        <input
                          type="text"
                          required
                          value={codeForm.code}
                          onChange={e => setCodeForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                          className={inputClass}
                          placeholder="e.g. DISCOUNT50"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Discount Type (ডিসকাউন্ট টাইপ)</label>
                        <select
                          value={codeForm.discountType}
                          onChange={e => setCodeForm(prev => ({ ...prev, discountType: e.target.value }))}
                          className={inputClass}
                        >
                          <option value="FLAT">Flat Disount (ফিক্সড টাকা ৳)</option>
                          <option value="PERCENT">Percentage Discount (পার্সেন্টেজ %)</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Discount Value (ছাড়ের পরিমাণ)</label>
                        <input
                          type="number"
                          step="any"
                          required
                          min="1"
                          value={codeForm.discountVal}
                          onChange={e => setCodeForm(prev => ({ ...prev, discountVal: e.target.value }))}
                          className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                          placeholder={codeForm.discountType === 'FLAT' ? 'e.g. 50' : 'e.g. 10'}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Status (স্ট্যাটাস)</label>
                        <select
                          value={codeForm.isActive ? 'ACTIVE' : 'INACTIVE'}
                          onChange={e => setCodeForm(prev => ({ ...prev, isActive: e.target.value === 'ACTIVE' }))}
                          className={inputClass}
                        >
                          <option value="ACTIVE">সক্রিয় (Active)</option>
                          <option value="INACTIVE">নিষ্ক্রিয় (Inactive)</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setCodeModalOpen(false)}
                          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                        >
                          বাতিল
                        </button>
                        <button
                          type="submit"
                          disabled={savingCode}
                          className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {savingCode && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          {savingCode ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'payment' && (
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>
                    bKash Number ({settings.BKASH_TYPE === 'AGENT' ? 'Agent - Cash Out' : settings.BKASH_TYPE === 'PAYMENT' ? 'Payment - Make Payment' : 'Personal - Send Money'})
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      value={settings.BKASH_NUMBER} 
                      onChange={e => handleSettingChange('BKASH_NUMBER', e.target.value)} 
                      className={`${inputClass} sm:col-span-2`} 
                      placeholder="e.g. 01700000000"
                    />
                    <select
                      value={settings.BKASH_TYPE || 'PERSONAL'}
                      onChange={e => handleSettingChange('BKASH_TYPE', e.target.value)}
                      className={inputClass}
                    >
                      <option value="PERSONAL">Personal</option>
                      <option value="AGENT">Agent</option>
                      <option value="PAYMENT">Payment</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {settings.BKASH_TYPE === 'AGENT' ? 'Shown to users as Agent Cash Out number.' : settings.BKASH_TYPE === 'PAYMENT' ? 'Shown to users as Payment / Merchant number.' : 'Shown to users as Personal Send Money number.'}
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    Nagad Number ({settings.NAGAD_TYPE === 'AGENT' ? 'Agent - Cash Out' : settings.NAGAD_TYPE === 'PAYMENT' ? 'Payment - Make Payment' : 'Personal - Send Money'})
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      value={settings.NAGAD_NUMBER} 
                      onChange={e => handleSettingChange('NAGAD_NUMBER', e.target.value)} 
                      className={`${inputClass} sm:col-span-2`} 
                      placeholder="e.g. 01800000000"
                    />
                    <select
                      value={settings.NAGAD_TYPE || 'PERSONAL'}
                      onChange={e => handleSettingChange('NAGAD_TYPE', e.target.value)}
                      className={inputClass}
                    >
                      <option value="PERSONAL">Personal</option>
                      <option value="AGENT">Agent</option>
                      <option value="PAYMENT">Payment</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {settings.NAGAD_TYPE === 'AGENT' ? 'Shown to users as Agent Cash Out number.' : settings.NAGAD_TYPE === 'PAYMENT' ? 'Shown to users as Payment / Merchant number.' : 'Shown to users as Personal Send Money number.'}
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    Rocket Number ({settings.ROCKET_TYPE === 'AGENT' ? 'Agent - Cash Out' : settings.ROCKET_TYPE === 'PAYMENT' ? 'Payment - Make Payment' : 'Personal - Send Money'})
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      value={settings.ROCKET_NUMBER} 
                      onChange={e => handleSettingChange('ROCKET_NUMBER', e.target.value)} 
                      className={`${inputClass} sm:col-span-2`} 
                      placeholder="e.g. 01900000000"
                    />
                    <select
                      value={settings.ROCKET_TYPE || 'PERSONAL'}
                      onChange={e => handleSettingChange('ROCKET_TYPE', e.target.value)}
                      className={inputClass}
                    >
                      <option value="PERSONAL">Personal</option>
                      <option value="AGENT">Agent</option>
                      <option value="PAYMENT">Payment</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {settings.ROCKET_TYPE === 'AGENT' ? 'Shown to users as Agent Cash Out number.' : settings.ROCKET_TYPE === 'PAYMENT' ? 'Shown to users as Payment / Merchant number.' : 'Shown to users as Personal Send Money number.'}
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    Upay Number ({settings.UPAY_TYPE === 'AGENT' ? 'Agent - Cash Out' : settings.UPAY_TYPE === 'PAYMENT' ? 'Payment - Make Payment' : 'Personal - Send Money'})
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      value={settings.UPAY_NUMBER} 
                      onChange={e => handleSettingChange('UPAY_NUMBER', e.target.value)} 
                      className={`${inputClass} sm:col-span-2`} 
                      placeholder="e.g. 01500000000"
                    />
                    <select
                      value={settings.UPAY_TYPE || 'PERSONAL'}
                      onChange={e => handleSettingChange('UPAY_TYPE', e.target.value)}
                      className={inputClass}
                    >
                      <option value="PERSONAL">Personal</option>
                      <option value="AGENT">Agent</option>
                      <option value="PAYMENT">Payment</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {settings.UPAY_TYPE === 'AGENT' ? 'Shown to users as Agent Cash Out number.' : settings.UPAY_TYPE === 'PAYMENT' ? 'Shown to users as Payment / Merchant number.' : 'Shown to users as Personal Send Money number.'}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-stroke dark:border-dark-3 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="inline-flex justify-center items-center gap-2 rounded-lg bg-primary py-3 px-8 font-semibold text-white hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Payment Gateways
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'sms_logs' && (
            <div className="space-y-6 text-left">
              {/* Webhook Info Card */}
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    MacroDroid Webhook SMS Integration
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={fetchSmsLogs}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${smsLogsLoading ? "animate-spin" : ""}`} /> রিফ্রেশ
                    </button>
                    {smsLogs.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAllSmsLogs}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> সকল লগ মুছুন
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  আপনার অ্যান্ড্রয়েড ফোনে <strong>MacroDroid</strong> বা অন্য যেকোনো SMS Forwarder অ্যাপের মাধ্যমে bKash/Nagad/Rocket SMS বার্তাগুলো নিচে উল্লেখিত Webhook URL এ `POST` ফরমেটে পাঠালে তা সাথে সাথে এখানে রেকর্ড হবে এবং গ্রাহকের অর্ডারের সাথে অটোমেটিক ম্যাচিং হবে।
                </p>

                {/* Webhook URL Copy Box */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value="https://lovelearn.live/api/webhook/sms"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("https://lovelearn.live/api/webhook/sms");
                      alert("Webhook URL কপি করা হয়েছে!");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" /> Webhook URL কপি করুন
                  </button>
                </div>
              </div>

              {/* SMS Logs Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    SMS Transactions History ({smsLogs.length})
                  </h4>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        <th className="py-3 px-5">Provider / From</th>
                        <th className="py-3 px-5 text-center">TrxID</th>
                        <th className="py-3 px-5 text-center">Amount</th>
                        <th className="py-3 px-5 text-center">Order Status</th>
                        <th className="py-3 px-5 text-center">Date & Time</th>
                        <th className="py-3 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {smsLogs.map((log: any) => {
                        const d = new Date(log.createdAt);
                        const dateFormatted = d.toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
                        return (
                          <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                            <td className="py-3.5 px-5 font-bold text-slate-800 dark:text-white">
                              {log.from || "SMS Forwarder"}
                            </td>
                            <td className="py-3.5 px-5 text-center">
                              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                {log.trxId}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-center font-extrabold text-slate-900 dark:text-white">
                              ৳ {log.amount}
                            </td>
                            <td className="py-3.5 px-5 text-center">
                              {log.isMatched ? (
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  ✓ অর্ডারে ম্যাচড
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  পেন্ডিং / আনম্যাচড
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-5 text-center font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              {dateFormatted}
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <button
                                type="button"
                                onClick={() => deleteSmsLog(log.id)}
                                className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {smsLogs.length === 0 && !smsLogsLoading && (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-slate-400 font-semibold">
                            কোনো SMS ট্রানজেকশন লগ পাওয়া যায়নি।
                          </td>
                        </tr>
                      )}

                      {smsLogsLoading && (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-slate-400 font-semibold">
                            লগ ফাইলসমূহ লোড হচ্ছে...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <h3 className="text-md font-bold text-dark dark:text-white flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-yellow-500" /> Change Admin Password
              </h3>

              {passwordMessage.text && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${passwordMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50'}`}>
                  {passwordMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-medium">{passwordMessage.text}</p>
                </div>
              )}

              <div className="space-y-5 max-w-xl">
                <div>
                  <label className={labelClass}>Current Password (বর্তমান পাসওয়ার্ড)</label>
                  <input 
                    type="password" 
                    value={passwordForm.currentPassword} 
                    onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} 
                    className={inputClass} 
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>New Password (নতুন পাসওয়ার্ড)</label>
                  <input 
                    type="password" 
                    value={passwordForm.newPassword} 
                    onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} 
                    className={inputClass} 
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Confirm New Password (নতুন পাসওয়ার্ড নিশ্চিত করুন)</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirmPassword} 
                    onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} 
                    className={inputClass} 
                    required
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-stroke dark:border-dark-3 flex justify-end">
                <button 
                  type="submit" 
                  disabled={passwordLoading} 
                  className="inline-flex justify-center items-center gap-2 rounded-lg bg-primary py-3 px-8 font-semibold text-white hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Changing Password...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" /> Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
