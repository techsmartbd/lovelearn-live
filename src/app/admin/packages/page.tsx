"use client";

import React, { useState, useEffect } from 'react';

type Package = {
  id: string;
  title: string;
  type?: string;
  price: number;
  originalPrice?: number;
  description?: string;
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('TUTORIAL');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch('/api/admin/packages');
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (e) {
      console.error(e);
    }
    setFetchLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { title, type, price, originalPrice, description };
    const url = editingId ? `/api/admin/packages/${editingId}` : '/api/admin/packages';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchPackages();
        resetForm();
      } else {
        alert("Failed to save package");
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchPackages();
      } else {
        alert("Failed to delete package");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (pkg: Package) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(pkg.id);
    setTitle(pkg.title);
    setType(pkg.type || 'TUTORIAL');
    setPrice(pkg.price.toString());
    setOriginalPrice(pkg.originalPrice ? pkg.originalPrice.toString() : '');
    setDescription(pkg.description || '');
  };

  const resetForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(null);
    setTitle('');
    setType('TUTORIAL');
    setPrice('');
    setOriginalPrice('');
    setDescription('');
  };

  if (fetchLoading) return <div className="p-8 text-slate-500 font-medium">Loading packages...</div>;

  const inputClass = "w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary";
  const labelClass = "block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300";

  return (
    <>
      <div className="mb-8">
        <h2 className="text-heading-6 font-bold text-dark dark:text-white">
          Course Packages Management
        </h2>
        <p className="font-medium text-slate-500">Configure pricing packages and course access options for checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-5 rounded-2xl border border-stroke bg-white p-6 md:p-8 shadow-1 dark:border-stroke-dark dark:bg-gray-dark">
          <h3 className="text-heading-6 font-bold text-dark dark:text-white mb-6">
            {editingId ? "Edit Package" : "Add New Package"}
          </h3>
          <form className="space-y-4.5 text-left" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Package Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className={inputClass} 
                  placeholder="e.g. 2 Months Course" 
                  required 
                />
              </div>
              <div>
                <label className={labelClass}>Package Type (প্যাকেজ টাইপ)</label>
                <select value={type} onChange={e => setType(e.target.value)} className={inputClass}>
                  <option value="TUTORIAL">TUTORIAL (টিউটোরিয়াল)</option>
                  <option value="EBOOK">EBOOK (ইবুক)</option>
                  <option value="COMBO">COMBO (টিউটোরিয়াল + ইবুক)</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price (৳)</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  className={inputClass} 
                  placeholder="e.g. 990" 
                  required 
                />
              </div>
              <div>
                <label className={labelClass}>Original Price (৳) (Optional)</label>
                <input 
                  type="number" 
                  value={originalPrice} 
                  onChange={e => setOriginalPrice(e.target.value)} 
                  className={inputClass} 
                  placeholder="e.g. 2500" 
                />
              </div>
            </div>
            
            <div>
              <label className={labelClass}>Description / Features (Comma separated)</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className={inputClass} 
                rows={3} 
                placeholder="Feature 1, Feature 2, Feature 3"
              ></textarea>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 inline-flex justify-center rounded-lg bg-primary py-3 px-6 font-semibold text-white hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "Saving..." : (editingId ? "Update" : "Create")}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-6 py-3 rounded-lg bg-gray-2 text-slate-700 hover:bg-neutral-200 transition-all dark:bg-dark-3 dark:text-white dark:hover:bg-dark-4 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-7 rounded-2xl border border-stroke bg-white p-6 md:p-8 shadow-1 dark:border-stroke-dark dark:bg-gray-dark">
          <h3 className="text-heading-6 font-bold text-dark dark:text-white mb-6">Active Packages</h3>
          
          {packages.length === 0 ? (
            <p className="text-slate-500 text-sm font-medium">No packages found. Create one on the left!</p>
          ) : (
            <div className="space-y-2.5">
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-4 bg-slate-50 dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-xl flex justify-between items-center transition-all hover:shadow-xs text-left">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-dark dark:text-white text-base leading-none">{pkg.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase leading-none border ${
                        pkg.type === 'COMBO' 
                          ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' 
                          : pkg.type === 'EBOOK' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                      }`}>
                        {pkg.type || 'TUTORIAL'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      Price: <span className="text-primary font-semibold">৳{pkg.price}</span> 
                      {pkg.originalPrice && <span className="line-through text-slate-400 ml-2">৳{pkg.originalPrice}</span>}
                    </p>
                  </div>
                  <div className="flex gap-4.5">
                    <button onClick={() => handleEdit(pkg)} className="text-primary hover:text-opacity-80 text-sm font-bold transition-colors">Edit</button>
                    <button onClick={() => handleDelete(pkg.id)} className="text-red hover:text-opacity-80 text-sm font-bold transition-colors">Delete</button>
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
