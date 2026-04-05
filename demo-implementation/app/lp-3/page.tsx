"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Mail, Lock, Star, Route, Radio } from 'lucide-react'
import Image from 'next/image'

export default function LpPattern3() {
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
    <div className="min-h-screen bg-[#FFFBF5] text-[#2D3748] font-sans">
      {/* Nav */}
      <nav className="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#FF6B6B] flex items-center justify-center">
            <Play fill="white" size={16} className="text-white ml-1" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#2D3748]">RUNdio</span>
        </div>
        <button
          onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-6 py-2.5 bg-[#2D3748] text-white rounded-full text-sm font-bold hover:bg-[#1A202C] transition-colors"
        >
          ログイン
        </button>
      </nav>

      {/* Hero */}
      <section className="pt-10 pb-20 px-4 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-4xl mx-auto aspect-[4/3] md:aspect-[21/9] rounded-[3rem] overflow-hidden mb-12 shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1920&q=80"
            alt="Runner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6 drop-shadow-lg">
              ランニングを、<br />
              もっとカラフルに。
            </h1>
            <button
              onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-[#FF6B6B] text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
            >
              無料で始める
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-[#4A5568] max-w-2xl mx-auto font-medium leading-relaxed"
        >
          AIがあなたのペースに合わせて実況ラジオを生成。<br />
          いつものコースが、特別なエンターテイメントに変わります。
        </motion.p>
      </section>

      {/* Playful Cards */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Card 1 */}
          <div className="bg-[#EBF8FF] p-10 rounded-[3rem] border-2 border-[#BEE3F8] flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 text-[#3182CE] shadow-sm">
              <Route size={36} />
            </div>
            <h3 className="text-2xl font-black text-[#2C5282] mb-4">ルート＆スポット</h3>
            <p className="text-[#4A5568] text-lg leading-relaxed">
              走りたい距離と、立ち寄りたいカフェや銭湯などのスポットを選ぶだけ。あなただけのオリジナルコースが完成します。
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#FEFCBF] p-10 rounded-[3rem] border-2 border-[#F6E05E] flex flex-col items-center text-center md:translate-y-12">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 text-[#D69E2E] shadow-sm">
              <Radio size={36} />
            </div>
            <h3 className="text-2xl font-black text-[#975A16] mb-4">AIパーソナリティ</h3>
            <p className="text-[#744210] text-lg leading-relaxed">
              走行データに合わせてAIがリアルタイムに実況。応援メッセージやスポットの豆知識で、走るモチベーションをキープ。
            </p>
          </div>

        </div>
      </section>

      {/* Auth Section */}
      <section id="auth" className="py-32 px-4 mt-12">
        <div className="max-w-md mx-auto bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-2 border-[#EDF2F7]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#FF6B6B] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Star fill="white" size={24} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-[#2D3748] tracking-tight mb-2">
              {isLogin ? 'おかえりなさい' : 'さあ、始めよう'}
            </h2>
            <p className="text-[#718096] font-medium">
              {isLogin ? 'ログインしてランニングを再開' : '無料アカウントを作成'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white text-[#2D3748] border-2 border-[#E2E8F0] rounded-2xl font-bold hover:bg-[#F7FAFC] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mb-6"
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
            <div className="flex-grow border-t border-[#E2E8F0]"></div>
            <span className="flex-shrink-0 mx-4 text-[#A0AEC0] text-xs font-bold uppercase tracking-widest">または</span>
            <div className="flex-grow border-t border-[#E2E8F0]"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#E2E8F0] focus:border-[#FF6B6B] outline-none transition-all bg-[#F7FAFC] placeholder:text-[#A0AEC0] font-medium"
                placeholder="メールアドレス" required
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#E2E8F0] focus:border-[#FF6B6B] outline-none transition-all bg-[#F7FAFC] placeholder:text-[#A0AEC0] font-medium"
                placeholder="パスワード" required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-[#2D3748] text-white rounded-2xl font-bold hover:bg-[#1A202C] transition-colors disabled:opacity-50 shadow-md"
            >
              {loading ? '処理中...' : (isLogin ? 'ログイン' : 'メールで登録')}
            </button>
          </form>

          <p className="mt-8 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-[#4A5568] hover:text-[#2D3748] underline underline-offset-4">
              {isLogin ? '新しくアカウントを作成する' : '既にアカウントをお持ちの方'}
            </button>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-[#A0AEC0] text-sm font-medium">
        <p>&copy; 2026 RUNdio Project. All rights reserved.</p>
      </footer>
    </div>
  )
}
