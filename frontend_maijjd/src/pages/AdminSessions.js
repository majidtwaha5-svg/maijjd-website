import React, { useEffect, useState } from 'react';
import apiService from '../services/api';

const AdminSessions = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState({});
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const qs = new URLSearchParams({ email, page: String(page), pageSize: String(pageSize), from, to, sortBy, sortDir }).toString();
        const res = await apiService.get(`/admin/sessions?${qs}`);
        const payload = res?.data || res;
        if (mounted) {
          setRows(payload?.data || payload || []);
          setTotal(payload?.paging?.total || (payload?.data||[]).length);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [email, page, pageSize, from, to, sortBy, sortDir]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin • Sessions</h1>
        <a href={`/api/admin/sessions/export.csv?email=${encodeURIComponent(email)}`} className="px-3 py-1 border rounded text-sm">Export CSV</a>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <input value={email} onChange={e=>{setPage(1); setEmail(e.target.value);}} placeholder="Filter by email" className="px-2 py-1 border rounded text-sm" />
        <input type="date" value={from} onChange={e=>{setFrom(e.target.value); setPage(1);}} className="px-2 py-1 border rounded text-sm" />
        <input type="date" value={to} onChange={e=>{setTo(e.target.value); setPage(1);}} className="px-2 py-1 border rounded text-sm" />
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-2 py-1 border rounded text-sm">
          <option value="created_at">Created</option>
          <option value="user_email">Email</option>
          <option value="ip">IP</option>
        </select>
        <select value={sortDir} onChange={e=>setSortDir(e.target.value)} className="px-2 py-1 border rounded text-sm">
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <select value={pageSize} onChange={e=>setPageSize(Number(e.target.value))} className="px-2 py-1 border rounded text-sm">
          {[10,20,50,100].map(n=> <option key={n} value={n}>{n}/page</option>)}
        </select>
        <a href={`${apiService.baseUrl}/admin/sessions/export.csv?${new URLSearchParams({email, from, to, sortBy, sortDir}).toString()}`} className="px-2 py-1 border rounded text-sm" rel="noreferrer">Export CSV</a>
      </div>
      {loading ? 'Loading…' : (
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-50"><tr><th className="p-2"><input type="checkbox" onChange={e=>{
            const checked = e.target.checked; const map={}; rows.forEach(r=>map[r.id]=checked); setSelected(map);
          }} /></th><th className="p-2 text-left">User</th><th className="p-2 text-left">IP</th><th className="p-2 text-left">Created</th><th></th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2"><input type="checkbox" checked={!!selected[r.id]} onChange={e=> setSelected({...selected, [r.id]: e.target.checked})} /></td>
                <td className="p-2">{r.userEmail}</td>
                <td className="p-2">{r.ip}</td>
                <td className="p-2">{r.createdAt}</td>
                <td className="p-2 text-right"><button onClick={async()=>{await apiService.delete(`/admin/sessions/${r.id}`); setRows(rows.filter(x=>x.id!==r.id));}} className="px-2 py-0.5 border rounded text-xs text-red-600">Revoke</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-2 flex gap-2">
        <button onClick={async()=>{
          const ids = Object.keys(selected).filter(k=>selected[k]); if (ids.length===0) return;
          await apiService.post('/admin/sessions/bulk-delete',{ ids });
          setRows(rows.filter(r=>!ids.includes(r.id))); setSelected({});
        }} className="px-3 py-1 border rounded text-sm">Bulk Revoke</button>
        <button onClick={async()=>{
          await apiService.post('/admin/sessions/bulk-delete',{ allFiltered:true, filters:{ email, from, to } });
          setRows([]); setSelected({});
        }} className="px-3 py-1 border rounded text-sm text-red-600">Revoke Filtered</button>
      </div>
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

export default AdminSessions;
