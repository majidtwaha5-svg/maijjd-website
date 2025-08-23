import React, { useEffect, useState } from 'react';
import apiService from '../services/api';

const AdminInvoices = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
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
        const qs = new URLSearchParams({ status, minAmount, maxAmount, from, to, page: String(page), pageSize: String(pageSize), sortBy, sortDir }).toString();
        const res = await apiService.get(`/admin/invoices?${qs}`);
        const payload = res?.data || res;
        if (mounted) {
          setRows(payload?.data || payload || []);
          setTotal(payload?.paging?.total || (payload?.data||[]).length);
        }
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, [status, minAmount, maxAmount, from, to, page, pageSize, sortBy, sortDir]);

  const createInvoice = async () => {
    const res = await apiService.post('/admin/invoices', { amount: 100, status: 'paid' });
    const p = res?.data || res; setRows([...(rows||[]), (p.data||p)]);
  };

  const exportCsv = () => { window.location.href = '/api/admin/invoices/export.csv'; };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin • Invoices</h1>
        <div className="space-x-2">
          <button onClick={createInvoice} className="px-3 py-1 border rounded text-sm">+ Create Test Invoice</button>
          <button onClick={exportCsv} className="px-3 py-1 border rounded text-sm">Export CSV</button>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select value={status} onChange={e=>{setPage(1); setStatus(e.target.value);}} className="px-2 py-1 border rounded text-sm">
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
        <input value={minAmount} onChange={e=>{setPage(1); setMinAmount(e.target.value);}} placeholder="Min" className="px-2 py-1 border rounded text-sm w-20" />
        <input value={maxAmount} onChange={e=>{setPage(1); setMaxAmount(e.target.value);}} placeholder="Max" className="px-2 py-1 border rounded text-sm w-20" />
        <input type="date" value={from} onChange={e=>{setFrom(e.target.value); setPage(1);}} className="px-2 py-1 border rounded text-sm" />
        <input type="date" value={to} onChange={e=>{setTo(e.target.value); setPage(1);}} className="px-2 py-1 border rounded text-sm" />
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-2 py-1 border rounded text-sm">
          <option value="created_at">Created</option>
          <option value="amount">Amount</option>
          <option value="status">Status</option>
        </select>
        <select value={sortDir} onChange={e=>setSortDir(e.target.value)} className="px-2 py-1 border rounded text-sm">
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <select value={pageSize} onChange={e=>setPageSize(Number(e.target.value))} className="px-2 py-1 border rounded text-sm">
          {[10,20,50,100].map(n=> <option key={n} value={n}>{n}/page</option>)}
        </select>
        <a href={`${apiService.baseURL}/admin/invoices/export.csv?${new URLSearchParams({ status, minAmount, maxAmount, from, to, sortBy, sortDir }).toString()}`} className="px-2 py-1 border rounded text-sm" rel="noreferrer">Export CSV</a>
      </div>
      {loading ? 'Loading…' : (
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-50"><tr><th className="p-2"><input type="checkbox" onChange={e=>{ const m={}; rows.forEach(r=>m[r.id]=e.target.checked); setSelected(m); }}/></th><th className="p-2 text-left">Invoice</th><th className="p-2 text-left">Amount</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Date</th><th></th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2"><input type="checkbox" checked={!!selected[r.id]} onChange={e=> setSelected({...selected, [r.id]: e.target.checked})} /></td>
                <td className="p-2">{r.id}</td>
                <td className="p-2">${(r.amount||0).toLocaleString()}</td>
                <td className="p-2">{r.status||'n/a'}</td>
                <td className="p-2">{r.createdAt}</td>
                <td className="p-2 text-right space-x-2">
                  <button onClick={async()=>{await apiService.patch(`/admin/invoices/${r.id}`,{ status:'refunded' }); setRows(rows.map(x=>x.id===r.id?{...x,status:'refunded'}:x));}} className="px-2 py-0.5 border rounded text-xs">Refund</button>
                  <button onClick={async()=>{await apiService.delete(`/admin/invoices/${r.id}`); setRows(rows.filter(x=>x.id!==r.id));}} className="px-2 py-0.5 border rounded text-xs text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-2 flex gap-2">
        <button onClick={async()=>{ const ids = Object.keys(selected).filter(k=>selected[k]); if(ids.length===0) return; await apiService.post('/admin/invoices/bulk',{ ids, action:'refund' }); setRows(rows.map(r=> ids.includes(r.id)?{...r,status:'refunded'}:r)); setSelected({}); }} className="px-3 py-1 border rounded text-sm">Bulk Refund</button>
        <button onClick={async()=>{ const ids = Object.keys(selected).filter(k=>selected[k]); if(ids.length===0) return; await apiService.post('/admin/invoices/bulk',{ ids, action:'delete' }); setRows(rows.filter(r=> !ids.includes(r.id))); setSelected({}); }} className="px-3 py-1 border rounded text-sm text-red-600">Bulk Delete</button>
        <button onClick={async()=>{ await apiService.post('/admin/invoices/bulk',{ allFiltered:true, action:'refund', filters:{ status, minAmount, maxAmount, from, to } }); setRows(rows.map(r=> ({...r, status: 'refunded'}))); }} className="px-3 py-1 border rounded text-sm">Refund Filtered</button>
        <button onClick={async()=>{ await apiService.post('/admin/invoices/bulk',{ allFiltered:true, action:'delete', filters:{ status, minAmount, maxAmount, from, to } }); setRows([]); setSelected({}); }} className="px-3 py-1 border rounded text-sm text-red-600">Delete Filtered</button>
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

export default AdminInvoices;
