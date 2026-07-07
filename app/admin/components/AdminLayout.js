'use client'
import { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { id: 'dashboard', label: 'ダッシュボード', icon: '🏠', href: '/admin' },
  { id: 'site-settings', label: 'サイト設定', icon: '⚙️', href: '/admin/site-settings' },
  { id: 'page-content', label: 'ページコンテンツ', icon: '✏️', href: '/admin/page-content' },
  { id: 'services', label: 'サービス管理', icon: '🛠️', href: '/admin/services' },
  { id: 'news', label: 'お知らせ管理', icon: '📰', href: '/admin/news' },
  { id: 'staff', label: 'スタッフ管理', icon: '👥', href: '/admin/staff-manage' },
  { id: 'voice', label: 'お客様の声', icon: '💬', href: '/admin/voice' },
  { id: 'recruit', label: '採用管理', icon: '📋', href: '/admin/recruit-manage' },
  { id: 'access', label: 'アクセス情報', icon: '📍', href: '/admin/access-manage' },
  { id: 'pricing', label: '料金プラン', icon: '💴', href: '/admin/pricing-manage' },
  { id: 'faq', label: 'よくある質問', icon: '❓', href: '/admin/faq-manage' },
  { id: 'schedule', label: '1日の流れ', icon: '⏰', href: '/admin/schedule-manage' },
  { id: 'availability', label: '空き情報', icon: '📅', href: '/admin/availability-manage' },
]
export default function AdminLayout({ children, current }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* モバイルヘッダー */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#1a2744', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '56px' }}>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>管理画面</span>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', padding: '8px' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* オーバーレイ */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.5)' }}
        />
      )}

      {/* サイドバー */}
      <aside style={{
        position: 'fixed', top: '56px', left: 0, bottom: 0, zIndex: 200,
        width: '220px', background: '#1a2744', overflowY: 'auto',
        transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        paddingBottom: '32px'
      }}>
        <nav style={{ padding: '8px 0' }}>
          {navItems.map(item => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 20px', color: current === item.id ? '#d4af6a' : 'rgba(255,255,255,0.75)',
                background: current === item.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                textDecoration: 'none', fontSize: '14px', fontWeight: current === item.id ? '600' : '400',
                borderLeft: current === item.id ? '3px solid #d4af6a' : '3px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <main style={{ flex: 1, marginTop: '56px', padding: '32px 24px', maxWidth: '900px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
