"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Monitor, Ban, CheckCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

type Session = {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  deviceFingerprint: string;
  isActive: boolean;
  lastSeen: string;
  createdAt: string;
};

type Student = {
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
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [timeLimitUserId, setTimeLimitUserId] = useState<string | null>(null);
  const [timeLimitValue, setTimeLimitValue] = useState<string>('');

  // Close dropdown on click outside logic could be added here, but omitted for brevity
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sessions?type=pending');
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAccountAction = async (userId: string, action: string, payload?: any) => {
    let confirmMsg = "Are you sure?";
    if (action === 'BLOCK' || action === 'SUSPEND') confirmMsg = "Are you sure you want to suspend this student? All their active sessions will be terminated immediately.";
    if (action === 'UNBLOCK') confirmMsg = "Are you sure you want to activate/unblock this student?";
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
        fetchStudents();
      } else {
        alert("Operation failed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTerminateSession = async (userId: string, sessionId: string) => {
    if (!confirm("Are you sure you want to terminate this session? The student will be logged out on that device.")) return;

    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'DELETE_SESSION' })
      });
      if (res.ok) {
        // Update local state
        setStudents(students.map(s => {
          if (s.id === userId) {
            return {
              ...s,
              sessions: s.sessions.map(sess => sess.id === sessionId ? { ...sess, isActive: false } : sess)
            };
          }
          return s;
        }));
      } else {
        alert("Operation failed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading sessions & devices...</div>;

  return (
    <>
      <div className="mb-8">
        <h2 className="text-heading-6 font-bold text-dark dark:text-white">
          Pending Users
        </h2>
        <p className="font-medium text-slate-500">Manage accounts that are on hold, suspended, or expired.</p>
      </div>

      <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-stroke-dark dark:bg-gray-dark overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-dark-2 border-b border-stroke dark:border-dark-3">
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white w-10"></th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white">Student Info</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white text-center">Active Devices</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white text-center">Account Status</th>
                <th className="px-5 py-4.5 font-semibold text-sm text-dark dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                    No students registered yet.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const activeCount = student.sessions.filter(s => s.isActive).length;
                  const isExpanded = expandedId === student.id;

                  return (
                    <React.Fragment key={student.id}>
                      <tr className="border-b border-stroke dark:border-dark-3 hover:bg-slate-50/50 dark:hover:bg-dark-2/30 transition-colors">
                        <td className="px-5 py-5 text-center">
                          <button onClick={() => toggleExpand(student.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </td>
                        <td className="px-5 py-5 text-sm">
                          <p className="font-bold text-dark dark:text-white">{student.name || 'Unknown student'}</p>
                          <p className="text-xs text-slate-400 font-medium">{student.phone} | {student.email || 'No email'}</p>
                        </td>
                        <td className="px-5 py-5 text-sm text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${activeCount >= 2 ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10' : 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10'}`}>
                            {activeCount} / 2 Devices
                          </span>
                        </td>
                        <td className="px-5 py-5 text-sm text-center">
                          {student.accountStatus === 'SUSPENDED' || student.isBlocked ? (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 px-2.5 py-1 rounded-full text-xs font-semibold">
                              <Ban className="w-3.5 h-3.5" /> Suspended
                            </span>
                          ) : student.accountStatus === 'HOLD' ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 px-2.5 py-1 rounded-full text-xs font-semibold">
                              <ShieldAlert className="w-3.5 h-3.5" /> On Hold
                            </span>
                          ) : student.accountStatus === 'EXPIRED' ? (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-300 dark:bg-slate-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                              <Ban className="w-3.5 h-3.5" /> Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10 px-2.5 py-1 rounded-full text-xs font-semibold">
                              <CheckCircle className="w-3.5 h-3.5" /> Active
                            </span>
                          )}
                          {student.expiresAt && (
                            <div className="text-[10px] text-slate-400 mt-1">
                              Expires: {new Date(student.expiresAt).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-5 text-sm text-right relative">
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === student.id ? null : student.id)}
                            className="text-slate-500 hover:text-slate-800 dark:hover:text-white p-2 rounded-lg bg-slate-100 dark:bg-dark-3 transition-colors"
                          >
                            Actions <ChevronDown className="w-4 h-4 inline" />
                          </button>
                          
                          {openDropdownId === student.id && (
                            <div className="absolute right-8 top-12 mt-1 w-48 bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-xl shadow-lg z-50 py-2 text-left">
                              <button onClick={() => handleAccountAction(student.id, 'UNBLOCK')} className="w-full px-4 py-2 text-sm text-green hover:bg-slate-50 dark:hover:bg-dark-3 text-left">
                                Activate / Unblock
                              </button>
                              <button onClick={() => handleAccountAction(student.id, 'HOLD')} className="w-full px-4 py-2 text-sm text-amber-600 hover:bg-slate-50 dark:hover:bg-dark-3 text-left">
                                Put on Hold
                              </button>
                              <button onClick={() => handleAccountAction(student.id, 'SUSPEND')} className="w-full px-4 py-2 text-sm text-red hover:bg-slate-50 dark:hover:bg-dark-3 text-left">
                                Suspend Account
                              </button>
                              <button onClick={() => { setTimeLimitUserId(student.id); setOpenDropdownId(null); }} className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-slate-50 dark:hover:bg-dark-3 text-left">
                                Set Time Limit
                              </button>
                              <div className="border-t border-stroke dark:border-dark-3 my-1"></div>
                              <button onClick={() => handleAccountAction(student.id, 'DELETE')} className="w-full px-4 py-2 text-sm text-red font-bold hover:bg-slate-50 dark:hover:bg-dark-3 text-left flex items-center gap-2">
                                <Trash2 className="w-4 h-4" /> Permanent Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Expanded sessions sub-table */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50 dark:bg-dark-3/20 border-b border-stroke dark:border-dark-3">
                          <td colSpan={5} className="px-10 py-6">
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
                                  {student.sessions.length === 0 ? (
                                    <tr>
                                      <td colSpan={5} className="px-5 py-6 text-center text-xs text-slate-400 font-medium">
                                        No active or historical login logs.
                                      </td>
                                    </tr>
                                  ) : (
                                    student.sessions.map((session) => (
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
                                              onClick={() => handleTerminateSession(student.id, session.id)}
                                              className="text-red hover:bg-red/10 p-1.5 rounded-lg border border-transparent hover:border-red-200 transition-all flex items-center justify-center gap-1 ml-auto"
                                              title="Terminate device session"
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
      {/* Time Limit Modal */}
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
    </>
  );
}
