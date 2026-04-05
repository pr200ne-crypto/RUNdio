import Link from "next/link";
import type { Session } from "next-auth";

type Props = {
  session: Session | null;
};

export function LandingPage({ session }: Props) {
  const signedIn = !!session?.user;

  return (
    <div className="lp">
      <header className="lp-header">
        <span className="lp-brand">RUNdio</span>
        <nav className="lp-nav">
          {signedIn ? (
            <Link href="/home" className="lp-nav-link lp-nav-cta">
              アプリへ
            </Link>
          ) : (
            <>
              <Link href="/login" className="lp-nav-link">
                ログイン
              </Link>
              <Link href="/login" className="lp-nav-link lp-nav-cta">
                Google で始める
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="lp-hero">
        <p className="lp-eyebrow">ラン × レディオ</p>
        <h1 className="lp-headline">
          走る時間が、
          <br />
          <span className="lp-gradient">あなた専用番組</span>になる。
        </h1>
        <p className="lp-sub">
          ルートとチェックポイントを決めたら、伴走ラジオが距離に合わせて声をかけます。
          ソロランのモチベーションを、ラジオのリズムで支えます。
        </p>
        <div className="lp-hero-cta">
          {signedIn ? (
            <Link href="/home" className="btn-primary-lg">
              ホームを開く
            </Link>
          ) : (
            <Link href="/login" className="btn-primary-lg">
              Google でログイン
            </Link>
          )}
        </div>
      </section>

      <section className="lp-features">
        <article className="lp-feature">
          <h2>計画</h2>
          <p>距離・コース・入浴施設などのチェックポイントを、地図イメージで整理。</p>
        </article>
        <article className="lp-feature">
          <h2>伴走音声</h2>
          <p>オープニングからフィニッシュまで、番組の流れで励ましと区切りを届けます。</p>
        </article>
        <article className="lp-feature">
          <h2>疑似ラン</h2>
          <p>ブラウザ上でペースと距離をシミュレート。デモでも本番でもすぐ試せます。</p>
        </article>
      </section>

      <footer className="lp-footer">
        <p>RUNdio — 課題・学習用プロジェクト</p>
      </footer>
    </div>
  );
}
