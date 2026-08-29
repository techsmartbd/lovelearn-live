"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Monitor, Ban, CheckCircle, ChevronDown, ChevronUp, Trash2, Eye, EyeOff, Save, UserPlus, X } from 'lucide-react';

type Session = {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  deviceFingerprint: string;
  isActive: boolean;
  lastSeen: string;
  createdAt: string;
};

type User = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  isBlocked: boolean;
  accountStatus: string;
  expiresAt: string | null;
  sessions: Session[];
};

export default function AdminSessionsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [timeLimitUserId, setTimeLimitUserId] = useState<string | null>(null);
  const [timeLimitValue, setTimeLimitValue] = useState<string>('');
  
  const [editingPasswordUserId, setEditingPasswordUserId] = useState<string | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState<string>('');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [savedPasswordMap, setSavedPasswordMap] = useState<Record<string, string>>({});
  const [savingPassword, setSavingPassword] = useState<boolean>(false);
  const [loadingPasswordId, setLoadingPasswordId] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sessions?type=active');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAccountAction = async (userId: string, action: string, payload?: any) => {
    let confirmMsg = "Are you sure?";
    if (action === 'BLOCK' || action === 'SUSPEND') confirmMsg = "Are you sure you want to suspend this user? All their active sessions will be terminated immediately.";
    if (action === 'UNBLOCK') confirmMsg = "Are you sure you want to activate/unblock this user?";
    if (action === 'HOLD') confirmMsg = "Put this account on hold? The user won't be able to play videos or read books.";
    if (action === 'DELETE') confirmMsg = "PERMANENTLY DELETE this user? This cannot be undone.";
    if (action === 'LIMIT_TIME') confirmMsg = "Set a time limit for this account?";

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, ...payload })
      });
      if (res.ok) {
        setOpenDropdownId(null);
        setTimeLimitUserId(null);
        fetchUsers();
      } else {
        alert("Operation failed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePassword = async (userId: string) => {
    if (!newPasswordVal.trim()) {
      alert("Please enter a new password");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'UPDATE_PASSWORD', newPassword: newPasswordVal.trim() })
      });
      if (res.ok) {
        alert("Password updated successfully!");
        setEditingPasswordUserId(null);
        setNewPasswordVal('');
        setSavedPasswordMap(prev => ({ ...prev, [userId]: newPasswordVal.trim() }));
        setShowPasswordMap(prev => ({ ...prev, [userId]: true }));
        setTimeout(() => {
          setShowPasswordMap(prev => ({ ...prev, [userId]: false }));
          setSavedPasswordMap(prev => {
            const next = { ...prev };
            delete next[userId];
            return next;
          });
        }, 5000);
        fetchUsers();
      } else {
        alert("Failed to update password");
      }
    } catch (e) {
      console.error(e);
      alert("Error updating password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleTogglePassword = async (userId: string) => {
    if (showPasswordMap[userId]) {
      setShowPasswordMap(prev => ({ ...prev, [userId]: false }));
      return;
    }

    setLoadingPasswordId(userId);
    try {
      const res = await fetch('/api/admin/password-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const data = await res.json();
        setSavedPasswordMap(prev => ({ ...prev, [userId]: data.password }));
        setShowPasswordMap(prev => ({ ...prev, [userId]: true }));
      } else {
        alert("Failed to load password");
      }
    } catch (e) {
      console.error(e);
      alert("Error loading password");
    } finally {
      setLoadingPasswordId(null);
    }
  };

  const handleTerminateSession = async (userId: string, sessionId: string) => {
    if (!confirm("Are you sure you want to terminate this session?")) return;

    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'DELETE_SESSION' })
      });
      if (res.ok) {
        setUsers(users.map(s => {
          if (s.id === userId) {
            return {
              ...s,
              sessions: s.sessions.map(sess => sess.id === sessionId ? { ...sess, isActive: false } : sess)
            };
          }
          return s;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCreateUser = async () => {
    if (!createFormData.phone.trim() || !createFormData.password.trim()) {
      alert("Phone এবং Password আবশ্যক!");
      return;
    }
    if (createFormData.password !== createFormData.confirmPassword) {
      alert("পাসওয়ার্ড মিলছে না!");
      return;
    }
    if (createFormData.password.length < 6) {
      alert("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে!");
      return;
    }

    setCreatingUser(true);
    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_USER',
          name: createFormData.name.trim() || undefined,
          phone: createFormData.phone.trim(),
          email: createFormData.email.trim() || undefined,
          password: createFormData.password,
          role: createFormData.role,
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`ইউজার সফলভাবে তৈরি হয়েছে! (${data.user.name || data.user.phone})`);
        setShowCreateModal(false);
        setCreateFormData({ name: '', phone: '', email: '', password: '', confirmPassword: '', role: 'USER' });
        fetchUsers();
      } else {
        alert(data.error || "ইউজার তৈরি করা যায়নি!");
      }
    } catch (e) {
      console.error(e);
      alert("ইউজার তৈরি করার সময় ত্রুটি হয়েছে!");
    } finally {
      setCreatingUser(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading sessions & devices...</div>;

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-heading-6 font-bold text-dark dark:text-white">
            Active Premium Users
          </h2>
          <p className="font-medium text-slate-500">Monitor active user devices, IP addresses, and manage account access suspension.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow-md text-sm"
        >
          <UserPlus className="w-4 h-4" />
          নতুন ইউজার তৈরি করুন
        </button>
      </div>

      <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-stroke-dark dark:bg-gray-dark overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-dark-2 border-b border-stroke dark:border-dark-3">
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white w-10"></th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white">User Info</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white text-center">Password</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white text-center">Active Devices</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white text-center">Account Status</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                    No users registered yet.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const activeCount = user.sessions.filter(s => s.isActive).length;
                  const isExpanded = expandedId === user.id;
                  const isEditingPass = editingPasswordUserId === user.id;
                  const isPassVisible = !!showPasswordMap[user.id];
                  const isLoadingPass = loadingPasswordId === user.id;
                  const displayedPassword = savedPasswordMap[user.id] || '';

                  return (
                    <React.Fragment key={user.id}>
                      <tr className="border-b border-stroke dark:border-dark-3 hover:bg-slate-50/50 dark:hover:bg-dark-2/30 transition-colors">
                        <td className="px-5 py-5 text-center">
                          <button onClick={() => toggleExpand(user.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </td>

                        <td className="px-5 py-5 text-sm">
                          <p className="font-bold text-dark dark:text-white">{user.name || 'Unknown user'}</p>
                          <p className="text-xs text-slate-400 font-medium">{user.phone} | {user.email || 'No email'}</p>
                        </td>

                        <td className="px-5 py-5 text-sm text-center">
                          {isEditingPass ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <input 
                                type="text"
                                value={newPasswordVal}
                                onChange={(e) => setNewPasswordVal(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSavePassword(user.id);
                                }}
                                placeholder="New Pass"
                                className="w-28 px-2 py-1 text-xs border rounded-lg border-primary bg-white dark:bg-dark-3 text-dark dark:text-white focus:outline-none"
                                autoFocus
                              />
                              <button 
                                onClick={() => handleSavePassword(user.id)}
                                disabled={savingPassword}
                                className="p-1.5 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all text-xs font-bold flex items-center gap-1"
                                title="Save Password"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => setEditingPasswordUserId(null)}
                                className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs"
                              >
                                X
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-bold">
                                {isPassVisible ? (
                                  <span className="text-primary bg-primary/10 px-2 py-0.5 rounded">{displayedPassword}</span>
                                ) : (
                                  "••••••••"
                                )}
                              </span>
                              <button 
                                onClick={() => handleTogglePassword(user.id)}
                                disabled={isLoadingPass}
                                className="text-slate-400 hover:text-primary dark:hover:text-slate-200 transition-colors"
                                title={isPassVisible ? "Hide password" : "Show password"}
                              >
                                {isLoadingPass ? (
                                  <span className="w-4 h-4 border-2 border-slate-300 border-t-primary rounded-full animate-spin inline-block" />
                                ) : isPassVisible ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                              <button 
                                onClick={() => {
                                  setEditingPasswordUserId(user.id);
                                  setNewPasswordVal('');
                                }}
                                className="px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold transition-all"
                              >
                                Change
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-5 text-sm text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${activeCount >= 2 ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10' : 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10'}`}>
                            {activeCount} / 2 Devices
                          </span>
                        </td>

                        <td className="px-5 py-5 text-sm text-center">
                          {user.accountStatus === 'SUSPENDED' || user.isBlocked ? (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 px-2.5 py-1 rounded-full text-xs font-semibold">
                              <Ban className="w-3.5 h-3.5" /> Suspended
                            </span>
                          ) : user.accountStatus === 'HOLD' ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 px-2.5 py-1 rounded-full text-xs font-semibold">
                              <ShieldAlert className="w-3.5 h-3.5" /> On Hold
                            </span>
                          ) : user.accountStatus === 'EXPIRED' ? (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-300 dark:bg-slate-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                              <Ban className="w-3.5 h-3.5" /> Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10 px-2.5 py-1 rounded-full text-xs font-semibold">
                              <CheckCircle className="w-3.5 h-3.5" /> Active
                            </span>
                          )}
                          {user.expiresAt && (
                            <div className="text-[10px] text-slate-400 mt-1">
                              Expires: {new Date(user.expiresAt).toLocaleDateString()}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-5 text-sm text-right relative">
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                            className="text-slate-500 hover:text-slate-800 dark:hover:text-white p-2 rounded-lg bg-slate-100 dark:bg-dark-3 transition-colors"
                          >
                            Actions <ChevronDown className="w-4 h-4 inline" />
                          </button>
                          
                          {openDropdownId === user.id && (
                            <div className="absolute right-8 top-12 mt-1 w-48 bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-xl shadow-lg z-50 py-2 text-left">
                              <button onClick={() => handleAccountAction(user.id, 'UNBLOCK')} className="w-full px-4 py-2 text-sm text-green hover:bg-slate-50 dark:hover:bg-dark-3 text-left">
                                Activate / Unblock
                              </button>
                              <button onClick={() => handleAccountAction(user.id, 'HOLD')} className="w-full px-4 py-2 text-sm text-amber-600 hover:bg-slate-50 dark:hover:bg-dark-3 text-left">
                                Put on Hold
                              </button>
                              <button onClick={() => handleAccountAction(user.id, 'SUSPEND')} className="w-full px-4 py-2 text-sm text-red hover:bg-slate-50 dark:hover:bg-dark-3 text-left">
                                Suspend Account
                              </button>
                              <button onClick={() => { setTimeLimitUserId(user.id); setOpenDropdownId(null); }} className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-slate-50 dark:hover:bg-dark-3 text-left">
                                Set Time Limit
                              </button>
                              <div className="border-t border-stroke dark:border-dark-3 my-1"></div>
                              <button onClick={() => handleAccountAction(user.id, 'DELETE')} className="w-full px-4 py-2 text-sm text-red font-bold hover:bg-slate-50 dark:hover:bg-dark-3 text-left flex items-center gap-2">
                                <Trash2 className="w-4 h-4" /> Permanent Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-slate-50/50 dark:bg-dark-3/20 border-b border-stroke dark:border-dark-3">
                          <td colSpan={6} className="px-10 py-6">
                            <div className="border border-stroke dark:border-dark-3 rounded-xl overflow-hidden bg-white dark:bg-dark-2 shadow-inner">
                              <div className="px-5 py-4 border-b border-stroke dark:border-dark-3 bg-gray-2 dark:bg-dark-3/50 flex justify-between items-center">
                                <h4 className="font-semibold text-sm text-dark dark:text-white flex items-center gap-1.5">
                                  <Monitor className="w-4 h-4 text-primary" /> Active Login Sessions
                                </h4>
                              </div>
                              
                              <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-dark-3 border-b border-stroke dark:border-dark-3 text-xs font-semibold text-slate-500 uppercase">
                                  <tr>
                                    <th className="px-5 py-3">IP Address</th>
                                    <th className="px-5 py-3">User Agent / Browser</th>
                                    <th className="px-5 py-3">Last Seen</th>
                                    <th className="px-5 py-3">Session Status</th>
                                    <th className="px-5 py-3 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                                  {user.sessions.length === 0 ? (
                                    <tr>
                                      <td colSpan={5} className="px-5 py-6 text-center text-xs text-slate-400 font-medium">
                                        No active or historical login logs.
                                      </td>
                                    </tr>
                                  ) : (
                                    user.sessions.map((session) => (
                                      <tr key={session.id} className="text-xs hover:bg-slate-50/30 dark:hover:bg-dark-3/10 transition-colors">
                                        <td className="px-5 py-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                                          {session.ipAddress || '127.0.0.1'}
                                        </td>
                                        <td className="px-5 py-4 max-w-xs truncate text-slate-500 dark:text-slate-400" title={session.userAgent || ''}>
                                          {session.userAgent || 'Unknown Browser'}
                                        </td>
                                        <td className="px-5 py-4 text-slate-400">
                                          {new Date(session.lastSeen).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4">
                                          {session.isActive ? (
                                            <span className="text-green font-bold">Active</span>
                                          ) : (
                                            <span className="text-slate-400">Terminated</span>
                                          )}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                          {session.isActive && (
                                            <button 
                                              onClick={() => handleTerminateSession(user.id, session.id)}
                                              className="text-red hover:bg-red/10 p-1.5 rounded-lg border border-transparent hover:border-red-200 transition-all flex items-center justify-center gap-1 ml-auto"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" /> Terminate
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {timeLimitUserId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-dark border border-stroke dark:border-dark-3">
            <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">Set Account Time Limit</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Expire At</label>
                <input 
                  type="datetime-local" 
                  value={timeLimitValue}
                  onChange={(e) => setTimeLimitValue(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-dark-3"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setTimeLimitUserId(null)}
                  className="rounded-lg border border-stroke px-4 py-2 font-medium hover:bg-slate-50 dark:border-dark-3 dark:hover:bg-dark-3"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (!timeLimitValue) return alert('Select date');
                    handleAccountAction(timeLimitUserId, 'LIMIT_TIME', { expiresAt: new Date(timeLimitValue).toISOString() });
                  }}
                  className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90"
                >
                  Save Limit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-dark border border-stroke dark:border-dark-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark dark:text-white">নতুন ইউজার তৈরি করুন</h3>
                  <p className="text-xs text-slate-400">নতুন অ্যাকাউন্ট তৈরি করতে নিচের তথ্য পূরণ করুন</p>
                </div>
              </div>
              <button
                onClick={() => { setShowCreateModal(false); setCreateFormData({ name: '', phone: '', email: '', password: '', confirmPassword: '', role: 'USER' }); }}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-3 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">ইউজারের নাম <span className="text-slate-400">(ঐচ্ছিক)</span></label>
                <input
                  type="text"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="যেমন: মোহাম্মদ রাশেদুল"
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">মোবাইল নম্বর <span className="text-red">*</span></label>
                <input
                  type="tel"
                  value={createFormData.phone}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="যেমন: 01712345678"
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">ইমেইল <span className="text-slate-400">(ঐচ্ছিক)</span></label>
                <input
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="যেমন: user@example.com"
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">পাসওয়ার্ড <span className="text-red">*</span></label>
                <input
                  type="text"
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 text-sm font-mono"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">পাসওয়ার্ড নিশ্চিত করুন <span className="text-red">*</span></label>
                <input
                  type="text"
                  value={createFormData.confirmPassword}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreateUser(); }}
                  placeholder="পাসওয়ার্ড আবার লিখুন"
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 text-sm font-mono"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">অ্যাকাউন্ট ধরন</label>
                <select
                  value={createFormData.role}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 text-sm"
                >
                  <option value="USER">ইউজার (সাধারণ)</option>
                  <option value="ADMIN">অ্যাডমিন</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stroke dark:border-dark-3">
              <button
                onClick={() => { setShowCreateModal(false); setCreateFormData({ name: '', phone: '', email: '', password: '', confirmPassword: '', role: 'USER' }); }}
                className="rounded-lg border border-stroke px-4 py-2 font-medium hover:bg-slate-50 dark:border-dark-3 dark:hover:bg-dark-3 text-sm"
              >
                বাতিল
              </button>
              <button
                onClick={handleCreateUser}
                disabled={creatingUser}
                className="rounded-lg bg-primary px-5 py-2 font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
              >
                {creatingUser ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                    তৈরি হচ্ছে...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    ইউজার তৈরি করুন
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
