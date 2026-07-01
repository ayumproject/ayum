'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Standing {
  id: string
  position: number
  team_name: string
  team_logo_url: string | null
  played: number
  won: number
  drawn: number
  lost: number
  goal_diff: number
  points: number
  league_name: string
  season: string
  is_active: boolean
}

const SQL_CREATE = `CREATE TABLE public.standings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  position integer NOT NULL DEFAULT 0,
  team_name character varying NOT NULL,
  team_logo_url text,
  played integer NOT NULL DEFAULT 0,
  won integer NOT NULL DEFAULT 0,
  drawn integer NOT NULL DEFAULT 0,
  lost integer NOT NULL DEFAULT 0,
  goal_diff integer NOT NULL DEFAULT 0,
  points integer NOT NULL DEFAULT 0,
  league_name character varying NOT NULL DEFAULT 'Süper Lig',
  season character varying NOT NULL DEFAULT '2025-26',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT standings_pkey PRIMARY KEY (id)
);
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes okuyabilir" ON public.standings FOR SELECT USING (true);
CREATE POLICY "Adminler yonetebilir" ON public.standings USING (true) WITH CHECK (true);`

const emptyForm = {
  position: 1, team_name: '', team_logo_url: '', played: 0,
  won: 0, drawn: 0, lost: 0, goal_diff: 0, points: 0,
  league_name: 'Süper Lig', season: '2025-26', is_active: true,
}

const numFields: [string, string][] = [
  ['position','Sıra'], ['played','Oynan'], ['won','Galibiyet'],
  ['drawn','Beraberlik'], ['lost','Mağlubiyet'], ['goal_diff','Gol Farkı'], ['points','Puan'],
]

export default function PuanTablosuPage() {
  const [rows, setRows] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editRow, setEditRow] = useState<Standing | null>(null)
  const [message, setMessage] = useState('')
  const [isErr, setIsErr] = useState(false)
  const [noTable, setNoTable] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const sb = createClient()

  async function load() {
    setLoading(true)
    const { data, error } = await sb.from('standings').select('*').order('position')
    if (error) { if (error.code === '42P01') setNoTable(true); setLoading(false); return }
    setRows(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function msg(text: string, err = false) { setMessage(text); setIsErr(err); setTimeout(() => setMessage(''), 3000) }
  function openCreate() { setEditRow(null); setForm({ ...emptyForm, position: rows.length + 1 }); setShowForm(true) }
  function openEdit(r: Standing) {
    setEditRow(r)
    setForm({ position: r.position, team_name: r.team_name, team_logo_url: r.team_logo_url || '', played: r.played, won: r.won, drawn: r.drawn, lost: r.lost, goal_diff: r.goal_diff, points: r.points, league_name: r.league_name, season: r.season, is_active: r.is_active })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.team_name.trim()) { msg('Takım adı zorunludur.', true); return }
    setSaving(true)
    const payload = { ...form, team_logo_url: form.team_logo_url || null }
    if (editRow) {
      const { error } = await sb.from('standings').update(payload).eq('id', editRow.id)
      error ? msg('Hata: ' + error.message, true) : (msg('Güncellendi!'), setShowForm(false), load())
    } else {
      const { error } = await sb.from('standings').insert(payload)
      error ? msg('Hata: ' + error.message, true) : (msg('Eklendi!'), setShowForm(false), load())
    }
    setSaving(false)
  }

  async function deleteRow(id: string) {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await sb.from('standings').delete().eq('id', id); load()
  }

  const cls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]'

  if (noTable) return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2B2C35] mb-6" style={{ letterSpacing: '-0.03em' }}>Puan Tablosu</h1>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <p className="font-bold text-amber-800 mb-3">Veritabanı tablosu bulunamadı</p>
        <p className="text-sm text-amber-700 mb-4">Supabase SQL Editor&apos;de şu komutu çalıştırın:</p>
        <pre className="bg-white border border-amber-200 rounded-xl p-4 text-xs overflow-x-auto text-gray-800 font-mono leading-relaxed">{SQL_CREATE}</pre>
        <button onClick={() => { setNoTable(false); load() }} className="mt-4 bg-amber-600 text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-amber-700">Tekrar kontrol et</button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>Puan Tablosu</h1>
          <p className="text-sm text-[#747A88] mt-0.5">{rows.length} takım</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Takım Ekle
        </button>
      </div>

      {message && <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold ${isErr ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>{message}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-extrabold text-[#2B2C35] text-lg">{editRow ? 'Düzenle' : 'Yeni Takım'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#747A88]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1 block">Takım Adı *</label>
                <input value={form.team_name} onChange={(e) => setForm(p => ({ ...p, team_name: e.target.value }))} placeholder="Galatasaray" className={cls} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1 block">Logo URL</label>
                <input value={form.team_logo_url} onChange={(e) => setForm(p => ({ ...p, team_logo_url: e.target.value }))} placeholder="https://..." className={cls} />
              </div>
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1 block">Lig</label>
                <input value={form.league_name} onChange={(e) => setForm(p => ({ ...p, league_name: e.target.value }))} className={cls} />
              </div>
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1 block">Sezon</label>
                <input value={form.season} onChange={(e) => setForm(p => ({ ...p, season: e.target.value }))} placeholder="2025-26" className={cls} />
              </div>
              {numFields.map(([key, label]) => (
                <div key={key}>
                  <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1 block">{label}</label>
                  <input type="number" value={(form as Record<string, unknown>)[key] as number}
                    onChange={(e) => setForm(p => ({ ...p, [key]: Number(e.target.value) }))} className={cls} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-[#747A88] font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">İptal</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#2B59FF] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F8FF]">
                <tr>
                  {['#', 'Takım', 'O', 'G', 'B', 'M', 'AV', 'P', ''].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-bold text-[#747A88]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-[#F5F8FF] transition-colors">
                    <td className="px-4 py-3 font-bold text-[#2B59FF]">{r.position}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {r.team_logo_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.team_logo_url} alt={r.team_name} className="w-5 h-5 object-contain" />
                        )}
                        <span className="font-semibold text-[#2B2C35]">{r.team_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#747A88]">{r.played}</td>
                    <td className="px-4 py-3 text-[#747A88]">{r.won}</td>
                    <td className="px-4 py-3 text-[#747A88]">{r.drawn}</td>
                    <td className="px-4 py-3 text-[#747A88]">{r.lost}</td>
                    <td className="px-4 py-3 text-[#747A88]">{r.goal_diff > 0 ? '+' : ''}{r.goal_diff}</td>
                    <td className="px-4 py-3 font-extrabold text-[#2B59FF]">{r.points}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(r)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#2B59FF] hover:bg-[#2B59FF] hover:text-white transition-colors">Düzenle</button>
                        <button onClick={() => deleteRow(r.id)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <div className="text-center py-16 text-sm text-[#747A88]">Henüz takım eklenmemiş</div>}
          </div>
        </div>
      )}
    </div>
  )
}
