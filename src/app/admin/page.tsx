'use client';

import { useState } from 'react';

interface ConsultantStats {
  name: string;
  weekly: number;
  monthly: number;
  yearly: number;
  allTime: number;
  recent: { clientName: string; projectType: string; date: string }[];
}

interface StatsData {
  stats: ConsultantStats[];
  totals: { weekly: number; monthly: number; yearly: number; allTime: number };
  period: { weekStart: string; monthStart: string; yearStart: string };
  generatedAt: string;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StatsData | null>(null);
  const [error, setError] = useState('');

  const fetchStats = async (pwd: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': pwd },
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error('Invalid password');
        throw new Error('Failed to load stats');
      }
      const json = await res.json();
      setData(json);
      setAuthenticated(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats(password);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const consultantTitle = (name: string) => {
    if (name === 'Jon Tyler Akers') return 'Sr. Development Consultant & President';
    if (name === 'Tristan Gardner') return 'Sr. Development Consultant';
    return 'Jr. Development Consultant';
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif text-white tracking-wide">AKERS DEVELOPMENT</h1>
            <p className="text-brand-stone text-sm mt-2">Admin Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white p-8 space-y-4">
            <label className="block text-sm font-medium text-brand-charcoal">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter admin password"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-dark text-white px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif tracking-wide">AKERS DEVELOPMENT</h1>
            <p className="text-brand-stone text-sm mt-1">Consultant Performance Dashboard</p>
          </div>
          <button
            onClick={() => fetchStats(password)}
            className="text-sm text-brand-sand hover:text-white transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'This Week', value: data.totals.weekly, color: '#6B7B5E' },
            { label: 'This Month', value: data.totals.monthly, color: '#B8976A' },
            { label: 'This Year', value: data.totals.yearly, color: '#2D2D2D' },
            { label: 'All Time', value: data.totals.allTime, color: '#8B7D6B' },
          ].map((card) => (
            <div key={card.label} className="bg-white p-6 border border-gray-200">
              <p className="text-sm text-gray-500 uppercase tracking-wide">{card.label}</p>
              <p className="text-4xl font-bold mt-2" style={{ color: card.color }}>
                {card.value}
              </p>
              <p className="text-xs text-gray-400 mt-1">total submissions</p>
            </div>
          ))}
        </div>

        {/* Consultant Breakdown */}
        <h2 className="text-lg font-semibold text-brand-charcoal mb-4">Consultant Breakdown</h2>
        <div className="space-y-4">
          {data.stats.map((consultant) => (
            <div key={consultant.name} className="bg-white border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-charcoal">{consultant.name}</h3>
                  <p className="text-sm text-brand-stone">{consultantTitle(consultant.name)}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-brand-charcoal">{consultant.allTime}</p>
                  <p className="text-xs text-gray-400">all time</p>
                </div>
              </div>

              {/* Period stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{consultant.weekly}</p>
                  <p className="text-xs text-gray-500">This Week</p>
                </div>
                <div className="bg-gray-50 p-3 text-center">
                  <p className="text-2xl font-bold" style={{ color: '#B8976A' }}>{consultant.monthly}</p>
                  <p className="text-xs text-gray-500">This Month</p>
                </div>
                <div className="bg-gray-50 p-3 text-center">
                  <p className="text-2xl font-bold text-brand-charcoal">{consultant.yearly}</p>
                  <p className="text-xs text-gray-500">This Year</p>
                </div>
              </div>

              {/* Recent submissions */}
              {consultant.recent.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Recent Submissions</p>
                  <div className="space-y-1">
                    {consultant.recent.map((sub, i) => (
                      <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50">
                        <span className="text-brand-charcoal">{sub.clientName}</span>
                        <span className="text-gray-400">{sub.projectType}</span>
                        <span className="text-gray-400 text-xs">{formatDate(sub.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {consultant.recent.length === 0 && (
                <p className="text-sm text-gray-400 italic">No submissions yet</p>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8 text-center">
          Last updated: {formatDate(data.generatedAt)}
        </p>
      </div>
    </div>
  );
}
