import React, { useEffect, useState } from 'react';
import apiService from '../services/api';

const AdminTracking = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sortBy, setSortBy] = useState('t');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const qs = new URLSearchParams({ event, page: String(page), pageSize: String(pageSize), from, to, sortBy, sortDir }).toString();
        const res = await apiService.get(`/admin/tracking?${qs}`);
        const payload = res?.data || res;
        if (mounted) {
          setItems(payload?.data || payload || []);
          setTotal(payload?.paging?.total || (payload?.data||[]).length);
        }
      } finally { setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, [event, page, pageSize, from, to, sortBy, sortDir]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin • Tracking</h1>
      <div className="mb-3 flex items-center gap-2">
        <input value={event} onChange={e=>{setPage(1); setEvent(e.target.value);}} placeholder="Filter by event" className="px-2 py-1 border rounded text-sm" />
        <input type="date" value={from} onChange={e=>{setFrom(e.target.value); setPage(1);}} className="px-2 py-1 border rounded text-sm" />
        <input type="date" value={to} onChange={e=>{setTo(e.target.value); setPage(1);}} className="px-2 py-1 border rounded text-sm" />
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-2 py-1 border rounded text-sm">
          <option value="t">Time</option>
          <option value="event">Event</option>
        </select>
        <select value={sortDir} onChange={e=>setSortDir(e.target.value)} className="px-2 py-1 border rounded text-sm">
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <select value={pageSize} onChange={e=>setPageSize(Number(e.target.value))} className="px-2 py-1 border rounded text-sm">
          {[20,50,100,200].map(n=> <option key={n} value={n}>{n}/page</option>)}
        </select>
        <a href={`${apiService.baseURL}/admin/tracking/export.csv?${new URLSearchParams({event, from, to, sortBy, sortDir}).toString()}`} className="px-2 py-1 border rounded text-sm" rel="noreferrer">Export CSV</a>
      </div>
      {loading ? 'Loading…' : (
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-50"><tr>
            <th className="p-2"><input type="checkbox" onChange={e=>{ const m={}; items.forEach(r=>m[r.id]=e.target.checked); setSelected(m); }} /></th>
            <th className="p-2 text-left">Event</th>
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left">Meta</th>
          </tr></thead>
          <tbody>
            {items.map(e => (
              <tr key={e.id} className="border-t">
                <td className="p-2"><input type="checkbox" checked={!!selected[e.id]} onChange={ev=> setSelected({...selected, [e.id]: ev.target.checked})} /></td>
                <td className="p-2">{e.event}</td>
                <td className="p-2">{new Date(e.t).toLocaleString()}</td>
                <td className="p-2"><pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">{JSON.stringify(e.meta||{}, null, 2)}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-2 flex gap-2">
        <button onClick={async()=>{ const ids = Object.keys(selected).filter(k=>selected[k]); if(ids.length===0) return; await apiService.post('/admin/tracking/bulk',{ ids }); setItems(items.filter(i=> !ids.includes(i.id))); setSelected({}); }} className="px-3 py-1 border rounded text-sm text-red-600">Bulk Delete</button>
        <button onClick={async()=>{ await apiService.post('/admin/tracking/bulk',{ allFiltered:true, filters:{ event, from, to } }); setItems([]); setSelected({}); }} className="px-3 py-1 border rounded text-sm text-red-600">Delete Filtered</button>
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

export default AdminTracking;
