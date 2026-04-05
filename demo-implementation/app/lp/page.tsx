"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Play, Map as MapIcon, Mic, Heart, ChevronRight, Smartphone } from 'lucide-react'

export default function LandingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        })
        if (error) throw error
        alert('確認メールを送信しました。')
      }
      router.push('/home')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-black text-primary tracking-tighter">RUNdio</div>
        <button 
          onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-4 py-2 bg-primary text-white rounded-full font-bold text-sm active:scale-95 transition-all"
        >
          はじめる
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-bold tracking-wider uppercase">
            New Running Experience
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-primary">
            ラン×レディオ：<br />
            <span className="text-accent">あなただけの</span><br />
            ランニング用ラジオ
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            走る前から走ったあとまで。RUNdioは、今日の一本を組み立て、走りながら伴走し、振り返りまで寄り添うパーソナルラジオです。
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center"
            >
              今すぐ無料で体験
              <ChevronRight className="ml-2" />
            </button>
            <div className="flex items-center gap-2 px-4 py-4 text-slate-500 font-medium">
              <Smartphone size={20} />
              スマートフォンアプリとして提供中
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          {/* Mobile Mockup Frame */}
          <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-4 ring-slate-200/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20" />
            <div className="w-full h-full bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white">
                <Play fill="currentColor" size={32} />
              </div>
              <div className="text-xl font-bold text-primary">RUNdio</div>
              <div className="text-xs text-slate-400">Loading your personal show...</div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl opacity-50" />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
              <MapIcon size={24} />
            </div>
            <h3 className="text-xl font-bold">プランニング</h3>
            <p className="text-slate-600">ルート上の施設を条件検索。ゴール後の銭湯やカフェを組み込んだ「今日の番組」を。 </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-accent/5 text-accent rounded-xl flex items-center justify-center">
              <Mic size={24} />
            </div>
            <h3 className="text-xl font-bold">パーソナルラジオ</h3>
            <p className="text-slate-600">AIがあなたのペースや状況に合わせてリアルタイムに実況。励ましと情報で、ソロランを楽しく。</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-success/5 text-success rounded-xl flex items-center justify-center">
              <Heart size={24} />
            </div>
            <h3 className="text-xl font-bold">走後の振り返り</h3>
            <p className="text-slate-600">走行データを分析し、次回の練習を提案。モチベーションを維持するパートナーに。</p>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth-section" className="py-24 px-6 bg-slate-50">
        <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-primary mb-2">
              {isLogin ? 'おかえりなさい' : 'アカウント作成'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'ログインしてランを再開しましょう' : 'RUNdioで新しいランニング体験を'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">メールアドレス</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                placeholder="runner@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">パスワード</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs px-1">{error}</p>}
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? '処理中...' : (isLogin ? 'ログイン' : '登録する')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-accent hover:underline"
            >
              {isLogin ? 'アカウントをお持ちでない方はこちら' : '既にアカウントをお持ちの方はこちら'}
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-slate-400 text-sm border-t border-slate-100">
        © 2026 RUNdio Project. Built for the future of running.
      </footer>
    </div>
  )
}
