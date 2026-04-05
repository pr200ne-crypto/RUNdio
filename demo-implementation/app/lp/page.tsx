"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Play, ArrowRight, Mail, Lock } from 'lucide-react'
import Image from 'next/image'

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function LpPage() {
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
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Play fill="white" size={14} className="text-white ml-0.5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">RUNdio</span>
          </div>
          <button
            onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            はじめる
          </button>
        </div>
      </nav>

      {/* ============================================ */}
      {/* Hero - full-bleed photo with text overlay    */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background photo */}
        <Image
          src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1920&q=80"
          alt="Runner on a city road at sunrise"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/20" />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm text-white rounded-full text-sm font-bold mb-8 border border-white/20"
          >
            パーソナル・ランニング・ラジオ
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-8xl font-black leading-[1.05] tracking-tight text-white"
          >
            走る。聴く。
            <br />
            もっと、楽しむ。
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-lg md:text-xl text-white/80 max-w-xl mx-auto leading-relaxed"
          >
            あなたのペースに合わせたAI実況で、
            毎日のランニングが特別な体験に変わります。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              無料ではじめる
              <ArrowRight size={20} />
            </button>
            <span className="text-sm text-white/50">登録は30秒で完了</span>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* Feature 1: Plan                              */}
      {/* ============================================ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=960&q=80"
                alt="Runner checking a route on phone"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div>
              <span className="text-sm font-bold text-blue-500 tracking-wider uppercase">Plan</span>
              <h2 className="mt-3 text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                好きなルートを、
                <br />好きなように。
              </h2>
              <p className="mt-6 text-lg text-slate-500 leading-relaxed">
                距離やペースの好みに合わせたルートを選択。ゴール後に立ち寄りたい銭湯やカフェなどのPOIを番組に組み込んで、あなただけの「今日の一本」をプランニングします。
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================ */}
      {/* Feature 2: Run                               */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn delay={0.1} className="order-2 md:order-1">
            <div>
              <span className="text-sm font-bold text-blue-500 tracking-wider uppercase">Run</span>
              <h2 className="mt-3 text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                走りに寄り添う
                <br />AI実況。
              </h2>
              <p className="mt-6 text-lg text-slate-500 leading-relaxed">
                走行中、AIがリアルタイムにあなただけの番組を生成します。ペースに合わせた応援、近づいてきたスポットの紹介、疲れた時の一言——まるでラジオパーソナリティが隣にいるように。
              </p>
            </div>
          </FadeIn>
          <FadeIn className="order-1 md:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=960&q=80"
                alt="Runner with earphones on a morning jog"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================ */}
      {/* Feature 3: Review                            */}
      {/* ============================================ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=960&q=80"
                alt="Runner relaxing at a cafe after a run"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div>
              <span className="text-sm font-bold text-blue-500 tracking-wider uppercase">Review</span>
              <h2 className="mt-3 text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                走るたびに、
                <br />次が楽しみになる。
              </h2>
              <p className="mt-6 text-lg text-slate-500 leading-relaxed">
                走行データを自動で記録・分析。距離やペースの推移を振り返りながら、次のチャレンジルートや新しいPOIを提案。続けるほどに、ランニングの世界が広がります。
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================ */}
      {/* Stats                                        */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 text-center mb-16">
              ソロランを、もっと自由に。
            </h2>
          </FadeIn>
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "3", unit: "ステップ", label: "で走り出せる" },
              { value: "∞", unit: "パターン", label: "のAI実況" },
              { value: "0", unit: "円", label: "で始められる" },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div>
                  <div className="text-5xl md:text-7xl font-black text-blue-600">{s.value}</div>
                  <div className="mt-1 text-sm font-bold text-blue-400">{s.unit}</div>
                  <div className="mt-1 text-sm text-slate-400">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA - full bleed photo                       */}
      {/* ============================================ */}
      <section className="relative py-32 px-6">
        <Image
          src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&q=80"
          alt="Runner on a bridge at golden hour"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/70" />
        <FadeIn>
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              さあ、走り出そう。
            </h2>
            <p className="mt-4 text-blue-100 text-lg">
              あなたの最初の番組が待っています。
            </p>
            <button
              onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-8 px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              アカウントを作成
              <ArrowRight size={18} />
            </button>
          </div>
        </FadeIn>
      </section>

      {/* ============================================ */}
      {/* Auth                                         */}
      {/* ============================================ */}
      <section id="auth" className="py-24 px-6 bg-white">
        <div className="max-w-lg mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <Play fill="white" size={18} className="text-white ml-0.5" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {isLogin ? 'おかえりなさい' : 'RUNdioをはじめる'}
              </h2>
              <p className="mt-2 text-slate-400 text-sm">
                {isLogin ? 'アカウントにログインしてください' : '無料アカウントを作成しましょう'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mb-6"
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
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-blue-100 focus:border-blue-400 outline-none transition-all bg-blue-50/30 placeholder:text-slate-300"
                  placeholder="メールアドレス" required
                />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-blue-100 focus:border-blue-400 outline-none transition-all bg-blue-50/30 placeholder:text-slate-300"
                  placeholder="パスワード" required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit" disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? '処理中...' : (isLogin ? 'ログイン' : '無料で登録する')}
              </button>
            </form>

            <p className="mt-6 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                {isLogin ? 'アカウントをお持ちでない方はこちら' : '既にアカウントをお持ちの方はこちら'}
              </button>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <Play fill="white" size={10} className="text-white ml-0.5" />
            </div>
            <span className="font-bold text-slate-700">RUNdio</span>
          </div>
          <p className="text-xs text-slate-400">&copy; 2026 RUNdio Project</p>
        </div>
      </footer>
    </div>
  )
}
