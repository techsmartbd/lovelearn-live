"use client";

import React, { useState, useEffect } from 'react';

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

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'COMPLETED': 'bg-green-100 text-green-800 border-green-200',
    'HOLD': 'bg-orange-100 text-orange-800 border-orange-200',
    'CANCELLED': 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <>
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Orders Management</h1>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-sm text-slate-600">Order ID</th>
              <th className="p-4 font-semibold text-sm text-slate-600">Date</th>
              <th className="p-4 font-semibold text-sm text-slate-600">Customer</th>
              <th className="p-4 font-semibold text-sm text-slate-600">Package</th>
              <th className="p-4 font-semibold text-sm text-slate-600">Amount</th>
              <th className="p-4 font-semibold text-sm text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">No orders found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-slate-500">{order.id.substring(0,8)}...</td>
                  <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-sm">
                    <p className="font-bold">{order.user.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{order.user.phone}</p>
                  </td>
                  <td className="p-4 text-sm font-medium">{order.package.title}</td>
                  <td className="p-4 text-sm font-bold text-[#ff0000]">৳{order.amount}</td>
                  <td className="p-4 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1.5 rounded border outline-none cursor-pointer ${statusColors[order.status] || 'bg-gray-100'}`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="HOLD">HOLD</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
