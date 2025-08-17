import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useMemo(() => new URLSearchParams(location.search).get('token') || '', [location.search]);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (!token) { setErr('Invalid or missing reset token.'); return; }
    if (!password || password.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setErr('Passwords do not match.'); return; }
    setBusy(true);
    try {
      await apiService.resetPassword(token, password);
      setMsg('Password updated. You can now sign in.');
      setTimeout(() => navigate('/'), 1500);
    } catch (e) {
      setErr('Reset failed. The link may be expired.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md bg-white border rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
        <p className="text-sm text-gray-600 mb-4">Enter a new password for your account.</p>
        {err && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}
        {msg && <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{msg}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="New password" className="w-full px-3 py-2 border rounded-lg" />
          <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Confirm password" className="w-full px-3 py-2 border rounded-lg" />
          <button type="submit" disabled={busy} className="w-full px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">{busy? 'Saving…':'Save password'}</button>
        </form>
      </div>
    </div>
  );
}


