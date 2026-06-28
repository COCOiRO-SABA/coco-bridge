'use client'
import { useState } from 'react'
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
]
export default function AdminLayout({ children, current }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}
      <aside style={{
        width: '220px', background: '#1a2744', display: 'flex', flexDirection: 'column',
        flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50,
        transform: menuOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.25s ease',
      }}
      className="admin-sidebar"
      >
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>COCO&amp;Bridge</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>管理画面</div>
          </div>
          <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '20px', cursor: 'pointer', padding: '4px' }}>✕</button>
        </div>
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {navItems.map(item => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 20px', textDecoration: 'none',
                color: current === item.id ? 'white' : 'rgba(255,255,255,0.6)',
                background: current === item.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                fontSize: '13px', fontWeight: current === item.id ? '600' : '400',
                borderLeft: current === item.id ? '3px solid #b8954a' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a href="https://coco-bridge.com" target="_blank" rel="noreferrer"
            style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: '10px' }}>
            ↗ サイトを確認
          </a>
          <button
            onClick={() => { sessionStorage.removeItem('admin_authed'); window.location.href = '/admin' }}
            style={{ width: '100%', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
          >
            ログアウト
          </button>
        </div>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: '#1a2744', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 30 }}
          className="admin-header">
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>☰</button>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
            {navItems.find(n => n.id === current)?.label || 'ダッシュボード'}
          </div>
          <a href="https://coco-bridge.com" target="_blank" rel="noreferrer"
            style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            ↗ サイト確認
          </a>
        </header>
        <main style={{ flex: 1, padding: '24px 20px', overflowY: 'auto', maxWidth: '900px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar { position: sticky !important; top: 0 !important; height: 100vh !important; transform: translateX(0) !important; }
          .admin-header { display: none !important; }
        }
        @media (max-width: 767px) {
          .admin-sidebar { transform: ${menuOpen ? 'translateX(0)' : 'translateX(-100%)'}; }
        }
      `}</style>
    </div>
  )
}
