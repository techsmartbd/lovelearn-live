"use client";

import React, { useState, useEffect } from 'react';

type Package = {
  id: string;
  title: string;
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
    
    const payload = { title, price, originalPrice, description };
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
    setEditingId(pkg.id);
    setTitle(pkg.title);
    setPrice(pkg.price.toString());
    setOriginalPrice(pkg.originalPrice ? pkg.originalPrice.toString() : '');
    setDescription(pkg.description || '');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setOriginalPrice('');
    setDescription('');
  };

  return (
    <>
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Package Management</h1>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 self-start">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">
            {editingId ? "Edit Package" : "Add New Package"}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1">Package Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. 2 Months Course" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Price (৳)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. 990" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Original Price (৳) (Optional)</label>
                <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. 2500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Description / Features</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md" rows={3} placeholder="Comma separated features"></textarea>
            </div>
            
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="flex-1 bg-[#ff0000] text-white py-2 px-6 rounded-md font-bold hover:bg-[#cc0000] transition-colors">
                {loading ? "Saving..." : (editingId ? "Update Package" : "Create Package")}
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
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Active Packages</h2>
          
          {fetchLoading ? (
            <p className="text-slate-500 text-sm">Loading packages...</p>
          ) : packages.length === 0 ? (
            <p className="text-slate-500 text-sm">No packages found. Create one!</p>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-4 bg-slate-50 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{pkg.title}</p>
                    <p className="text-xs text-slate-500">
                      Price: ৳{pkg.price} {pkg.originalPrice && <span className="line-through">৳{pkg.originalPrice}</span>}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(pkg)} className="text-blue-500 text-sm font-bold hover:underline">Edit</button>
                    <button onClick={() => handleDelete(pkg.id)} className="text-red-500 text-sm font-bold hover:underline">Delete</button>
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
