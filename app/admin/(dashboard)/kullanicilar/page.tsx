'use client'

import { useState, useEffect } from 'react'

type UserRole = 'admin' | 'editor' | 'columnist'
interface AppUser { id: string; email: string; role: UserRole; created_at: string }

export default function KullanicilarPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isErr, setIsErr] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState<AppUser | null>(null)
  const [form, setForm] = useState({ email: '', password: '', role: 'editor' as UserRole })

  async function loadUsers() {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(data.users || [])
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  function msg(text: string, err = false) { setMessage(text); setIsErr(err); setTimeout(() => setMessage(''), 4000) }

  function openCreate() {
    setEditUser(null)
    setForm({ email: '', password: '', role: 'editor' })
    setShowForm(true)
  }

  function openEdit(u: AppUser) {
    setEditUser(u)
    setForm({ email: u.email, password: '', role: u.role })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    if (editUser) {
      const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: editUser.id, role: form.role }) })
      const d = await res.json()
      d.error ? msg('Hata: ' + d.error, true) : (msg('Rol guncellendi!'), setShowForm(false), loadUsers())
    } else {
      if (!form.email || !form.password) { msg('Email ve sifre zorunludur.', true); setSaving(false); return }
      const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, role: form.role }) })
      const d = await res.json()
      d.error ? msg('Hata: ' + d.error, true) : (msg('Kullanici olusturuldu!'), setShowForm(false), loadUsers())
    }
    setSaving(false)
  }

  const roleLabel = (r: UserRole) => ({ admin: 'Admin', editor: 'Editor', columnist: 'Kose Yazari' }[r])
  const roleColor = (r: UserRole) => ({ admin: 'bg-[#EEF2FF] text-[#2B59FF]', editor: 'bg-emerald-50 text-emerald-600', columnist: 'bg-amber-50 text-amber-600' }[r])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>Kullanicilar</h1>
          <p className="text-sm text-[#747A88] mt-0.5">{users.length} kullanici</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Yeni Kullanici
        </button>
      </div>
      {message && <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold ${isErr ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>{message}</div>}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-extrabold text-[#2B2C35] text-lg">{editUser ? 'Rol Duzenle' : 'Yeni Kullanici'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#747A88]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              {editUser ? (
                <div className="bg-[#F5F8FF] rounded-xl px-4 py-3">
                  <p className="text-xs text-[#747A88] font-medium">Kullanici</p>
                  <p className="text-sm font-bold text-[#2B2C35]">{editUser.email}</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">E-posta *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="kullanici@ornek.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">Sifre *</label>
                    <input type="password" value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="En az 6 karakter"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
                  </div>
                </>
              )}
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">Rol *</label>
                <select value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value as UserRole }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]">
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="columnist">Kose Yazari</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-[#747A88] font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Iptal</button>
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
          <div className="divide-y divide-gray-50">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#F5F8FF] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#2B59FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2B2C35] truncate">{u.email}</p>
                  <p className="text-[11px] text-[#747A88] font-medium">{new Date(u.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${roleColor(u.role)}`}>{roleLabel(u.role)}</span>
                  <button onClick={() => openEdit(u)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#2B59FF] hover:bg-[#2B59FF] hover:text-white transition-colors">Rol Duzenle</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
