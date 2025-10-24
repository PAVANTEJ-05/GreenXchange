'use client';

import { useState, useEffect } from 'react';
import { fetchCreditInfo } from '@/contexts/MintToken'; // uses your exported function

export default function VerificationPage() {
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [credit, setCredit] = useState(null);
  const [error, setError] = useState('');

  // Map enum -> human label (same mapping used elsewhere)
  const creditEnumToLabel = {
    0: 'Green',
    1: 'Carbon',
    2: 'Water',
    3: 'Renewable'
  };

  // Try to prefill tokenId from onboardingProject saved in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('onboardingProject');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.tokenId !== undefined && parsed.tokenId !== null) {
          setTokenId(String(parsed.tokenId));
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleGetInfo = async () => {
    setError('');
    setCredit(null);

    if (tokenId === '' || isNaN(Number(tokenId))) {
      setError('Please provide a valid numeric tokenId.');
      return;
    }

    setLoading(true);
    try {
      // fetchCreditInfo is your exported function that returns the tuple/object
      const info = await fetchCreditInfo(Number(tokenId));

      // solidity tuple likely comes back as an array-like object with indices and named fields.
      // Normalize for display:
      // We handle both tuple-array and struct-like objects.
      const normalized = {
        creditType: null,
        name: null,
        location: null,
        certificateHash: null,
        exists: null,
        verified: null,
      };

      // If returned is an array-like:
      if (info && typeof info === 'object') {
        // prefer named properties if available
        if ('creditType' in info || '0' in info) {
          // several possible shapes:
          normalized.creditType = info.creditType ?? info[0] ?? null;
          normalized.name = info.name ?? info[1] ?? null;
          normalized.location = info.location ?? info[2] ?? null;
          normalized.certificateHash = info.certificateHash ?? info[3] ?? info[2] ?? null;
          // last two are usually booleans
          normalized.exists = info.exists ?? info[4] ?? null;
          normalized.verified = info.verified ?? info[5] ?? null;
        } else {
          // fallback: try index access
          normalized.creditType = info[0] ?? null;
          normalized.name = info[1] ?? null;
          normalized.location = info[2] ?? null;
          normalized.certificateHash = info[3] ?? null;
          normalized.exists = info[4] ?? null;
          normalized.verified = info[5] ?? null;
        }
      }

      setCredit(normalized);
    } catch (err) {
      console.error('fetchCreditInfo error:', err);
      // If contract reverted with "Credit missing", show friendly message
      const msg = err?.message || String(err);
      if (msg.includes('Credit missing') || msg.includes('Credit ID exists') || msg.includes('not found')) {
        setError('Credit info not found on-chain for this tokenId.');
      } else {
        setError('Failed to fetch credit info. See console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification</h1>
      <p className="text-sm text-gray-600 mb-6">
        To get your credit token info, click <strong>Get Credit Info</strong>. This will fetch the current on-chain state for the token you submitted for verification.
      </p>

      <div className="mb-4 flex items-center gap-3">
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Enter Token ID"
          className="px-3 py-2 border rounded bg-white"
        />
        <button
          onClick={handleGetInfo}
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Loading...' : 'Get Credit Info'}
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {credit && (
        <div className="bg-gray-50 border rounded p-4">
          <div className="mb-2">
            <strong>Credit Type:</strong>{' '}
            {credit.creditType !== null && credit.creditType !== undefined
              ? creditEnumToLabel[String(Number(credit.creditType))] ?? String(credit.creditType)
              : '—'}
          </div>

          <div className="mb-2">
            <strong>Project Name:</strong>{' '}
            {credit.name ?? '—'}
          </div>

          <div className="mb-2">
            <strong>Location:</strong>{' '}
            {credit.location ?? '—'}
          </div>

          <div className="mb-2 break-all">
            <strong>Certificate Hash:</strong>{' '}
            {credit.certificateHash ?? '—'}
          </div>

          <div className="mb-2">
            <strong>Exists on-chain:</strong>{' '}
            {credit.exists === null || credit.exists === undefined ? '—' : (credit.exists ? 'Yes' : 'No')}
          </div>

          {/* <div>
            <strong>Verified:</strong>{' '}
            {credit.verified === null || credit.verified === undefined ? '—' : (credit.verified ? 'Yes' : 'No')}
          </div> */}
        </div>
      )}
    </div>
  );
}
