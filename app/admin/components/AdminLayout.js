'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const navItems = [
  { id: 'dashboard', label: 'ダッシュボード', href: '/admin', icon: '🏠' },
  { id: 'content', label: 'コンテンツ編集', href: '/admin/content', icon: '✏️' },
  { id: 'services', label: 'サービス管理', href: '/admin/services', icon: '🛠️' },
  { id: 'settings', label: '基本設定', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminLayout({ children, current }) {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_authed') !== 'true') {
      router.push('/admin')
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authed')
    router.push('/admin')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7', fontFamily: '"-apple-system", BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: '#1a2744', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', lineHeight: '1.3' }}>COCO&amp;Bridge</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>管理画面</div>
        </div>
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map(item => (
            <a
              key={item.id}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 20px', textDecoration: 'none',
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
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxWidth: '900px' }}>
        {children}
      </main>
    </div>
  )
}
