'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'


const COLOR_PRESETS = [
  { name: 'ネイビー×ゴールド（デフォルト）', color_main: '#1a2744', accent: '#b8954a' },
  { name: 'ディープグリーン×ゴールド', color_main: '#1a3a2a', accent: '#c9a84c' },
  { name: 'チャコール×テラコッタ', color_main: '#2c2c2c', accent: '#c4704a' },
  { name: 'ミッドナイトブルー×シルバー', color_main: '#1a1f3c', accent: '#8899aa' },
]


const SITE_FIELDS = [
  { key: 'site_name', label: 'サイト名', type: 'text' },
  { key: 'contact_email', label: '通知メールアドレス', type: 'email' },
  { key: 'reply_days', label: '問い合わせ返信目安', type: 'text' },
  { key: 'footer_text', label: 'フッターテキスト', type: 'text' },
]


export default function SettingsPage() {
  const [values, setValues] = useState({})
  const [original, setOriginal] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(null)


  useEffect(() => {
    loadData()
  }, [])


  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_API + '?sheet=サイト全体設定')
      const rows = await res.json()
