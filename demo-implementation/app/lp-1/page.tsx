"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Mail, Lock, MapPin, Headphones, TrendingUp } from 'lucide-react'
import Image from 'next/image'

export default function LpPattern1() {
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
          email, password,
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

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200">
      {/* Floating Nav */}
      <nav className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-white/70 backdrop-blur-xl z-50 rounded-full border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-inner">
            <Play fill="white" size={12} className="text-white ml-0.5" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">RUNdio</span>
        </div>
        <button
          onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors shadow-md"
        >
          はじめる
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:pt-48 md:pb-32 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-400/20 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">AI Running Radio</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1] mb-6"
          >
            走る。<span className="text-blue-600">聴く。</span><br />
            もっと、楽しむ。
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            あなたのペースに合わせたAI実況で、毎日のランニングが特別な体験に変わります。イヤホンをつけて、走り出そう。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 mx-auto"
            >
              無料でアカウント作成
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>

        {/* Hero Image / Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto relative"
        >
          <div className="aspect-[16/9] md:aspect-[21/9] relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&q=80"
              alt="Runner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            
            {/* Floating Glass Card inside Hero */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-auto md:w-80 bg-white/20 backdrop-blur-xl border border-white/30 p-6 rounded-3xl text-white shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <Play fill="white" size={20} className="ml-1" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-200 uppercase tracking-widest">Now Playing</div>
                  <div className="font-bold text-lg">隅田川テラスコース</div>
                </div>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-1/3 rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* App-like Features Grid */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            すべてが新しい<br />ランニング体験
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">自由なプランニング</h3>
            <p className="text-slate-500 leading-relaxed">
              距離やペース、立ち寄りたいカフェや銭湯などのスポットを自由に組み込んで、あなただけのルートを作成。
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/10 flex flex-col items-center text-center md:-translate-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6 border border-white/10">
              <Headphones size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">AI実況ラジオ</h3>
            <p className="text-slate-300 leading-relaxed">
              走行中、AIがリアルタイムに番組を生成。ペースに合わせた応援やスポット紹介で、まるでパーソナリティが隣にいるよう。
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">走るたびに進化</h3>
            <p className="text-slate-500 leading-relaxed">
              走行データを自動記録。推移を振り返りながら、次のチャレンジルートや新しいスポットを提案します。
            </p>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth" className="py-24 px-4">
        <div className="max-w-md mx-auto bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Play fill="white" size={24} className="text-white ml-1" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isLogin ? 'おかえりなさい' : 'RUNdioをはじめる'}
            </h2>
            <p className="mt-2 text-slate-500 text-sm">
              {isLogin ? 'アカウントにログインして再開' : '無料でアカウントを作成'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mb-6 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Googleで{isLogin ? 'ログイン' : '登録'}
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">または</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all bg-slate-50 placeholder:text-slate-400 font-medium"
                placeholder="メールアドレス" required
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all bg-slate-50 placeholder:text-slate-400 font-medium"
                placeholder="パスワード" required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-md"
            >
              {loading ? '処理中...' : (isLogin ? 'ログイン' : 'メールで登録')}
            </button>
          </form>

          <p className="mt-8 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-blue-200">
              {isLogin ? 'アカウントを作成する' : '既にアカウントをお持ちの方'}
            </button>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>&copy; 2026 RUNdio Project. All rights reserved.</p>
      </footer>
    </div>
  )
}
