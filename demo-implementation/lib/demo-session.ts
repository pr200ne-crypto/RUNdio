/** デモ用「ログイン」状態（sessionStorage）。本番の認証では置き換える。 */

export const DEMO_SESSION_KEY = "rundio_demo_session_v1";

export function setDemoSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DEMO_SESSION_KEY, "1");
}

export function clearDemoSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DEMO_SESSION_KEY);
}

export function hasDemoSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(DEMO_SESSION_KEY) === "1";
}
