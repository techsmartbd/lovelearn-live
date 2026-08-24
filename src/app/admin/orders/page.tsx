"use client";

import React, { useState, useEffect } from 'react';
import { PhoneCall } from 'lucide-react';

type Order = {
  id: string;
  userId: string;
  packageId: string;
  trxId: string | null;
  amount: number;
  status: string;
  createdAt: string;
  user: { name: string | null, phone: string | null };
  package: { title: string };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [callingState, setCallingState] = useState<Record<string, 'idle' | 'calling' | 'success' | 'failed'>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Failed to fetch orders", e);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Update local state immediately for better UX
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      console.error(e);
      alert("Error updating status");
    }
  };

  const handleTriggerCall = async (phone: string, name: string | null) => {
    const safeName = name || 'Customer';
    setCallingState(prev => ({ ...prev, [phone]: 'calling' }));
    try {
      const res = await fetch('/api/admin/calls/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, customerName: safeName })
      });
      if (res.ok) {
        setCallingState(prev => ({ ...prev, [phone]: 'success' }));
        alert(`ভয়েস কল সফলভাবে শুরু হয়েছে! ${safeName} (${phone}) নম্বরে ডায়াল করা হচ্ছে...`);
        setTimeout(() => {
          setCallingState(prev => ({ ...prev, [phone]: 'idle' }));
        }, 3000);
      } else {
        const data = await res.json();
        setCallingState(prev => ({ ...prev, [phone]: 'failed' }));
        alert(`কল ট্রিগার করতে ব্যর্থ হয়েছে: ${data.error || 'Server error'}`);
        setTimeout(() => {
          setCallingState(prev => ({ ...prev, [phone]: 'idle' }));
        }, 3000);
      }
    } catch (err: any) {
      setCallingState(prev => ({ ...prev, [phone]: 'failed' }));
      alert(`কল করতে সমস্যা হয়েছে: ${err.message || err}`);
    }
  };

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'COMPLETED': 'bg-green-100 text-green-800 border-green-200',
    'HOLD': 'bg-orange-100 text-orange-800 border-orange-200',
    'CANCELLED': 'bg-red-100 text-red-800 border-red-200',
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading orders...</div>;

  return (
    <>
      <div className="mb-8">
        <h2 className="text-heading-6 font-bold text-dark dark:text-white">
          Orders Management
        </h2>
        <p className="font-medium text-slate-500">Monitor package purchases and verify bKash/Nagad Transaction IDs to complete orders.</p>
      </div>

      <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-stroke-dark dark:bg-gray-dark overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-dark-2 border-b border-stroke dark:border-dark-3">
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white">Order ID</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white">Date</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white">Customer</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white">TrxID</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white">Package</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white">Amount</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white">Status</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white text-center">AI Call</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-stroke dark:border-dark-3 hover:bg-slate-50/50 dark:hover:bg-dark-2/30 transition-colors">
                    <td className="px-5 py-5 text-xs font-mono text-slate-400">
                      #{order.id.substring(0, 8)}
                    </td>
                    <td className="px-5 py-5 text-sm text-dark dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-5 text-sm">
                      <p className="font-bold text-dark dark:text-white">{order.user.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-400 font-medium">{order.user.phone}</p>
                    </td>
                    <td className="px-5 py-5 text-sm font-semibold font-mono text-dark dark:text-white">
                      {order.trxId ? (
                        <span className="bg-slate-100 dark:bg-dark-3 px-2.5 py-1 rounded text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-dark-4">
                          {order.trxId}
                        </span>
                      ) : (
                        <span className="text-red font-bold">N/A</span>
                      )}
                    </td>
                    <td className="px-5 py-5 text-sm font-medium text-dark dark:text-white">
                      {order.package.title}
                    </td>
                    <td className="px-5 py-5 text-sm font-bold text-primary">
                      ৳{order.amount}
                    </td>
                    <td className="px-5 py-5 text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-2 rounded-lg border outline-none cursor-pointer transition-colors shadow-xs ${statusColors[order.status] || 'bg-gray-100 border-gray-200'}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="HOLD">HOLD</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-5 py-5 text-sm text-center">
                      <button
                        onClick={() => order.user.phone && handleTriggerCall(order.user.phone, order.user.name)}
                        disabled={callingState[order.user.phone || ''] === 'calling'}
                        className={`inline-flex items-center justify-center p-2 rounded-lg transition-all ${
                          callingState[order.user.phone || ''] === 'calling'
                            ? 'bg-yellow-100 text-yellow-800 animate-pulse'
                            : callingState[order.user.phone || ''] === 'success'
                            ? 'bg-green-100 text-green-800'
                            : callingState[order.user.phone || ''] === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-red-50 hover:bg-red-100 text-primary cursor-pointer'
                        }`}
                        title="এআই আউটবাউন্ড কল করুন"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
