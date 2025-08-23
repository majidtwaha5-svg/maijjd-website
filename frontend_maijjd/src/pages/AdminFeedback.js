import React, { useEffect, useState } from 'react';
import apiService from '../services/api';

const AdminFeedback = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
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
        const qs = new URLSearchParams({ status, category, email, from, to, page: String(page), pageSize: String(pageSize), sortBy, sortDir }).toString();
        const res = await apiService.get(`/admin/feedback?${qs}`);
        const payload = res?.data || res;
        if (mounted) {
          setItems(payload?.data || payload || []);
          setTotal(payload?.paging?.total || (payload?.data||[]).length);
        }
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, [status, category, email, from, to, page, pageSize, sortBy, sortDir]);

  const updateStatus = async (id, status) => {
    await apiService.patch(`/admin/feedback/${id}`, { status });
    setItems(items.map(f => f.id===id ? { ...f, status } : f));
  };

  const removeItem = async (id) => {
    await apiService.delete(`/admin/feedback/${id}`);
    setItems(items.filter(f => f.id!==id));
  };

  const exportCsv = () => {
    const qs = new URLSearchParams({ status, category, email, from, to, sortBy, sortDir }).toString();
    window.location.href = `${apiService.baseURL}/admin/feedback/export.csv?${qs}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin • Feedback</h1>
        <button onClick={exportCsv} className="px-3 py-1 border rounded text-sm">Export CSV</button>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select value={status} onChange={e=>{setPage(1); setStatus(e.target.value);}} className="px-2 py-1 border rounded text-sm">
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="resolved">Resolved</option>
        </select>
        <input value={category} onChange={e=>{setPage(1); setCategory(e.target.value);}} placeholder="Category" className="px-2 py-1 border rounded text-sm" />
        <input value={email} onChange={e=>{setPage(1); setEmail(e.target.value);}} placeholder="Email" className="px-2 py-1 border rounded text-sm" />
        <input type="date" value={from} onChange={e=>{setFrom(e.target.value); setPage(1);}} className="px-2 py-1 border rounded text-sm" />
        <input type="date" value={to} onChange={e=>{setTo(e.target.value); setPage(1);}} className="px-2 py-1 border rounded text-sm" />
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-2 py-1 border rounded text-sm">
          <option value="created_at">Created</option>
          <option value="email">Email</option>
          <option value="category">Category</option>
          <option value="status">Status</option>
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
        <ul className="divide-y">
          {items.map(f => (
            <li key={f.id} className="py-3">
              <input type="checkbox" className="mr-2" checked={!!selected[f.id]} onChange={e=> setSelected({...selected, [f.id]: e.target.checked})} />
              <div className="text-sm text-gray-500">{f.createdAt} • {f.category}</div>
              <div className="font-medium">{f.email || 'anonymous'}</div>
              <div>{f.message}</div>
              <div className="mt-2 flex items-center space-x-2 text-xs">
                <span className="px-2 py-0.5 rounded border">{f.status||'new'}</span>
                <button onClick={()=>updateStatus(f.id,'resolved')} className="px-2 py-0.5 border rounded">Resolve</button>
                <button onClick={()=>removeItem(f.id)} className="px-2 py-0.5 border rounded text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 flex gap-2">
        <button onClick={async()=>{
          const ids = Object.keys(selected).filter(k=>selected[k]); if (ids.length===0) return;
          await apiService.post('/admin/feedback/bulk',{ ids, action: 'resolve' });
          setItems(items.map(f=> ids.includes(f.id)?{...f,status:'resolved'}:f)); setSelected({});
        }} className="px-3 py-1 border rounded text-sm">Bulk Resolve</button>
        <button onClick={async()=>{
          const ids = Object.keys(selected).filter(k=>selected[k]); if (ids.length===0) return;
          await apiService.post('/admin/feedback/bulk',{ ids, action: 'delete' });
          setItems(items.filter(f=> !ids.includes(f.id))); setSelected({});
        }} className="px-3 py-1 border rounded text-sm text-red-600">Bulk Delete</button>
        <button onClick={async()=>{ await apiService.post('/admin/feedback/bulk',{ allFiltered:true, action:'resolve', filters:{ status, category, email, from, to } }); setItems(items.map(f=> ({...f, status:'resolved'}))); }} className="px-3 py-1 border rounded text-sm">Resolve Filtered</button>
        <button onClick={async()=>{ await apiService.post('/admin/feedback/bulk',{ allFiltered:true, action:'delete', filters:{ status, category, email, from, to } }); setItems([]); setSelected({}); }} className="px-3 py-1 border rounded text-sm text-red-600">Delete Filtered</button>
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

export default AdminFeedback;
