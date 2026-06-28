'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const navItems = [
  { id: 'dashboard', label: 'ダッシュボード', href: '/admin', icon: '🏠' },
  { id: 'content', label: 'コンテンツ編集', href: '/admin/content', icon: '✏️' },
  { id: 'services', label: 'サービス管理', href: '/admin/services', icon: '🛠️' },
  { id: 'settings', label: '基本設定', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminLayout({ children, current }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_authed') !== 'true') {
      router.push('/admin')
    }
  }, [router])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authed')
    router.push('/admin')
  }

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const sidebarStyle = isMobile ? {
    position: 'fixed', top: 0, left: sidebarOpen ? 0 : '-240px',
    width: '240px', height: '100%', zIndex: 200,
    transition: 'left 0.25s ease',
    background: '#1a2744', display: 'flex', flexDirection: 'column',
    boxShadow: sidebarOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none',
  } : {
    width: '220px', background: '#1a2744',
    display: 'flex', flexDirection: 'column', flexShrink: 0,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7', fontFamily: '"-apple-system", BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* オーバーレイ（スマホ時にサイドバー外タップで閉じる） */}
      {isMobile && sidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 199, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', lineHeight: '1.3' }}>COCO&amp;Bridge</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>管理画面</div>
          </div>
          {isMobile && (
            <button
              onClick={closeSidebar}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '20px', cursor: 'pointer', lineHeight: 1, padding: '4px' }}
              aria-label="メニューを閉じる"
            >✕</button>
          )}
        </div>
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map(item => (
            <a
              key={item.id}
              href={item.href}
              onClick={isMobile ? closeSidebar : undefined}
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
            onClick={handleLogout}
            style={{ width: '100%', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
          >
            ログアウト
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* スマホ用トップバー */}
        {isMobile && (
          <div style={{
            height: '52px', background: '#1a2744', display: 'flex', alignItems: 'center',
            padding: '0 16px', gap: '12px', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer', lineHeight: 1, padding: '4px' }}
              aria-label="メニューを開く"
            >☰</button>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>COCO&amp;Bridge 管理画面</span>
          </div>
        )}
        <main style={{ flex: 1, padding: isMobile ? '20px 16px' : '32px', overflowY: 'auto', maxWidth: '900px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
