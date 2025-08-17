import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../services/api';

const defaultPlans = [
  { id: 'standard', name: 'Standard', price: 50, features: ['Core features', 'Essential usage', 'Community support'] },
  { id: 'premium', name: 'Premium', price: 199, features: ['Everything in Standard', 'Advanced tools', 'Higher limits', 'Priority support'] },
];

const SERVICE_TIERS = [25, 30, 35, 45, 50, 195];
const SOFTWARE_TIERS = [49, 59, 99, 119, 199, 299, 399];

// Explicit two-tier pricing by software product name
const PRODUCT_PRICING = {
  'Maijjd CRM Pro': { standard: 5900, premium: 19900 },
  'Maijjd CRM Suite': { standard: 5900, premium: 19900 },
  'Maijjd Analytics Suite': { standard: 7900, premium: 39900 },
  'Maijjd Security Shield': { standard: 29900, premium: 59900 },
  'Maijjd Cloud Manager': { standard: 11900, premium: 34900 },
  'Maijjd Development Studio': { standard: 5900, premium: 24900 },
  'Maijjd Web Builder Pro': { standard: 4900, premium: 17900 },
  'Maijjd Infrastructure Manager': { standard: 19900, premium: 42900 },
  'Maijjd Marketing Automation': { standard: 4900, premium: 15900 },
  'Maijjd Project Management Pro': { standard: 2500, premium: 8900 },
  'Maijjd Data Science Studio': { standard: 19900, premium: 59900 },
  'Maijjd Customer Support AI': { standard: 3500, premium: 12900 },
  'Maijjd Financial Analytics': { standard: 11900, premium: 34900 },
  'Maijjd Healthcare Analytics': { standard: 19900, premium: 49900 },
  'Maijjd Education Platform': { standard: 2500, premium: 7900 },
};

export default function Billing() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialPlan = urlParams.get('plan') || 'standard';
  const type = urlParams.get('type') || 'software'; // 'service' | 'software'
  const customParam = urlParams.get('custom'); // cents
  const customName = urlParams.get('name') || null;
  const productPrices = (type === 'software' && customName) ? PRODUCT_PRICING[customName] || null : null;
  const initialSelected = (customParam && Number(customParam) > 0)
    ? 'custom'
    : (defaultPlans.find(p => p.id === initialPlan) ? initialPlan : 'standard');
  const [selected, setSelected] = useState(initialSelected);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const chosen = useMemo(() => defaultPlans.find(p => p.id === selected), [selected]);
  const hasCustom = Boolean(customParam && Number(customParam) > 0);
  const [customCents, setCustomCents] = useState(() => {
    if (hasCustom) return Number(customParam);
    if (productPrices) return productPrices.standard; // default to Standard if arriving by name only
    return null;
  });
  const effectiveCents = customCents ?? (hasCustom ? Number(customParam) : null);
  const effectiveDollars = effectiveCents != null ? Math.round(effectiveCents / 100) : null;
  const ctaLabel = effectiveCents != null
    ? `Add Card & Subscribe • $${effectiveDollars}/mo`
    : (selected === 'premium' ? 'Add Card & Subscribe • $199/mo' : 'Add Card & Subscribe • $50/mo');
  const showOnlySelectedProduct = Boolean(type === 'software' && (productPrices || hasCustom));
  const showServiceTiers = !showOnlySelectedProduct && (type === 'service' || !type);
  const showSoftwareTiers = !showOnlySelectedProduct && (type === 'software' || !type);

  const startCheckout = async () => {
    try {
      setBusy(true);
      setError('');
      // If a specific product price is active, honor it
      if (effectiveCents != null) {
        const res = await apiService.startCheckout('custom', Number(effectiveCents));
        const url = res?.url || res?.data?.url;
        if (url) { window.location.href = url; return; }
        navigate(`/register?plan=custom&price=${effectiveCents}`);
        return;
      }
      const cents = chosen.id === 'premium' ? 19900 : 5000;
      const res = await apiService.startCheckout(chosen.id, cents);
      const url = res?.url || res?.data?.url;
      if (url) {
        window.location.href = url;
        return;
      }
      // Fallback to register
      navigate(`/register?plan=${chosen.id}`);
    } catch (e) {
      setBusy(false);
      setError('Unable to start checkout. Please try again.');
      // eslint-disable-next-line no-alert
      alert('Unable to start checkout.');
    }
  };

  const manageBilling = async () => {
    try {
      setBusy(true);
      setError('');
      // If you store Stripe customerId in profile, pass it here; otherwise fallback
      const profile = await apiService.getProfile().catch(() => null);
      const customerId = profile?.customerId || profile?.data?.customerId || null;
      const res = await apiService.openBillingPortal(customerId);
      const url = res?.url || res?.data?.url;
      if (url) {
        window.location.href = url;
        return;
      }
      navigate('/dashboard?billing=manage');
    } catch (e) {
      setBusy(false);
      setError('Unable to open billing portal.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing</h1>
        <p className="text-gray-600 mb-8">Choose a plan and add your card to start your subscription.</p>

        {/* Custom selection (from Services/Software card or named product) */}
        {(hasCustom || productPrices) && (
          <div className="mb-6 border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Selected</div>
                <div className="text-lg font-semibold">{customName || (type==='service'?'Service Category':'Software Tool')}</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">${effectiveDollars}/mo</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">You can proceed below, or choose a different plan.</div>
          </div>
        )}

        {/* Core platform standard/premium (hidden when a specific product selection is active) */}
        {!showOnlySelectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {defaultPlans.map(p => (
              <button key={p.id} onClick={() => setSelected(p.id)} className={`text-left border rounded-lg p-5 bg-white hover:shadow transition ${selected===p.id?'border-blue-600 ring-2 ring-blue-200':''}`} aria-pressed={selected===p.id}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{p.name}</h2>
                  <div className="text-blue-600 font-bold">${p.price}/mo</div>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {p.features.map((f,i)=>(<li key={i}>{f}</li>))}
                </ul>
              </button>
            ))}
          </div>
        )}

        {/* Tiered grids: hide when a specific product selection is active */}
        {!showOnlySelectedProduct && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {showServiceTiers && (
            <div className="border rounded-lg p-5 bg-white">
              <h3 className="text-lg font-semibold mb-3">Service Categories</h3>
              <div className="flex flex-wrap gap-2">
                {SERVICE_TIERS.map((d)=> (
                  <button key={d} onClick={()=>{ navigate(`/billing?type=service&custom=${d*100}&name=${encodeURIComponent('Service Category')}`); }} className="px-3 py-2 text-sm rounded-lg border bg-gray-50 hover:bg-gray-100">${d}/mo</button>
                ))}
              </div>
            </div>
          )}
          {showSoftwareTiers && (
            <div className="border rounded-lg p-5 bg-white">
              <h3 className="text-lg font-semibold mb-3">Software Solutions</h3>
              <div className="flex flex-wrap gap-2">
                {SOFTWARE_TIERS.map((d)=> (
                  <button key={d} onClick={()=>{ navigate(`/billing?type=software&custom=${d*100}&name=${encodeURIComponent('Software Tool')}`); }} className="px-3 py-2 text-sm rounded-lg border bg-gray-50 hover:bg-gray-100">${d}/mo</button>
                ))}
              </div>
            </div>
          )}
        </div>
        )}

        {/* When a named product is selected, show only its two options */}
        {showOnlySelectedProduct && productPrices && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[{id:'standard',label:'Standard',cents:productPrices.standard},{id:'premium',label:'Premium',cents:productPrices.premium}].map(opt => (
              <button key={opt.id} onClick={() => { setSelected(opt.id); setCustomCents(opt.cents); }} className={`text-left border rounded-lg p-5 bg-white hover:shadow transition ${selected===opt.id?'border-blue-600 ring-2 ring-blue-200':''}`} aria-pressed={selected===opt.id}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{opt.label}</h2>
                  <div className="text-blue-600 font-bold">${Math.round(opt.cents/100)}/mo</div>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {opt.id==='premium' ? (
                    <>
                      <li>Everything in Standard</li>
                      <li>Advanced tools</li>
                      <li>Higher limits</li>
                      <li>Priority support</li>
                    </>
                  ) : (
                    <>
                      <li>Core features</li>
                      <li>Essential usage</li>
                      <li>Community support</li>
                    </>
                  )}
                </ul>
              </button>
            ))}
          </div>
        )}

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <div className="flex items-center gap-3">
          <button disabled={busy} onClick={startCheckout} className="px-5 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-60">{busy?'Processing…':ctaLabel}</button>
          <button disabled={busy} onClick={manageBilling} className="px-5 py-3 bg-white border rounded-lg disabled:opacity-60">Manage Billing</button>
          <button disabled={busy} onClick={()=>navigate(-1)} className="px-5 py-3 bg-gray-100 rounded-lg disabled:opacity-60">Back</button>
        </div>
      </div>
    </div>
  );
}


