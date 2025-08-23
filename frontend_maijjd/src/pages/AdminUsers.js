import React, { useEffect, useState } from 'react';
import apiService from '../services/api';

const AdminUsers = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const qs = new URLSearchParams({ q, page: String(page), pageSize: String(pageSize), sortBy, sortDir }).toString();
        const res = await apiService.get(`/admin/users?${qs}`);
        const payload = res?.data || res;
        if (mounted) {
          setRows(payload?.data || payload || []);
          setTotal(payload?.paging?.total || (payload?.data||[]).length);
        }
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, [q, page, pageSize, sortBy, sortDir]);

  const updateRole = async (id, role) => {
    await apiService.request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
    setRows(rows.map(r => r.id===id? { ...r, role } : r));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin • Users</h1>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <input value={q} onChange={e=>{setPage(1); setQ(e.target.value);}} placeholder="Search name or email" className="px-2 py-1 border rounded text-sm" />
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-2 py-1 border rounded text-sm">
          <option value="created_at">Created</option>
          <option value="email">Email</option>
          <option value="name">Name</option>
          <option value="role">Role</option>
        </select>
        <select value={sortDir} onChange={e=>setSortDir(e.target.value)} className="px-2 py-1 border rounded text-sm">
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <select value={pageSize} onChange={e=>setPageSize(Number(e.target.value))} className="px-2 py-1 border rounded text-sm">
          {[10,20,50,100].map(n=> <option key={n} value={n}>{n}/page</option>)}
        </select>
      </div>
      {loading ? 'Loading…' : (
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-50"><tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Created</th>
            <th></th>
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.email}</td>
                <td className="p-2">{r.role}</td>
                <td className="p-2">{r.created_at || r.createdAt}</td>
                <td className="p-2 text-right space-x-2">
                  <button onClick={()=>updateRole(r.id, 'user')} className="px-2 py-0.5 border rounded text-xs">Make User</button>
                  <button onClick={()=>updateRole(r.id, 'admin')} className="px-2 py-0.5 border rounded text-xs">Make Admin</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-3 flex items-center justify-between text-sm">
        <div>Total: {total}</div>
        <div className="space-x-2">
          <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
          <span>Page {page}</span>
          <button disabled={(page*pageSize)>=total} onClick={()=>setPage(p=>p+1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;


